import type { SubmissionStatus, Verdict } from '../types'

const numberFormatter = new Intl.NumberFormat('ko-KR')

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatNumber(num: number): string {
  return numberFormatter.format(num)
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`

  return dateFormatter.format(date)
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return dateTimeFormatter.format(date)
}

export function getVerdictText(
  status: SubmissionStatus,
  verdict: Verdict | null
): string {
  if (status === 'PENDING') return '대기 중'
  if (status === 'RUNNING') return '채점 중...'
  if (!verdict) return '알 수 없음'

  const verdictMap: Record<Verdict, string> = {
    ACCEPTED: '정답',
    WRONG_ANSWER: '오답',
    TIME_LIMIT_EXCEEDED: '시간 초과',
    RUNTIME_ERROR: '런타임 에러',
  }
  return verdictMap[verdict]
}

export function truncateUserId(userId: string | null | undefined): string {
  if (!userId) return '-'
  if (userId.length <= 16) return userId
  return `${userId.slice(0, 6)}-${userId.slice(6, 12)}..`
}
