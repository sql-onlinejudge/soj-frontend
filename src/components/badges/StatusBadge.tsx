import type { TrialStatus } from '../../types'

interface StatusBadgeProps {
  status: TrialStatus
}

const statusStyles: Record<TrialStatus, { bg: string; text: string; label: string }> = {
  NOT_ATTEMPTED: {
    bg: 'bg-status-neutral-bg',
    text: 'text-status-neutral-text',
    label: '미해결',
  },
  ATTEMPTED: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error-text',
    label: '실패',
  },
  SOLVED: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success-text',
    label: '해결',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status]

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  )
}
