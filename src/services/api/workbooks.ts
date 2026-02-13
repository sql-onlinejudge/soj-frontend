import { fetchApi } from './client'
import type { PaginatedResponse, ProblemListItem, Workbook } from '../../types'

export interface GetWorkbooksParams {
  keyword?: string
  minDifficulty?: number
  maxDifficulty?: number
  page?: number
  size?: number
  sort?: string[]
}

export interface GetWorkbookProblemsParams {
  page?: number
  size?: number
}

export async function getWorkbooks(
  params: GetWorkbooksParams = {}
): Promise<PaginatedResponse<Workbook>> {
  const searchParams = new URLSearchParams()
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.minDifficulty !== undefined) searchParams.set('minDifficulty', String(params.minDifficulty))
  if (params.maxDifficulty !== undefined) searchParams.set('maxDifficulty', String(params.maxDifficulty))
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sort) {
    params.sort.forEach((s) => searchParams.append('sort', s))
  }

  const query = searchParams.toString()
  return fetchApi<PaginatedResponse<Workbook>>(
    `/workbooks${query ? `?${query}` : ''}`
  )
}

export async function getWorkbook(id: number): Promise<Workbook> {
  return fetchApi<Workbook>(`/workbooks/${id}`)
}

export async function getWorkbookProblems(
  id: number,
  params: GetWorkbookProblemsParams = {}
): Promise<PaginatedResponse<ProblemListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))

  const query = searchParams.toString()
  return fetchApi<PaginatedResponse<ProblemListItem>>(
    `/workbooks/${id}/problems${query ? `?${query}` : ''}`
  )
}
