import { useEffect, useState } from 'react'

interface SessionCountdownProps {
  expiresAt: string
  onExpired: () => void
}

function getRemainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function SessionCountdown({ expiresAt, onExpired }: SessionCountdownProps) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(expiresAt))

  useEffect(() => {
    if (remaining === 0) {
      onExpired()
      return
    }

    const id = setInterval(() => {
      const next = getRemainingSeconds(expiresAt)
      setRemaining(next)
      if (next === 0) {
        clearInterval(id)
        onExpired()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [expiresAt, onExpired, remaining])

  const isWarning = remaining <= 600 && remaining > 60
  const isDanger = remaining <= 60

  const colorClass = isDanger
    ? 'bg-status-error/10 text-status-error-text'
    : isWarning
      ? 'bg-amber-500/10 text-amber-500'
      : 'bg-brand-primary/10 text-brand-primary'

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${colorClass} ${isDanger ? 'animate-pulse' : ''}`} style={{ fontFamily: 'JetBrains Mono' }}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {formatTime(remaining)}
    </div>
  )
}
