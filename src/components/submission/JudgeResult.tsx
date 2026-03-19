import type { SubmissionStatus, Verdict, RecommendationResponse } from '../../types'
import { VerdictBadge } from '../badges/VerdictBadge'
import { RecommendationPanel } from '../problem/RecommendationPanel'

interface JudgeResultProps {
  status: SubmissionStatus | null
  verdict: Verdict | null
  query: string
  recommendations?: RecommendationResponse[]
  isLoadingRecommendations?: boolean
}

export function JudgeResult({ status, verdict, query, recommendations = [], isLoadingRecommendations }: JudgeResultProps) {
  if (!status) {
    return (
      <div className="p-5 text-text-muted">
        제출한 결과가 없습니다. 쿼리를 작성하고 제출해주세요.
      </div>
    )
  }

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

      {status === 'COMPLETED' && (isLoadingRecommendations || recommendations.length > 0) && (
        <RecommendationPanel
          recommendations={recommendations}
          isLoading={isLoadingRecommendations}
        />
      )}
    </div>
  )
}
