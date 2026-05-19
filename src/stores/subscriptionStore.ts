import { create } from 'zustand'
import { getSubscription } from '../services/api/subscriptions'
import { ApiError } from '../services/api/client'
import type { Subscription } from '../types'

function computeIsPremium(sub: Subscription | null): boolean {
  if (!sub) return false
  return sub.status === 'ACTIVE' && new Date(sub.expiresAt) > new Date()
}

interface SubscriptionState {
  subscription: Subscription | null
  isPremium: boolean
  isLoading: boolean
  fetch: () => Promise<void>
  invalidate: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isPremium: false,
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true })
    try {
      const sub = await getSubscription()
      set({ subscription: sub, isPremium: computeIsPremium(sub), isLoading: false })
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        set({ subscription: null, isPremium: false, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    }
  },

  invalidate: async () => {
    set({ isLoading: true })
    try {
      const sub = await getSubscription()
      set({ subscription: sub, isPremium: computeIsPremium(sub), isLoading: false })
    } catch {
      set({ subscription: null, isPremium: false, isLoading: false })
    }
  },
}))
