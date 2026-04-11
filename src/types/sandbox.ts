export type SandboxSessionStatus = 'ACTIVE' | 'CLOSED' | 'EXPIRED'

export interface SandboxSession {
  sessionKey: string
  schemaName: string
  extractedSql: string
  expiresAt: string
  createdAt: string
  status: SandboxSessionStatus
}

export interface SandboxQueryResponse {
  columns: string[]
  rows: (string | null)[][]
}
