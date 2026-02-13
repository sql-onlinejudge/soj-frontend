import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { getWorkbooks } from '../services/api'
import type { PaginatedResponse, Workbook } from '../types'
import { SearchInput } from '../components/problem/SearchInput'
import { Pagination } from '../components/common/Pagination'
import { DifficultyBadge } from '../components/badges/DifficultyBadge'
import { formatRelativeTime } from '../utils/formatters'

export function WorkbooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialKeyword = searchParams.get('q') || ''
  const initialPage = Number(searchParams.get('page')) || 0

  const [keyword, setKeyword] = useState(initialKeyword)
  const [page, setPage] = useState(initialPage)
  const [data, setData] = useState<PaginatedResponse<Workbook> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (debouncedKeyword) params.set('q', debouncedKeyword)
    if (page > 0) params.set('page', String(page))
    setSearchParams(params, { replace: true })
  }, [debouncedKeyword, page, setSearchParams])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  useEffect(() => {
    setPage(0)
  }, [debouncedKeyword])

  useEffect(() => {
    const fetchWorkbooks = async () => {
      setIsLoading(true)
      try {
        const response = await getWorkbooks({
          keyword: debouncedKeyword || undefined,
          page,
          size: 12,
          sort: ['id:desc'],
        })
        setData(response)
      } catch {
        console.error('Failed to fetch workbooks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkbooks()
  }, [debouncedKeyword, page])

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-10 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">문제집</h1>

        <div className="mb-6 max-w-xl">
          <SearchInput value={keyword} onChange={setKeyword} placeholder="문제집 검색…" />
        </div>

        {isLoading ? (
          <div className="bg-surface-panel rounded-lg p-8 text-center text-text-secondary" role="status">
            로딩 중...
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="bg-surface-panel rounded-lg p-8 text-center text-text-secondary" role="status">
            문제집이 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.content.map((wb) => (
                <Link
                  key={wb.id}
                  to={`/workbooks/${wb.id}`}
                  className="p-5 rounded-lg bg-surface-panel border border-border-input hover:bg-surface-muted transition-colors flex flex-col gap-3"
                >
                  <span className="text-base font-semibold text-text-primary">{wb.name}</span>
                  <span className="text-xs text-text-secondary leading-relaxed line-clamp-2">{wb.description}</span>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <DifficultyBadge level={wb.difficulty} />
                    <span className="text-[11px] text-text-muted">{formatRelativeTime(wb.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
