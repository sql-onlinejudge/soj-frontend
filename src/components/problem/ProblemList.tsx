import type { ProblemListItem } from '../../types'
import { ProblemItem } from './ProblemItem'

interface ProblemListProps {
  problems: ProblemListItem[]
  isLoading?: boolean
}

export function ProblemList({ problems, isLoading }: ProblemListProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-panel rounded-lg p-8 text-center text-text-secondary" role="status">
        로딩 중...
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="bg-surface-panel rounded-lg p-8 text-center text-text-secondary" role="status">
        문제가 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-surface-light rounded-lg overflow-hidden">
      <div className="divide-y divide-surface-light">
        {problems.map((problem) => (
          <ProblemItem key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  )
}
