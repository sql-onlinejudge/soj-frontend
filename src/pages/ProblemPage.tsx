import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getProblem,
  getTestcases,
  createSubmission,
  getSubmissions,
  getSubmission,
  subscribeToSubmission,
} from '../services/api'
import { useUserId } from '../hooks/useUserId'
import { useSubmissionStore } from '../stores/submissionStore'
import type {
  ProblemDetail,
  Testcase,
  SubmissionListItem,
  SubmissionDetail,
  SubmissionStatus,
  Verdict,
} from '../types'
import { ProblemDescription } from '../components/problem/ProblemDescription'
import { CodeEditor } from '../components/problem/CodeEditor'
import { TabPanelContainer } from '../components/submission/TabPanel'
import { ExecutionResult } from '../components/submission/ExecutionResult'
import { JudgeResult } from '../components/submission/JudgeResult'
import { SubmissionHistory } from '../components/submission/SubmissionHistory'
import { SubmissionDetailModal } from '../components/submission/SubmissionDetailModal'
import { ComingSoonModal } from '../components/common/ComingSoonModal'
import { Button } from '../components/common/Button'
import { NotFoundPage } from './NotFoundPage'

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>()
  const navigate = useNavigate()
  const userId = useUserId()
  const { subscribeSubmission } = useSubmissionStore()

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

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!problemId) return

    const fetchData = async () => {
      try {
        const [problemData, testcasesData] = await Promise.all([
          getProblem(Number(problemId)),
          getTestcases(Number(problemId)),
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
        userId,
        size: 50,
      })
      setSubmissions(response.content)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }, [problemId, userId])

  useEffect(() => {
    if (activeTab === 'history') {
      fetchSubmissions()
    }
  }, [activeTab, fetchSubmissions])

  const handleSubmit = async () => {
    if (!problemId || !code.trim()) return

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
          }
        },
        async () => {
          const detail = await getSubmission(Number(problemId), submissionId)
          setCurrentStatus(detail.status)
          setCurrentVerdict(detail.verdict)
          if (detail.status === 'COMPLETED') {
            fetchSubmissions()
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
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
        <div className="w-full lg:w-[570px] lg:shrink-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-light bg-white">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <span className="mr-1">←</span> 목록으로
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProblemDescription problem={problem} testcases={testcases} />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[400px] lg:h-[45%] min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="h-[400px] lg:flex-1 lg:h-auto min-h-0">
            <TabPanelContainer
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              {(tab) => {
                if (tab === 'execution') {
                  return <ExecutionResult result={null} />
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
      </div>

      <SubmissionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        submission={selectedSubmission}
        onProblemClick={handleProblemClick}
        onUserClick={handleUserClick}
      />

      <ComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
      />
    </>
  )
}
