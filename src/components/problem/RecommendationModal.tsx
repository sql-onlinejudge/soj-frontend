import { Link } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { formatNumber } from '../../utils/formatters'
import type { RecommendationResponse, RecommendationTrigger } from '../../types'

interface RecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  onProblemClick: () => void
  recommendations: RecommendationResponse[]
  trigger: RecommendationTrigger
}

const MESSAGES: Record<RecommendationTrigger, { emoji: string; title: string; subtitle: string }> = {
  SOLVED: {
    emoji: '🎉',
    title: '정답입니다!',
    subtitle: '실력과 비슷한 문제를 더 풀어보세요.',
  },
  LEAVING: {
    emoji: '💪',
    title: '혹시 어려웠나요?',
    subtitle: '도전할 만한 약간 더 쉬운 문제를 준비해봤어요.',
  },
}

export function RecommendationModal({ isOpen, onClose, onProblemClick, recommendations, trigger }: RecommendationModalProps) {
  const { emoji, title, subtitle } = MESSAGES[trigger]

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="추천 문제" className="w-[420px]">
      <div className="p-6">
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">{emoji}</div>
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        </div>

        <div className="space-y-2">
          {recommendations.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              onClick={onProblemClick}
              className="flex items-center gap-3 p-3 rounded-lg border border-border-input bg-surface-panel hover:bg-surface-light hover:border-brand-primary transition-all group"
            >
              <DifficultyBadge level={problem.difficulty} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-primary transition-colors">
                  #{problem.id} {problem.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  정답 {formatNumber(problem.solvedCount)} · 정답률 {problem.acceptanceRate.toFixed(1)}%
                </p>
              </div>
              <svg className="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          닫기
        </button>
      </div>
    </Modal>
  )
}
