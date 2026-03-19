interface DifficultyBadgeProps {
  level: number
}

function getDifficultyColor(level: number): { bg: string; text: string } {
  if (level <= 5) return { bg: '#10B98125', text: '#10B981' }
  if (level <= 10) return { bg: '#3B82F625', text: '#3B82F6' }
  if (level <= 15) return { bg: '#F59E0B25', text: '#F59E0B' }
  return { bg: '#EF444425', text: '#EF4444' }
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const clampedLevel = Math.min(20, Math.max(1, level))
  const { bg, text } = getDifficultyColor(clampedLevel)

  return (
    <span
      className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold"
      style={{ fontFamily: 'JetBrains Mono', backgroundColor: bg, color: text }}
    >
      Lv.{clampedLevel}
    </span>
  )
}
