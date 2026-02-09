import { create } from 'zustand'
import type { SubmissionDetail } from '../types'

type ThemePreference = 'light' | 'dark'

function getInitialTheme(): ThemePreference {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function applyTheme(pref: ThemePreference) {
  const isDark = pref === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', isDark ? 'dark' : 'light')
  localStorage.setItem('theme', pref)
}

interface UIState {
  activeTab: string
  isDetailModalOpen: boolean
  isComingSoonModalOpen: boolean
  selectedSubmission: SubmissionDetail | null
  themePreference: ThemePreference
  setActiveTab: (tab: string) => void
  openDetailModal: (submission: SubmissionDetail) => void
  closeDetailModal: () => void
  openComingSoonModal: () => void
  closeComingSoonModal: () => void
  setThemePreference: (pref: ThemePreference) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'execution',
  isDetailModalOpen: false,
  isComingSoonModalOpen: false,
  selectedSubmission: null,
  themePreference: getInitialTheme(),

  setActiveTab: (tab) => set({ activeTab: tab }),

  openDetailModal: (submission) =>
    set({
      selectedSubmission: submission,
      isDetailModalOpen: true,
    }),

  closeDetailModal: () => set({ isDetailModalOpen: false }),

  openComingSoonModal: () => set({ isComingSoonModalOpen: true }),
  closeComingSoonModal: () => set({ isComingSoonModalOpen: false }),

  setThemePreference: (pref) => {
    applyTheme(pref)
    set({ themePreference: pref })
  },
}))

export { applyTheme }
export type { ThemePreference }
