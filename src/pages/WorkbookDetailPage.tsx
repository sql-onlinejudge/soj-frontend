import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWorkbook, getWorkbookProblems } from '../services/api'
import type { Workbook, PaginatedResponse, ProblemListItem } from '../types'
import { DifficultyBadge } from '../components/badges/DifficultyBadge'
import { ProblemList } from '../components/problem/ProblemList'
import { Pagination } from '../components/common/Pagination'
import { formatRelativeTime } from '../utils/formatters'

export function WorkbookDetailPage() {
  const { workbookId } = useParams<{ workbookId: string }>()
  const [workbook, setWorkbook] = useState<Workbook | null>(null)
  const [problemsData, setProblemsData] = useState<PaginatedResponse<ProblemListItem> | null>(null)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isProblemsLoading, setIsProblemsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = Number(workbookId)
    if (!id) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [wb, problems] = await Promise.all([
          getWorkbook(id),
          getWorkbookProblems(id, { page: 0, size: 20 }),
        ])
        setWorkbook(wb)
        setProblemsData(problems)
      } catch {
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [workbookId])

  useEffect(() => {
    if (page === 0 || !workbookId) return
    const id = Number(workbookId)

    const fetchProblems = async () => {
      setIsProblemsLoading(true)
      try {
        const problems = await getWorkbookProblems(id, { page, size: 20 })
        setProblemsData(problems)
      } catch {
        console.error('Failed to fetch problems')
      } finally {
        setIsProblemsLoading(false)
      }
    }

    fetchProblems()
  }, [page, workbookId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    )
  }

  if (notFound || !workbook) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center gap-4">
        <span className="text-text-secondary">문제집을 찾을 수 없습니다.</span>
        <Link to="/" className="text-sm text-brand-primary hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="bg-surface-panel border-b border-border-input">
        <div className="max-w-[1400px] mx-auto px-10 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            문제집 목록
          </Link>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{workbook.name}</h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
              {workbook.description}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <DifficultyBadge level={workbook.difficulty} />
              {problemsData && (
                <span className="text-xs text-text-muted" style={{ fontFamily: 'JetBrains Mono' }}>
                  {problemsData.totalElements}문제
                </span>
              )}
              <span className="text-xs text-text-muted">
                {formatRelativeTime(workbook.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-10 py-8">
        <ProblemList
          problems={problemsData?.content || []}
          isLoading={isProblemsLoading}
        />

        {problemsData && (
          <Pagination
            currentPage={problemsData.page}
            totalPages={problemsData.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}
