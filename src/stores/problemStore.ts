import { create } from 'zustand'
import type { ProblemDetail, Testcase } from '../types'
import { getProblem, getTestcases } from '../services/api'

interface ProblemState {
  problem: ProblemDetail | null
  testcases: Testcase[]
  isLoading: boolean
  error: string | null
  fetchProblem: (problemId: number) => Promise<void>
  reset: () => void
}

export const useProblemStore = create<ProblemState>((set) => ({
  problem: null,
  testcases: [],
  isLoading: false,
  error: null,

  fetchProblem: async (problemId: number) => {
    set({ isLoading: true, error: null })
    try {
      const [problem, testcases] = await Promise.all([
        getProblem(problemId),
        getTestcases(problemId),
      ])
      set({ problem, testcases, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch problem',
        isLoading: false,
      })
    }
  },

  reset: () => set({ problem: null, testcases: [], isLoading: false, error: null }),
}))
