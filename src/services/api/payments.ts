import { fetchApi } from './client'
import type { CheckoutResponse } from '../../types'

export async function checkout(): Promise<CheckoutResponse> {
  return fetchApi<CheckoutResponse>('/payments/checkout', { method: 'POST' })
}

export async function cancelSubscription(): Promise<void> {
  return fetchApi<void>('/subscriptions/me', {
    method: 'DELETE',
  })
}
