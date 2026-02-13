import { getUserId } from '../../hooks/useUserId'
import { useAuthStore } from '../../stores/authStore'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const userId = getUserId()
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    },
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

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export function createEventSource(path: string): EventSource {
  return new EventSource(`${BASE_URL}${path}`)
}
