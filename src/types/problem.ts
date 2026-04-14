export type TrialStatus = 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'
export type ProblemCategory = 'SQL' | 'ORM'

export interface ColumnMetadata {
  name: string
  type: string
  nullable?: boolean
  constraints: string[]
}

export interface TableMetadata {
  name: string
  columns: ColumnMetadata[]
}

export interface SchemaMetadata {
  tables: TableMetadata[]
}

export interface OrmMetadata {
  entityCode: string
  repositoryCode: string
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
  category: ProblemCategory
  solvedCount: number
  submissionCount: number
  acceptanceRate: number | null
  trialStatus: TrialStatus | null
  createdAt: string
}

export interface ProblemDetail {
  id: number
  title: string
  description: string
  schemaSql: string
  schemaMetadata: SchemaMetadata | null
  ormMetadata: OrmMetadata | null
  difficulty: number
  timeLimit: number
  isOrderSensitive: boolean
  solvedCount: number
  submissionCount: number
  category: ProblemCategory
  acceptanceRate: number | null
  trialStatus: TrialStatus | null
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

export type RecommendationTrigger = 'SOLVED' | 'LEAVING'

export interface RecommendationResponse {
  id: number
  title: string
  difficulty: number
  solvedCount: number
  submissionCount: number
  acceptanceRate: number
}
