export type TrialStatus = 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'

export interface ProblemListItem {
  id: number
  title: string
  difficulty: number
  solvedCount: number
  submissionCount: number
  trialStatus: TrialStatus
  createdAt: string
}

export interface ProblemDetail {
  id: number
  title: string
  description: string
  schemaSql: string
  difficulty: number
  timeLimit: number
  isOrderSensitive: boolean
  solvedCount: number
  submissionCount: number
  trialStatus: TrialStatus
  createdAt: string
  updatedAt: string
}

export interface Testcase {
  id: number
  initSql: string
  answer: string
}
