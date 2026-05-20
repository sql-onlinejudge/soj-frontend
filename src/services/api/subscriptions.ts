import { fetchApi } from './client'
import type { Subscription } from '../../types'

export async function getSubscription(): Promise<Subscription> {
  return fetchApi<Subscription>('/subscriptions/me')
}

export async function cancelSubscription(): Promise<void> {
  return fetchApi<void>('/subscriptions/me', {
    method: 'DELETE',
  })
}
