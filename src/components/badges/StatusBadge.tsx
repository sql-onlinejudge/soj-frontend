import type { TrialStatus } from '../../types'

interface StatusBadgeProps {
  status: TrialStatus
}

const statusStyles: Record<TrialStatus, { bg: string; color: string; label: string }> = {
  NOT_ATTEMPTED: { bg: '#4B556330', color: '#6B7280', label: '미시도' },
  ATTEMPTED: { bg: '#EF444430', color: '#EF4444', label: '오답' },
  SOLVED: { bg: '#10B98130', color: '#10B981', label: '정답' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status]

  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}
