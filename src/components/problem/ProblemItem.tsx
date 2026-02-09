import { Link } from 'react-router-dom'
import type { ProblemListItem } from '../../types'
import { formatNumber } from '../../utils/formatters'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { StatusBadge } from '../badges/StatusBadge'

interface ProblemItemProps {
  problem: ProblemListItem
}

export function ProblemItem({ problem }: ProblemItemProps) {
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="group flex items-center justify-between px-4 py-3 bg-surface-panel border-b border-border-input hover:bg-surface-muted transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <DifficultyBadge level={problem.difficulty} />
        <span
          title={`#${problem.id} ${problem.title}`}
          className="text-sm font-semibold text-text-primary group-hover:text-brand-primary truncate transition-colors"
        >
          #{problem.id} {problem.title}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-text-secondary whitespace-nowrap hidden sm:inline">
          제출 {formatNumber(problem.submissionCount)} · 정답 {formatNumber(problem.solvedCount)}
        </span>
        <StatusBadge status={problem.trialStatus} />
      </div>
    </Link>
  )
}
