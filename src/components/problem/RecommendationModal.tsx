import { Link } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { formatNumber } from '../../utils/formatters'
import type { RecommendationResponse } from '../../types'

interface RecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  recommendations: RecommendationResponse[]
}

export function RecommendationModal({ isOpen, onClose, recommendations }: RecommendationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="추천 문제" className="w-96">
      <div className="p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">추천 문제</h2>
        <div className="space-y-2">
          {recommendations.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              onClick={onClose}
              className="block p-3 rounded-md bg-surface-light hover:bg-surface-panel transition-colors"
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
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light transition-colors"
        >
          닫기
        </button>
      </div>
    </Modal>
  )
}
