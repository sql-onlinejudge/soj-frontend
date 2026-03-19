import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import {
  getProblem,
  getTestcases,
  createSubmission,
  getSubmissions,
  getSubmission,
  subscribeToSubmission,
  createRun,
  subscribeToRun,
  getRun,
  getRecommendations,
} from '../services/api'
import { useSubmissionStore } from '../stores/submissionStore'
import { useAuthStore } from '../stores/authStore'
import type {
  ProblemDetail,
  Testcase,
  SubmissionListItem,
  SubmissionDetail,
  SubmissionStatus,
  Verdict,
  RunResult,
  RecommendationResponse,
  RecommendationTrigger,
} from '../types'
import { ProblemDescription } from '../components/problem/ProblemDescription'
import { CodeEditor } from '../components/problem/CodeEditor'
import { TabPanelContainer } from '../components/submission/TabPanel'
import { ExecutionResult } from '../components/submission/ExecutionResult'
import { JudgeResult } from '../components/submission/JudgeResult'
import { SubmissionHistory } from '../components/submission/SubmissionHistory'
import { SubmissionDetailModal } from '../components/submission/SubmissionDetailModal'
import { ComingSoonModal } from '../components/common/ComingSoonModal'
import { LoginModal } from '../components/common/LoginModal'
import { Button } from '../components/common/Button'
import { RecommendationModal } from '../components/problem/RecommendationModal'
import { NotFoundPage } from './NotFoundPage'

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>()
  const navigate = useNavigate()
  const { subscribeSubmission } = useSubmissionStore()
  const { isLoggedIn } = useAuthStore()

  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [testcases, setTestcases] = useState<Testcase[]>([])
  const [code, setCode] = useState('SELECT ')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('execution')

  const [currentStatus, setCurrentStatus] = useState<SubmissionStatus | null>(null)
  const [currentVerdict, setCurrentVerdict] = useState<Verdict | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')

  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | undefined>()

  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([])

  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false)

  useEffect(() => {
    if (!problemId) return

    const fetchData = async () => {
      try {
        const [problemData, testcasesData] = await Promise.all([
          getProblem(Number(problemId)),
          getTestcases(Number(problemId), true),
        ])
        setProblem(problemData)
        setTestcases(testcasesData)
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          setNotFound(true)
        }
        console.error('Failed to fetch problem:', error)
      }
    }

    fetchData()
  }, [problemId])

  const fetchSubmissions = useCallback(async () => {
    if (!problemId) return

    setIsLoadingSubmissions(true)
    try {
      const response = await getSubmissions(Number(problemId), {
        size: 50,
      })
      setSubmissions(response.content)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }, [problemId])

  useEffect(() => {
    if (activeTab === 'history') {
      fetchSubmissions()
    }
  }, [activeTab, fetchSubmissions])

  const fetchRecommendations = useCallback(
    async (trigger: RecommendationTrigger) => {
      if (!problemId || !isLoggedIn) return

      try {
        const data = await getRecommendations(Number(problemId), trigger)
        setRecommendations(data)
        if (data.length > 0) setIsRecommendationModalOpen(true)
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      }
    },
    [problemId, isLoggedIn]
  )

  const handleSubmit = async () => {
    if (!problemId || !code.trim()) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    setIsSubmitting(true)
    setCurrentQuery(code)
    setCurrentStatus('PENDING')
    setCurrentVerdict(null)
    setActiveTab('judge')

    try {
      const { submissionId } = await createSubmission(Number(problemId), code)
      if (!submissionId) {
        throw new Error('submissionId not found in response')
      }
      setCurrentSubmissionId(submissionId)
      setCurrentStatus('RUNNING')

      const unsubscribe = subscribeToSubmission(
        Number(problemId),
        submissionId,
        (data) => {
          setCurrentStatus(data.status as SubmissionStatus)
          if (data.status === 'COMPLETED') {
            setCurrentVerdict(data.verdict as Verdict | null)
            unsubscribe()
            fetchSubmissions()
            
            // Fetch recommendations based on verdict
            const trigger: RecommendationTrigger = data.verdict === 'ACCEPTED' ? 'SOLVED' : 'LEAVING'
            fetchRecommendations(trigger)
          }
        },
        async () => {
          const detail = await getSubmission(Number(problemId), submissionId)
          setCurrentStatus(detail.status)
          setCurrentVerdict(detail.verdict)
          if (detail.status === 'COMPLETED') {
            fetchSubmissions()
            const trigger: RecommendationTrigger = detail.verdict === 'ACCEPTED' ? 'SOLVED' : 'LEAVING'
            fetchRecommendations(trigger)
          }
        }
      )

      setTimeout(async () => {
        const detail = await getSubmission(Number(problemId), submissionId)
        if (detail.status === 'COMPLETED') {
          setCurrentStatus(detail.status)
          setCurrentVerdict(detail.verdict)
          unsubscribe()
          fetchSubmissions()
          const trigger: RecommendationTrigger = detail.verdict === 'ACCEPTED' ? 'SOLVED' : 'LEAVING'
          fetchRecommendations(trigger)
        }
      }, 500)

      subscribeSubmission(
        {
          submissionId,
          problemId: Number(problemId),
          problemTitle: problem?.title || '',
        },
        (verdict) => {
          const verdictText = verdict === 'ACCEPTED' ? '정답입니다!' : '오답입니다.'
          toast(
            (t) => (
              <div className="flex items-center gap-3">
                <span>채점이 완료되었습니다. {verdictText}</span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id)
                    navigate(`/problems/${problemId}`)
                    setActiveTab('judge')
                  }}
                  className="px-3 py-1 bg-brand-primary text-text-primary rounded text-sm font-medium"
                >
                  이동하기
                </button>
              </div>
            ),
            { duration: 10000 }
          )
        }
      )
    } catch (error) {
      console.error('Failed to submit:', error)
      setCurrentStatus(null)
      toast.error('제출에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRun = async () => {
    if (!problemId || !code.trim()) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    setIsRunning(true)
    setRunResult({ runId: 0, status: 'IN_PROGRESS', results: null })
    setActiveTab('execution')

    try {
      const { runId } = await createRun(Number(problemId), code)

      const unsubscribe = subscribeToRun(
        Number(problemId),
        runId,
        (data) => {
          setRunResult(data)
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            setIsRunning(false)
            unsubscribe()
          }
        },
        async () => {
          try {
            const data = await getRun(Number(problemId), runId)
            setRunResult(data)
          } catch {
            /* empty */
          } finally {
            setIsRunning(false)
          }
        }
      )
    } catch {
      toast.error('실행에 실패했습니다.')
      setRunResult(null)
      setIsRunning(false)
    }
  }

  const handleSubmissionClick = async (submission: SubmissionListItem) => {
    try {
      const detail = await getSubmission(submission.problemId, submission.id)
      setSelectedSubmission(detail)
      setIsDetailModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch submission detail:', error)
    }
  }

  const handleProblemClick = (id: number) => {
    navigate(`/problems/${id}`)
  }

  const handleUserClick = () => {
    setIsComingSoonModalOpen(true)
  }

  if (notFound) {
    return <NotFoundPage />
  }

  if (!problem) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <p className="text-text-secondary">로딩 중...</p>
      </div>
    )
  }

  return (
    <>
      <div className="h-[calc(100vh-3.5rem)] hidden lg:block">
        <Allotment>
          <Allotment.Pane preferredSize={570} minSize={300} maxSize={1000}>
            <div className="h-full flex flex-col overflow-hidden bg-surface-panel">
              <div className="p-4 border-b border-border-input">
                <Button variant="ghost" size="sm" onClick={() => navigate('/problems')}>
                  <span className="mr-1">←</span> 목록으로
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <ProblemDescription problem={problem} testcases={testcases} />
              </div>
            </div>
          </Allotment.Pane>

          <Allotment.Pane>
            <Allotment vertical>
              <Allotment.Pane preferredSize="55%" minSize={100}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  onSubmit={handleSubmit}
                  onRun={handleRun}
                  isSubmitting={isSubmitting}
                  isRunning={isRunning}
                />
              </Allotment.Pane>

              <Allotment.Pane minSize={100}>
                <TabPanelContainer
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                >
                  {(tab) => {
                    if (tab === 'execution') {
                      return <ExecutionResult result={runResult} />
                    }
                    if (tab === 'judge') {
                      return (
                        <JudgeResult
                          status={currentStatus}
                          verdict={currentVerdict}
                          query={currentQuery}
                        />
                      )
                    }
                    if (tab === 'history') {
                      return (
                        <SubmissionHistory
                          submissions={submissions}
                          isLoading={isLoadingSubmissions}
                          onSubmissionClick={handleSubmissionClick}
                          onProblemClick={handleProblemClick}
                          onUserClick={handleUserClick}
                          currentSubmissionId={currentSubmissionId}
                        />
                      )
                    }
                    return null
                  }}
                </TabPanelContainer>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </div>

      <div className="lg:hidden min-h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="p-4 border-b border-border-input bg-surface-panel">
          <Button variant="ghost" size="sm" onClick={() => navigate('/problems')}>
            <span className="mr-1">←</span> 목록으로
          </Button>
        </div>
        <div className="h-[50vh] overflow-hidden">
          <ProblemDescription problem={problem} testcases={testcases} />
        </div>
        <div className="h-[300px]">
          <CodeEditor
            value={code}
            onChange={setCode}
            onSubmit={handleSubmit}
            onRun={handleRun}
            isSubmitting={isSubmitting}
            isRunning={isRunning}
          />
        </div>
        <div className="flex-1 min-h-[300px]">
          <TabPanelContainer
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {(tab) => {
              if (tab === 'execution') {
                return <ExecutionResult result={runResult} />
              }
              if (tab === 'judge') {
                return (
                  <JudgeResult
                    status={currentStatus}
                    verdict={currentVerdict}
                    query={currentQuery}
                  />
                )
              }
              if (tab === 'history') {
                return (
                  <SubmissionHistory
                    submissions={submissions}
                    isLoading={isLoadingSubmissions}
                    onSubmissionClick={handleSubmissionClick}
                    onProblemClick={handleProblemClick}
                    onUserClick={handleUserClick}
                    currentSubmissionId={currentSubmissionId}
                  />
                )
              }
              return null
            }}
          </TabPanelContainer>
        </div>
      </div>

      <SubmissionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        submission={selectedSubmission}
        onProblemClick={handleProblemClick}
      />

      <ComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <RecommendationModal
        isOpen={isRecommendationModalOpen}
        onClose={() => setIsRecommendationModalOpen(false)}
        recommendations={recommendations}
      />
    </>
  )
}
