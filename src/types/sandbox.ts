export interface SandboxSession {
  sessionKey: string
  schemaName: string
  extractedSql: string
  expiresAt: string
  expired?: boolean
}

export interface SandboxQueryResponse {
  columns: string[]
  rows: (string | null)[][]
}
