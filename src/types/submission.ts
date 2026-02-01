export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED'
export type Verdict = 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'INVALID_QUERY'

export interface SubmissionListItem {
  id: number
  problemId: number
  userId: string
  status: SubmissionStatus
  verdict: Verdict | null
  createdAt: string
}

export interface SubmissionDetail {
  id: number
  problemId: number
  userId: string
  status: SubmissionStatus
  verdict: Verdict | null
  query: string
  createdAt: string
}

export interface SSEEvent {
  status: SubmissionStatus
  verdict: Verdict | null
}

export interface PendingSubmission {
  submissionId: number
  problemId: number
  problemTitle: string
}
