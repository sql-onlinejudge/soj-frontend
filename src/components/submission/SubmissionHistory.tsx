import type { SubmissionListItem } from '../../types'
import { formatRelativeTime, truncateUserId } from '../../utils/formatters'
import { VerdictBadge } from '../badges/VerdictBadge'

interface SubmissionHistoryProps {
  submissions: SubmissionListItem[]
  isLoading?: boolean
  onSubmissionClick: (submission: SubmissionListItem) => void
  onProblemClick: (problemId: number) => void
  onUserClick: (userId: string) => void
  currentSubmissionId?: number
}

export function SubmissionHistory({
  submissions,
  isLoading,
  onSubmissionClick,
  onProblemClick,
  onUserClick,
  currentSubmissionId,
}: SubmissionHistoryProps) {
  if (isLoading) {
    return <div className="p-5 text-text-muted" role="status">로딩 중...</div>
  }

  if (submissions.length === 0) {
    return <div className="p-5 text-text-muted" role="status">제출 기록이 없습니다.</div>
  }

  return (
    <div className="p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted border-b border-surface-medium">
            <th className="text-left py-2 px-3 font-medium">번호</th>
            <th className="text-left py-2 px-3 font-medium">결과</th>
            <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">문제</th>
            <th className="text-left py-2 px-3 font-medium hidden md:table-cell">시간</th>
            <th className="text-left py-2 px-3 font-medium hidden lg:table-cell">사용자</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              onClick={() => onSubmissionClick(submission)}
              className={`cursor-pointer transition-colors hover:bg-surface-medium/50 ${
                currentSubmissionId === submission.id ? 'bg-brand-primary/10' : ''
              }`}
              tabIndex={0}
              role="button"
              aria-label={`제출 ${submission.id}번 상세 보기`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSubmissionClick(submission)}
            >
              <td className="py-3 px-3 text-text-light">#{submission.id}</td>
              <td className="py-3 px-3">
                <VerdictBadge status={submission.status} verdict={submission.verdict} />
              </td>
              <td className="py-3 px-3 hidden sm:table-cell">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onProblemClick(submission.problemId)
                  }}
                  className="text-text-light hover:text-brand-primary transition-colors"
                >
                  #{submission.problemId}
                </button>
              </td>
              <td className="py-3 px-3 text-text-muted hidden md:table-cell">
                {formatRelativeTime(submission.createdAt)}
              </td>
              <td className="py-3 px-3 hidden lg:table-cell">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUserClick(submission.userId)
                  }}
                  title={submission.userId}
                  className="text-text-light hover:text-brand-primary transition-colors truncate max-w-[120px] block"
                >
                  {truncateUserId(submission.userId)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
