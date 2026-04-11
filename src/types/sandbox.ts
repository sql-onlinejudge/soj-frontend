export interface SandboxSetupResponse {
  sessionKey: string
  schemaName: string
  extractedSql: string
  expiresAt: string
}

export interface SandboxSessionResponse {
  sessionKey: string
  schemaName: string
  extractedSql: string
  expiresAt: string
  expired: boolean
}

export interface SandboxQueryRequest {
  query: string
}

export interface SandboxQueryResponse {
  columns: string[]
  rows: (string | null)[][]
}
