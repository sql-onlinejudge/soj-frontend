import { fetchApi, createEventSource } from './client'
import type { PaginatedResponse, SubmissionDetail, SubmissionListItem } from '../../types'

export interface GetSubmissionsParams {
  userId?: string
  status?: string
  verdict?: string
  page?: number
  size?: number
}

export async function createSubmission(
  problemId: number,
  query: string
): Promise<{ submissionId: number }> {
  return fetchApi<{ submissionId: number }>(`/problems/${problemId}/submissions`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

export async function getSubmissions(
  problemId: number,
  params: GetSubmissionsParams = {}
): Promise<PaginatedResponse<SubmissionListItem>> {
  const searchParams = new URLSearchParams()
  if (params.userId) searchParams.set('userId', params.userId)
  if (params.status) searchParams.set('status', params.status)
  if (params.verdict) searchParams.set('verdict', params.verdict)
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))

  const query = searchParams.toString()
  return fetchApi<PaginatedResponse<SubmissionListItem>>(
    `/problems/${problemId}/submissions${query ? `?${query}` : ''}`
  )
}

export async function getSubmission(
  problemId: number,
  submissionId: number
): Promise<SubmissionDetail> {
  return fetchApi<SubmissionDetail>(
    `/problems/${problemId}/submissions/${submissionId}`
  )
}

export function subscribeToSubmission(
  problemId: number,
  submissionId: number,
  onMessage: (data: { status: string; verdict: string | null }) => void,
  onError?: (error: Event) => void
): () => void {
  const eventSource = createEventSource(
    `/problems/${problemId}/submissions/${submissionId}/events`
  )

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  eventSource.onerror = (error) => {
    onError?.(error)
    eventSource.close()
  }

  return () => {
    eventSource.close()
  }
}
