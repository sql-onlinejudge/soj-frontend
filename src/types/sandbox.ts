export type SandboxStatus = 'ACTIVE' | 'CLOSED' | 'EXPIRED'

export interface SandboxSession {
  sessionKey: string
  schemaName: string
  extractedSql: string
  expiresAt: string
  status: SandboxStatus
  createdAt: string
}

export interface SandboxQueryResponse {
  columns: string[]
  rows: (string | null)[][]
}
