import { fetchApi } from './client'
import type { CheckoutResponse } from '../../types'

export async function checkout(): Promise<CheckoutResponse> {
  return fetchApi<CheckoutResponse>('/payments/checkout', { method: 'POST' })
}
