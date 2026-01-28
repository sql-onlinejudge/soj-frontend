interface DifficultyBadgeProps {
  level: number
}

const levelStyles: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-difficulty-1-bg', text: 'text-difficulty-1-text' },
  2: { bg: 'bg-difficulty-2-bg', text: 'text-difficulty-2-text' },
  3: { bg: 'bg-difficulty-3-bg', text: 'text-difficulty-3-text' },
  4: { bg: 'bg-difficulty-4-bg', text: 'text-difficulty-4-text' },
  5: { bg: 'bg-difficulty-5-bg', text: 'text-difficulty-5-text' },
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const clampedLevel = Math.min(5, Math.max(1, level))
  const style = levelStyles[clampedLevel]

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}
    >
      Lv.{clampedLevel}
    </span>
  )
}
