import { getUserId } from '../../hooks/useUserId'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const userId = getUserId()
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export function createEventSource(path: string): EventSource {
  return new EventSource(`${BASE_URL}${path}`)
}
