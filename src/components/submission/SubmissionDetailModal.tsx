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
    <Modal isOpen={isOpen} onClose={onClose} className="w-[800px] max-w-[90vw]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl text-white">#{submission.id} 제출 상세</h2>
          <VerdictBadge
            status={submission.status}
            verdict={submission.verdict}
          />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-white mb-1">문제</p>
            <button
              onClick={() => {
                onProblemClick(submission.problemId)
                onClose()
              }}
              className="text-sm text-white hover:text-brand-primary transition-colors"
            >
              #{submission.problemId}
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">제출한 쿼리</p>
            <div className="bg-surface-dark rounded p-4 overflow-x-auto max-h-[200px]">
              <pre className="text-base font-mono text-text-light whitespace-pre-wrap">
                {submission.query}
              </pre>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-1">제출 시간</p>
            <p className="text-sm text-white">
              {formatDateTime(submission.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-1">푼 사람</p>
            <button
              onClick={() => onUserClick(submission.userId)}
              className="text-sm text-white hover:text-brand-primary transition-colors"
            >
              {submission.userId}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary text-text-primary rounded-lg font-medium hover:opacity-80 transition-opacity"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  )
}
