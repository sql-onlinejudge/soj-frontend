import { create } from 'zustand'
import type { PendingSubmission, Verdict } from '../types'
import { subscribeToSubmission } from '../services/api'

interface SubmissionState {
  pendingSubmissions: Map<number, PendingSubmission>
  addPendingSubmission: (submission: PendingSubmission) => void
  removePendingSubmission: (submissionId: number) => void
  subscribeSubmission: (
    submission: PendingSubmission,
    onComplete: (verdict: Verdict | null) => void
  ) => void
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  pendingSubmissions: new Map(),

  addPendingSubmission: (submission) => {
    set((state) => {
      const newMap = new Map(state.pendingSubmissions)
      newMap.set(submission.submissionId, submission)
      return { pendingSubmissions: newMap }
    })
  },

  removePendingSubmission: (submissionId) => {
    set((state) => {
      const newMap = new Map(state.pendingSubmissions)
      newMap.delete(submissionId)
      return { pendingSubmissions: newMap }
    })
  },

  subscribeSubmission: (submission, onComplete) => {
    get().addPendingSubmission(submission)

    const unsubscribe = subscribeToSubmission(
      submission.problemId,
      submission.submissionId,
      (data) => {
        if (data.status === 'COMPLETED') {
          get().removePendingSubmission(submission.submissionId)
          onComplete(data.verdict as Verdict | null)
          unsubscribe()
        }
      },
      () => {
        get().removePendingSubmission(submission.submissionId)
      }
    )
  },
}))
