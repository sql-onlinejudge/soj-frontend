import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { getProblems } from '../services/api'
import type { PaginatedResponse, ProblemListItem } from '../types'
import { SearchInput } from '../components/problem/SearchInput'
import { FilterPanel, type SortItem } from '../components/problem/FilterPanel'
import { ProblemList } from '../components/problem/ProblemList'
import { Pagination } from '../components/common/Pagination'

function parseSortsFromUrl(sortParam: string | null): SortItem[] {
  if (!sortParam) return [{ field: 'id', direction: 'asc' }]
  return sortParam.split(',').map((s) => {
    const [field, direction] = s.split(':')
    return { field, direction: direction as 'asc' | 'desc' }
  })
}

function sortsToUrl(sorts: SortItem[]): string {
  return sorts.map((s) => `${s.field}:${s.direction}`).join(',')
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialKeyword = searchParams.get('q') || ''
  const initialPage = Number(searchParams.get('page')) || 0
  const initialMinDiff = Number(searchParams.get('minDiff')) || 1
  const initialMaxDiff = Number(searchParams.get('maxDiff')) || 5
  const initialSorts = parseSortsFromUrl(searchParams.get('sort'))
  const initialTrialStatus = searchParams.get('status') || null

  const [keyword, setKeyword] = useState(initialKeyword)
  const [minDifficulty, setMinDifficulty] = useState(initialMinDiff)
  const [maxDifficulty, setMaxDifficulty] = useState(initialMaxDiff)
  const [trialStatus, setTrialStatus] = useState<string | null>(initialTrialStatus)
  const [sorts, setSorts] = useState<SortItem[]>(initialSorts)
  const [page, setPage] = useState(initialPage)
  const [data, setData] = useState<PaginatedResponse<ProblemListItem> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (debouncedKeyword) params.set('q', debouncedKeyword)
    if (page > 0) params.set('page', String(page))
    if (minDifficulty > 1) params.set('minDiff', String(minDifficulty))
    if (maxDifficulty < 5) params.set('maxDiff', String(maxDifficulty))
    if (trialStatus) params.set('status', trialStatus)
    const defaultSort = sorts.length === 1 && sorts[0].field === 'id' && sorts[0].direction === 'asc'
    if (!defaultSort) params.set('sort', sortsToUrl(sorts))
    setSearchParams(params, { replace: true })
  }, [debouncedKeyword, page, minDifficulty, maxDifficulty, trialStatus, sorts, setSearchParams])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  useEffect(() => {
    setPage(0)
  }, [debouncedKeyword, minDifficulty, maxDifficulty, trialStatus, sorts])

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      try {
        const sortParams = sorts.length > 0
          ? sorts.map((s) => `${s.field}:${s.direction}`)
          : undefined
        const response = await getProblems({
          keyword: debouncedKeyword || undefined,
          minDifficulty,
          maxDifficulty,
          trialStatus: trialStatus || undefined,
          page,
          size: 14,
          sort: sortParams,
        })
        setData(response)
      } catch (error) {
        console.error('Failed to fetch problems:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblems()
  }, [debouncedKeyword, minDifficulty, maxDifficulty, trialStatus, sorts, page])

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 max-w-3xl mx-auto">
          <SearchInput value={keyword} onChange={setKeyword} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-52 shrink-0">
            <FilterPanel
              minDifficulty={minDifficulty}
              maxDifficulty={maxDifficulty}
              onDifficultyChange={(min, max) => {
                setMinDifficulty(min)
                setMaxDifficulty(max)
              }}
              trialStatus={trialStatus}
              onTrialStatusChange={setTrialStatus}
              sorts={sorts}
              onSortsChange={setSorts}
            />
          </aside>

          <main className="flex-1 flex flex-col min-h-[700px]">
            <div className="flex-1">
              <ProblemList
                problems={data?.content || []}
                isLoading={isLoading}
              />
            </div>

            {data && (
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
