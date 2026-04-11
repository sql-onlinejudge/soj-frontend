import { useEffect, useState } from 'react'
import type { SandboxSession, SandboxSessionStatus } from '../../types'
import { getSandboxHistory } from '../../services/api'
import { formatRelativeTime } from '../../utils/formatters'

const STATUS_LABEL: Record<SandboxSessionStatus, string> = {
  ACTIVE: '활성',
  CLOSED: '종료',
  EXPIRED: '만료',
}

const STATUS_CLASS: Record<SandboxSessionStatus, string> = {
  ACTIVE: 'bg-brand-primary/10 text-brand-primary',
  CLOSED: 'bg-surface-light text-text-muted',
  EXPIRED: 'bg-surface-light text-text-muted',
}

interface SandboxHistoryProps {
  currentSessionKey?: string
  onRestore?: (session: SandboxSession) => void
}

export function SandboxHistory({ currentSessionKey, onRestore }: SandboxHistoryProps) {
  const [history, setHistory] = useState<SandboxSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSandboxHistory()
      .then(setHistory)
      .finally(() => setIsLoading(false))
  }, [currentSessionKey])

  if (isLoading) return null

  if (history.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text-secondary">세션 히스토리</h2>
      <div className="border border-border-input rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-input bg-surface-dark">
              <th className="text-left px-4 py-2.5 text-text-secondary font-medium">스키마</th>
              <th className="text-left px-4 py-2.5 text-text-secondary font-medium">생성</th>
              <th className="text-left px-4 py-2.5 text-text-secondary font-medium">만료</th>
              <th className="text-left px-4 py-2.5 text-text-secondary font-medium">상태</th>
              {onRestore && <th className="px-4 py-2.5" />}
            </tr>
          </thead>
          <tbody>
            {history.map((s) => (
              <tr key={s.sessionKey} className={`border-b border-border-input/50 last:border-0 ${s.sessionKey === currentSessionKey ? 'bg-brand-primary/5' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs text-text-light">{s.schemaName}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{formatRelativeTime(s.createdAt)}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{formatRelativeTime(s.expiresAt)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_CLASS[s.status]}`}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </td>
                {onRestore && (
                  <td className="px-4 py-3 text-right">
                    {s.status === 'ACTIVE' && s.sessionKey !== currentSessionKey && (
                      <button
                        onClick={() => onRestore(s)}
                        className="text-xs text-brand-primary hover:underline"
                      >
                        이어하기
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
