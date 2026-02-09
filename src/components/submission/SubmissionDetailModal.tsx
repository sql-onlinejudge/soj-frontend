import type { SubmissionDetail } from '../../types'
import { formatDateTime } from '../../utils/formatters'
import { Modal } from '../common/Modal'
import { VerdictBadge } from '../badges/VerdictBadge'

interface SubmissionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  submission: SubmissionDetail | null
  onProblemClick: (problemId: number) => void
  onUserClick: (userId: string) => void
}

export function SubmissionDetailModal({
  isOpen,
  onClose,
  submission,
  onProblemClick,
  onUserClick,
}: SubmissionDetailModalProps) {
  if (!submission) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[640px] max-w-[90vw]" ariaLabel="제출 상세 정보">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">
            #{submission.id.toLocaleString()} 제출 상세
          </h2>
          <VerdictBadge
            status={submission.status}
            verdict={submission.verdict}
          />
        </div>

        <div className="border-t border-border-input my-6" />

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">문제</p>
            <button
              onClick={() => {
                onProblemClick(submission.problemId)
                onClose()
              }}
              aria-label={`문제 ${submission.problemId}번으로 이동`}
              className="text-sm text-text-primary hover:text-brand-primary transition-colors"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              #{submission.problemId}
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary mb-2">제출한 쿼리</p>
            <div className="bg-surface-muted rounded-md p-4 h-[140px] overflow-auto">
              <pre
                className="text-sm text-text-primary whitespace-pre-wrap"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                {submission.query}
              </pre>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">제출 시간</p>
            <p className="text-sm text-text-primary">
              {formatDateTime(submission.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">푼 사람</p>
            <button
              onClick={() => onUserClick(submission.userId)}
              aria-label={`사용자 ${submission.userId} 프로필 보기`}
              className="text-[13px] text-text-secondary hover:text-brand-primary transition-colors"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {submission.userId}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
