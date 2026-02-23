export type RunStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface RunTestCaseResult {
  testCaseId: number
  columns: string[]
  rows: string[][]
  errorMessage: string | null
}

export interface RunResult {
  runId: number
  status: RunStatus
  results: RunTestCaseResult[] | null
}
