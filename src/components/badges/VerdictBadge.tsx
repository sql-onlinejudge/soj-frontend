import type { SubmissionStatus, Verdict } from '../../types'

interface VerdictBadgeProps {
  status: SubmissionStatus
  verdict: Verdict | null
}

type VerdictType = Verdict | 'PENDING' | 'RUNNING'

const verdictStyles: Record<VerdictType, { bg: string; text: string; label: string }> = {
  PENDING: {
    bg: 'bg-status-pending-bg',
    text: 'text-status-pending-text',
    label: '대기 중...',
  },
  RUNNING: {
    bg: 'bg-status-pending-bg',
    text: 'text-status-pending-text',
    label: '채점 중...',
  },
  ACCEPTED: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success-text',
    label: '정답',
  },
  WRONG_ANSWER: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error-text',
    label: '오답',
  },
  TIME_LIMIT_EXCEEDED: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error-text',
    label: '시간 초과',
  },
  RUNTIME_ERROR: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error-text',
    label: '런타임 에러',
  },
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
      className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  )
}
