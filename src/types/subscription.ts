export interface Subscription {
  id: number
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  startedAt: string
  expiresAt: string
}

export interface CheckoutResponse {
  orderId: string
  amount: number
  clientKey: string
  successUrl: string
  failUrl: string
}

export interface AiFeedback {
  hint: string
  improvement: string
  explanation: string
}
