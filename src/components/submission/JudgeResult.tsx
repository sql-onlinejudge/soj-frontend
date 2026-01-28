import type { SubmissionStatus, Verdict } from '../../types'
import { VerdictBadge } from '../badges/VerdictBadge'

interface JudgeResultProps {
  status: SubmissionStatus | null
  verdict: Verdict | null
  query: string
}

export function JudgeResult({ status, verdict, query }: JudgeResultProps) {
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
        <p className="text-sm text-white mb-2">결과</p>
        <VerdictBadge status={status} verdict={verdict} />
      </div>

      <div>
        <p className="text-sm text-white mb-2">제출한 쿼리</p>
        <div className="bg-surface-dark rounded p-4 overflow-x-auto">
          <pre className="text-base font-mono">
            <span className="text-accent-pink">SELECT </span>
            <span className="text-text-light">
              {query.replace(/^SELECT\s*/i, '')}
            </span>
          </pre>
        </div>
      </div>
    </div>
  )
}
