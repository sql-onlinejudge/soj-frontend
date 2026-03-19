import { fetchApi } from './client'

export interface TrackEventRequest {
  eventType: string
  targetId?: string
  metadata?: Record<string, unknown>
}

export async function trackEvent(request: TrackEventRequest): Promise<void> {
  return fetchApi<void>('/events', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
