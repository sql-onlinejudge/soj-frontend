import { create } from 'zustand'

const STORAGE_KEY = 'soj-auth'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: localStorage.getItem(STORAGE_KEY) === 'true',

  login: () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    set({ isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ isLoggedIn: false })
  },
}))
