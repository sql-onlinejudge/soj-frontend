import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProblems } from '../services/api'
import type { ProblemListItem } from '../types'
import { DifficultyBadge } from '../components/badges/DifficultyBadge'
import { ProblemList } from '../components/problem/ProblemList'
import { ComingSoonModal } from '../components/common/ComingSoonModal'

const WORKBOOKS = [
  { title: 'SQL 입문', desc: 'SELECT, WHERE, ORDER BY 기초 문법을 익혀보세요.', level: 1, count: 10 },
  { title: 'JOIN 마스터', desc: 'INNER, LEFT, RIGHT, CROSS JOIN을 실전으로 연습합니다.', level: 2, count: 8 },
  { title: '서브쿼리 정복', desc: '스칼라, 인라인 뷰, 상관 서브쿼리를 단계별로 학습하세요.', level: 3, count: 8 },
  { title: '윈도우 함수', desc: 'ROW_NUMBER, RANK, LEAD/LAG 등 분석 함수 모음.', level: 4, count: 6 },
  { title: '실전 최적화', desc: '인덱스, 실행 계획, 쿼리 튜닝 고급 과정입니다.', level: 5, count: 5 },
]

type SortMode = 'latest' | 'popular'

export function HomePage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<ProblemListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>('latest')
  const [keyword, setKeyword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      try {
        const sort = sortMode === 'latest' ? ['id:desc'] : ['submittedCount:desc']
        const response = await getProblems({ size: 7, sort })
        setProblems(response.content)
      } catch {
        console.error('Failed to fetch problems')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProblems()
  }, [sortMode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/problems?q=${encodeURIComponent(keyword.trim())}`)
    } else {
      navigate('/problems')
    }
  }


  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="bg-surface-panel border-b border-border-input">
        <div className="max-w-[1400px] mx-auto px-10 py-10 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-text-primary">SQL 실력을 키워보세요</h1>
            <p className="text-sm text-text-secondary">실전 문제를 풀며 SQL 쿼리 작성 능력을 단계별로 향상시킬 수 있습니다.</p>
          </div>
          <div className="flex items-center gap-8">
            {[
              { value: '000', label: '문제' },
              { value: '000', label: '제출' },
              { value: '000', label: '사용자' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-[22px] font-bold text-brand-primary" style={{ fontFamily: 'JetBrains Mono' }}>{stat.value}</span>
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-10 py-8 flex gap-6">
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  autoComplete="off"
                  className="w-full h-12 pl-12 pr-4 border border-border-input rounded-lg bg-surface-panel text-text-primary text-sm placeholder:text-text-muted outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand-primary transition-all duration-200"
                  style={{ fontFamily: 'JetBrains Mono' }}
                />
              </div>
            </form>
            <button
              onClick={() => setSortMode('latest')}
              className={`h-12 px-4 rounded-lg text-[13px] font-semibold transition-colors ${
                sortMode === 'latest'
                  ? 'bg-brand-primary text-[#0A0A0A]'
                  : 'border border-border-input text-text-secondary hover:text-text-primary'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortMode('popular')}
              className={`h-12 px-4 rounded-lg text-[13px] font-semibold transition-colors ${
                sortMode === 'popular'
                  ? 'bg-brand-primary text-[#0A0A0A]'
                  : 'border border-border-input text-text-secondary hover:text-text-primary'
              }`}
            >
              인기순
            </button>
            <Link to="/problems" className="flex items-center gap-1 text-[13px] text-text-muted hover:text-text-secondary transition-colors whitespace-nowrap">
              더보기
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <ProblemList problems={problems} isLoading={isLoading} />
        </section>

        <aside className="w-[380px] shrink-0 hidden lg:flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">문제집</h2>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 text-[13px] text-text-muted hover:text-text-secondary transition-colors">
              더보기
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {WORKBOOKS.map((wb) => (
              <button
                key={wb.title}
                onClick={() => setIsModalOpen(true)}
                className="text-left p-4 px-5 rounded-lg bg-surface-panel border border-border-input hover:bg-surface-muted transition-colors flex flex-col gap-2"
              >
                <span className="text-sm font-semibold text-text-primary">{wb.title}</span>
                <span className="text-xs text-text-secondary leading-relaxed">{wb.desc}</span>
                <div className="flex items-center gap-3">
                  <DifficultyBadge level={wb.level} />
                  <span className="text-[11px] text-text-muted">{wb.count}문제</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
