import { fetchApi, createEventSource } from './client'
import type { RunResult } from '../../types'

export async function createRun(
  problemId: number,
  query: string
): Promise<{ runId: number }> {
  return fetchApi<{ runId: number }>(`/problems/${problemId}/runs`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

export function subscribeToRun(
  problemId: number,
  runId: number,
  onMessage: (data: RunResult) => void,
  onError?: (error: Event) => void
): () => void {
  const eventSource = createEventSource(
    `/problems/${problemId}/runs/${runId}/events`
  )

  const handler = (event: MessageEvent) => {
    const data: RunResult = JSON.parse(event.data)
    onMessage(data)
    if (data.status === 'COMPLETED' || data.status === 'FAILED') {
      eventSource.close()
    }
  }

  eventSource.addEventListener('run-result', handler)

  eventSource.onerror = (error) => {
    onError?.(error)
    eventSource.close()
  }

  return () => {
    eventSource.close()
  }
}

export async function getRun(
  problemId: number,
  runId: number
): Promise<RunResult> {
  return fetchApi<RunResult>(`/problems/${problemId}/runs/${runId}`)
}
