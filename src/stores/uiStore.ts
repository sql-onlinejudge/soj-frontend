import { create } from 'zustand'
import type { SubmissionDetail } from '../types'

interface UIState {
  activeTab: string
  isDetailModalOpen: boolean
  isComingSoonModalOpen: boolean
  selectedSubmission: SubmissionDetail | null
  setActiveTab: (tab: string) => void
  openDetailModal: (submission: SubmissionDetail) => void
  closeDetailModal: () => void
  openComingSoonModal: () => void
  closeComingSoonModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'execution',
  isDetailModalOpen: false,
  isComingSoonModalOpen: false,
  selectedSubmission: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  openDetailModal: (submission) =>
    set({
      selectedSubmission: submission,
      isDetailModalOpen: true,
    }),

  closeDetailModal: () => set({ isDetailModalOpen: false }),

  openComingSoonModal: () => set({ isComingSoonModalOpen: true }),
  closeComingSoonModal: () => set({ isComingSoonModalOpen: false }),
}))
