import { Link } from 'react-router-dom'
import type { RecommendationResponse } from '../../types'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { formatNumber } from '../../utils/formatters'

interface RecommendationPanelProps {
  recommendations: RecommendationResponse[]
  isLoading?: boolean
}

export function RecommendationPanel({ recommendations, isLoading }: RecommendationPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-panel rounded-lg p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">추천 문제</h3>
        <div className="text-sm text-text-secondary">로딩 중...</div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="bg-surface-panel rounded-lg p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">추천 문제</h3>
      <div className="space-y-2">
        {recommendations.map((problem) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            className="block p-3 rounded-md bg-surface-muted hover:bg-surface-light transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <DifficultyBadge level={problem.difficulty} />
              <span className="text-sm font-medium text-text-primary truncate">
                #{problem.id} {problem.title}
              </span>
            </div>
            <div className="text-xs text-text-secondary">
              정답 {formatNumber(problem.solvedCount)} · 정답률 {problem.acceptanceRate.toFixed(1)}%
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
