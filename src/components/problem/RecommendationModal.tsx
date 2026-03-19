import { Link } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { formatNumber } from '../../utils/formatters'
import type { RecommendationResponse, RecommendationTrigger } from '../../types'

interface RecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  recommendations: RecommendationResponse[]
  trigger: RecommendationTrigger
}

const MESSAGES: Record<RecommendationTrigger, { title: string; subtitle: string }> = {
  SOLVED: {
    title: '정답입니다!',
    subtitle: '실력과 비슷한 문제를 더 풀어보세요.',
  },
  LEAVING: {
    title: '혹시 어려웠나요?',
    subtitle: '도전할 만한 약간 더 쉬운 문제를 준비해봤어요.',
  },
}

export function RecommendationModal({ isOpen, onClose, recommendations, trigger }: RecommendationModalProps) {
  const { title, subtitle } = MESSAGES[trigger]

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="추천 문제" className="w-96">
      <div className="p-6">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary mt-1 mb-4">{subtitle}</p>
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
