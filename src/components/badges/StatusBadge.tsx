import type { TrialStatus } from '../../types'

interface StatusBadgeProps {
  status: TrialStatus
}

const statusStyles: Record<TrialStatus, { bg: string; text: string; label: string }> = {
  NOT_ATTEMPTED: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    label: '미시도',
  },
  ATTEMPTED: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    label: '오답',
  },
  SOLVED: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    label: '정답',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status]

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  )
}
