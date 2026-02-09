import type { SubmissionStatus, Verdict } from '../../types'

interface VerdictBadgeProps {
  status: SubmissionStatus
  verdict: Verdict | null
}

type VerdictType = Verdict | 'PENDING' | 'RUNNING'

const verdictStyles: Record<VerdictType, { bg: string; color: string; label: string }> = {
  PENDING: { bg: '#4B556330', color: '#6B7280', label: '대기 중...' },
  RUNNING: { bg: '#F59E0B30', color: '#F59E0B', label: '채점 중...' },
  ACCEPTED: { bg: '#10B98130', color: '#10B981', label: '정답' },
  WRONG_ANSWER: { bg: '#EF444430', color: '#EF4444', label: '오답' },
  TIME_LIMIT_EXCEEDED: { bg: '#EF444430', color: '#EF4444', label: '시간 초과' },
  RUNTIME_ERROR: { bg: '#EF444430', color: '#EF4444', label: '런타임 에러' },
  INVALID_QUERY: { bg: '#EF444430', color: '#EF4444', label: '잘못된 쿼리' },
}

export function VerdictBadge({ status, verdict }: VerdictBadgeProps) {
  let key: VerdictType
  if (status === 'PENDING') {
    key = 'PENDING'
  } else if (status === 'RUNNING') {
    key = 'RUNNING'
  } else if (verdict) {
    key = verdict
  } else {
    key = 'PENDING'
  }

  const style = verdictStyles[key]

  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}
