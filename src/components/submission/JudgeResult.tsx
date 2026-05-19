import { useState } from 'react'
import toast from 'react-hot-toast'
import type { SubmissionStatus, Verdict, AiFeedback } from '../../types'
import { VerdictBadge } from '../badges/VerdictBadge'
import { AiFeedbackButton } from '../premium/AiFeedbackButton'
import { FeedbackCard } from '../premium/FeedbackCard'
import { PremiumUpsellBanner } from '../premium/PremiumUpsellBanner'
import { getAiFeedback } from '../../services/api/feedback'
import { ApiError } from '../../services/api/client'

const FEEDBACK_VERDICTS: Verdict[] = ['WRONG_ANSWER', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED']

interface JudgeResultProps {
  status: SubmissionStatus | null
  verdict: Verdict | null
  query: string
  problemId: number
  submissionId?: number
  isPremiumUser: boolean
}

export function JudgeResult({ status, verdict, query, problemId, submissionId, isPremiumUser }: JudgeResultProps) {
  const [feedback, setFeedback] = useState<AiFeedback | null>(null)
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)

  const handleFetchFeedback = async () => {
    if (!submissionId) return
    setIsFeedbackLoading(true)
    try {
      const data = await getAiFeedback(problemId, submissionId)
      setFeedback(data)
    } catch (e) {
      if (e instanceof ApiError && e.status === 500) {
        toast.error('잠시 후 다시 시도해주세요.')
      } else {
        toast.error('AI 피드백을 가져오지 못했습니다.')
      }
    } finally {
      setIsFeedbackLoading(false)
    }
  }

  if (!status) {
    return (
      <div className="p-5 text-text-muted">
        제출한 결과가 없습니다. 쿼리를 작성하고 제출해주세요.
      </div>
    )
  }

  const showFeedbackSection =
    verdict !== null &&
    status === 'COMPLETED' &&
    FEEDBACK_VERDICTS.includes(verdict)

  return (
    <div className="p-5 space-y-4">
      <div>
        <p className="text-sm text-text-secondary mb-2">결과</p>
        <VerdictBadge status={status} verdict={verdict} />
      </div>

      <div>
        <p className="text-sm text-text-secondary mb-2">제출한 쿼리</p>
        <div className="bg-surface-dark rounded p-4 overflow-x-auto max-w-full">
          <pre className="text-base font-mono whitespace-pre-wrap break-words">
            <span className="text-accent-pink">SELECT </span>
            <span className="text-text-light">
              {query.replace(/^SELECT\s*/i, '')}
            </span>
          </pre>
        </div>
      </div>

      {showFeedbackSection && (
        <div className="space-y-3">
          {isPremiumUser ? (
            <>
              {!feedback && (
                <AiFeedbackButton onClick={handleFetchFeedback} loading={isFeedbackLoading} />
              )}
              {feedback && <FeedbackCard feedback={feedback} />}
            </>
          ) : (
            <PremiumUpsellBanner message="AI 피드백은 프리미엄 전용입니다" />
          )}
        </div>
      )}
    </div>
  )
}
