import { useState } from 'react'
import type { SandboxSession } from '../../types'

interface SetupResultProps {
  session: SandboxSession
  collapsed?: boolean
}

export function SetupResult({ session, collapsed = false }: SetupResultProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed)

  if (collapsed && !isExpanded) {
    return (
      <div className="flex items-center justify-between bg-surface-panel border border-border-input rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded" style={{ fontFamily: 'JetBrains Mono' }}>
            {session.schemaName}
          </span>
          <span className="text-text-secondary text-sm">스키마 세팅 완료</span>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          펼치기
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface-panel border border-border-input rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-input">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-text-primary">스키마 세팅 완료</span>
          <span className="text-xs font-medium bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded" style={{ fontFamily: 'JetBrains Mono' }}>
            {session.schemaName}
          </span>
        </div>
        {collapsed && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            접기
          </button>
        )}
      </div>
      <div className="bg-surface-dark overflow-x-auto max-h-64 overflow-y-auto">
        <pre className="text-xs text-text-light px-4 py-3 font-mono whitespace-pre-wrap" style={{ fontFamily: 'JetBrains Mono' }}>
          {session.extractedSql}
        </pre>
      </div>
    </div>
  )
}
