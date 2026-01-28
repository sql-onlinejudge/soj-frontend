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
      className="block bg-white p-4 hover:bg-gray-50 hover:shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <DifficultyBadge level={problem.difficulty} />
          <span className="text-xl font-medium text-black truncate">
            #{problem.id} {problem.title}
          </span>
          <span className="text-base text-text-secondary whitespace-nowrap hidden sm:inline">
            제출 수: {formatNumber(problem.submissionCount)} &nbsp;&nbsp; 정답 수:{' '}
            {formatNumber(problem.solvedCount)}
          </span>
        </div>
        <StatusBadge status={problem.trialStatus} />
      </div>
    </Link>
  )
}
