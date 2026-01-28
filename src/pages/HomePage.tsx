import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { getProblems } from '../services/api'
import type { PaginatedResponse, ProblemListItem } from '../types'
import { SearchInput } from '../components/problem/SearchInput'
import { FilterPanel, type SortItem } from '../components/problem/FilterPanel'
import { ProblemList } from '../components/problem/ProblemList'
import { Pagination } from '../components/common/Pagination'

export function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [minDifficulty, setMinDifficulty] = useState(1)
  const [maxDifficulty, setMaxDifficulty] = useState(5)
  const [sorts, setSorts] = useState<SortItem[]>([{ field: 'id', direction: 'asc' }])
  const [page, setPage] = useState(0)
  const [data, setData] = useState<PaginatedResponse<ProblemListItem> | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    setPage(0)
  }, [debouncedKeyword, minDifficulty, maxDifficulty, sorts])

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
  }, [debouncedKeyword, minDifficulty, maxDifficulty, sorts, page])

  return (
    <div className="min-h-screen bg-white">
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
