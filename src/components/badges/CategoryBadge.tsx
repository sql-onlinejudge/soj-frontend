import type { ProblemCategory } from '../../types'

interface CategoryBadgeProps {
  category: ProblemCategory
}

const categoryStyles: Record<ProblemCategory, { bg: string; text: string; label: string }> = {
  SQL: { bg: '#3B82F625', text: '#3B82F6', label: 'SQL' },
  ORM: { bg: '#8B5CF625', text: '#8B5CF6', label: 'ORM' },
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = categoryStyles[category]

  return (
    <span
      className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold"
      style={{ fontFamily: 'JetBrains Mono', backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
