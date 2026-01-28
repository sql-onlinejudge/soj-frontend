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
    return <div className="p-5 text-text-muted">로딩 중...</div>
  }

  if (submissions.length === 0) {
    return <div className="p-5 text-text-muted">제출 기록이 없습니다.</div>
  }

  return (
    <div className="p-5">
      <div className="hidden lg:grid grid-cols-5 gap-4 text-sm text-text-light mb-3 px-4">
        <span>제출 번호</span>
        <span>결과</span>
        <span>문제 번호</span>
        <span>제출 시간</span>
        <span>푼 사람</span>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            onClick={() => onSubmissionClick(submission)}
            className={`bg-surface-card rounded-lg p-4 cursor-pointer hover:bg-surface-card-hover transition-all focus-visible:ring-2 focus-visible:ring-ring ${
              currentSubmissionId === submission.id
                ? 'border-2 border-brand-primary shadow-sm'
                : 'border-2 border-transparent hover:shadow-sm'
            }`}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && onSubmissionClick(submission)}
          >
            <div className="hidden lg:grid grid-cols-5 gap-4 items-center text-sm text-white">
              <span>#{submission.id}</span>
              <VerdictBadge
                status={submission.status}
                verdict={submission.verdict}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onProblemClick(submission.problemId)
                }}
                className="text-left hover:text-brand-primary transition-colors"
              >
                #{submission.problemId}
              </button>
              <span>{formatRelativeTime(submission.createdAt)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUserClick(submission.userId)
                }}
                className="text-left hover:text-brand-primary transition-colors truncate"
              >
                {truncateUserId(submission.userId)}
              </button>
            </div>

            <div className="lg:hidden space-y-2 text-sm text-white">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">#{submission.id}</span>
                <VerdictBadge
                  status={submission.status}
                  verdict={submission.verdict}
                />
              </div>
              <div className="flex items-center justify-between text-text-muted">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onProblemClick(submission.problemId)
                  }}
                  className="hover:text-brand-primary transition-colors"
                >
                  문제 #{submission.problemId}
                </button>
                <span>{formatRelativeTime(submission.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
