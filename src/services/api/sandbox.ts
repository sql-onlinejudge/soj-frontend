import { fetchApi } from './client'
import type { SandboxSetupResponse, SandboxSessionResponse, SandboxQueryResponse, SandboxQueryRequest } from '../../types'

export async function setupSandbox(imageFile: File): Promise<SandboxSetupResponse> {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/runs/sandbox/setup`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    let message = `API Error: ${response.status}`
    try {
      const body = await response.json()
      message = body.message || message
    } catch {
      /* empty */
    }
    throw new Error(message)
  }

  return response.json()
}

export async function executeSandboxQuery(
  sessionKey: string,
  request: SandboxQueryRequest
): Promise<SandboxQueryResponse> {
  return fetchApi<SandboxQueryResponse>(`/runs/sandbox/${sessionKey}/query`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function getSandboxSession(sessionKey: string): Promise<SandboxSessionResponse> {
  return fetchApi<SandboxSessionResponse>(`/runs/sandbox/${sessionKey}`)
}
