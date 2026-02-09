interface DifficultyBadgeProps {
  level: number
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const clampedLevel = Math.min(5, Math.max(1, level))

  return (
    <span
      className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold"
      style={{ fontFamily: 'JetBrains Mono', backgroundColor: '#10B98125', color: '#10B981' }}
    >
      Lv.{clampedLevel}
    </span>
  )
}
