import { BASE_URL, ApiError, fetchApi } from './client'
import { useAuthStore } from '../../stores/authStore'
import type { SandboxSession, SandboxQueryResponse } from '../../types'

export async function setupSandbox(image: File): Promise<SandboxSession> {
  const formData = new FormData()
  formData.append('image', image)

  const response = await fetch(`${BASE_URL}/runs/sandbox/setup`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    let code = 'UNKNOWN'
    let message = `API Error: ${response.status}`
    try {
      const body = await response.json()
      code = body.code || code
      message = body.message || message
    } catch {
      /* empty */
    }

    if (response.status === 401) {
      useAuthStore.getState().logout()
    }

    throw new ApiError(response.status, code, message)
  }

  return response.json()
}

export async function querySandbox(
  sessionKey: string,
  query: string
): Promise<SandboxQueryResponse> {
  return fetchApi<SandboxQueryResponse>(`/runs/sandbox/${sessionKey}/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

export async function getSandboxSession(sessionKey: string): Promise<SandboxSession> {
  return fetchApi<SandboxSession>(`/runs/sandbox/${sessionKey}`)
}

export async function listSandboxSessions(): Promise<SandboxSession[]> {
  return fetchApi<SandboxSession[]>('/runs/sandbox')
}

export async function closeSandboxSession(sessionKey: string): Promise<void> {
  return fetchApi<void>(`/runs/sandbox/${sessionKey}`, {
    method: 'DELETE',
  })
}
