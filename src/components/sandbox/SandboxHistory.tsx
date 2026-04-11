import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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
  onLoad: (session: SandboxSession) => void
  onReactivate: (sessionKey: string) => Promise<void>
}

export function SandboxHistory({ currentSessionKey, onLoad, onReactivate }: SandboxHistoryProps) {
  const [history, setHistory] = useState<SandboxSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getSandboxHistory()
      .then(setHistory)
      .finally(() => setIsLoading(false))
  }, [currentSessionKey])

  const handleReactivate = async (sessionKey: string) => {
    setLoadingKey(sessionKey)
    try {
      await onReactivate(sessionKey)
      setHistory(await getSandboxHistory())
    } catch {
      toast.error('죄송합니다. 처리 중 오류가 발생했습니다.')
    } finally {
      setLoadingKey(null)
    }
  }

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
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {history.map((s) => (
              <tr
                key={s.sessionKey}
                className={`border-b border-border-input/50 last:border-0 ${s.sessionKey === currentSessionKey ? 'bg-brand-primary/5' : ''}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-text-light">{s.schemaName}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{formatRelativeTime(s.createdAt)}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{formatRelativeTime(s.expiresAt)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_CLASS[s.status]}`}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {s.sessionKey === currentSessionKey ? null : s.status === 'ACTIVE' ? (
                    <button
                      onClick={() => onLoad(s)}
                      disabled={loadingKey !== null}
                      className="text-xs text-brand-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
                    >
                      이어하기
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(s.sessionKey)}
                      disabled={loadingKey !== null}
                      className="text-xs text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
                    >
                      {loadingKey === s.sessionKey ? (
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                      ) : null}
                      재활성화
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
