import type { AiFeedback } from '../../types'

interface FeedbackCardProps {
  feedback: AiFeedback
}

interface SectionProps {
  title: string
  content: string
}

function Section({ title, content }: SectionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{title}</span>
      <p className="text-sm text-text-primary leading-relaxed">{content}</p>
    </div>
  )
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="rounded-lg border border-brand-primary/30 bg-brand-primary/5 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-sm font-semibold text-brand-primary">AI 피드백</span>
      </div>
      <div className="flex flex-col gap-3 divide-y divide-border-input">
        <Section title="힌트" content={feedback.hint} />
        <div className="pt-3">
          <Section title="개선 방향" content={feedback.improvement} />
        </div>
        <div className="pt-3">
          <Section title="풀이 접근법" content={feedback.explanation} />
        </div>
      </div>
    </div>
  )
}
