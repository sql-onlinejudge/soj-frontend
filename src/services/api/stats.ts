import { fetchApi } from './client'

export interface Stats {
  problems: number
  submissions: number
  users: number
}

export async function getStats(): Promise<Stats> {
  return fetchApi<Stats>('/stats')
}
