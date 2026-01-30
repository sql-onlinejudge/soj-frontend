export type TrialStatus = 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'

export interface ColumnMetadata {
  name: string
  type: string
  constraints: string[]
}

export interface TableMetadata {
  name: string
  columns: ColumnMetadata[]
}

export interface SchemaMetadata {
  tables: TableMetadata[]
}

export interface InsertStatement {
  table: string
  rows: Record<string, unknown>[]
}

export interface InitMetadata {
  statements: InsertStatement[]
}

export interface AnswerMetadata {
  columns: string[]
  rows: unknown[][]
}

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
  schemaMetadata: SchemaMetadata | null
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
  initSql: string | null
  initMetadata: InitMetadata | null
  answer: string
  answerMetadata: AnswerMetadata | null
}
