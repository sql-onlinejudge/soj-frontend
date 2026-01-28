import { fetchApi } from './client'
import type { PaginatedResponse, ProblemDetail, ProblemListItem, Testcase } from '../../types'

export interface GetProblemsParams {
  keyword?: string
  minDifficulty?: number
  maxDifficulty?: number
  page?: number
  size?: number
  sort?: string[]
}

export async function getProblems(
  params: GetProblemsParams = {}
): Promise<PaginatedResponse<ProblemListItem>> {
  const searchParams = new URLSearchParams()
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.minDifficulty !== undefined)
    searchParams.set('minDifficulty', String(params.minDifficulty))
  if (params.maxDifficulty !== undefined)
    searchParams.set('maxDifficulty', String(params.maxDifficulty))
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sort) {
    params.sort.forEach((s) => searchParams.append('sort', s))
  }

  const query = searchParams.toString()
  return fetchApi<PaginatedResponse<ProblemListItem>>(
    `/problems${query ? `?${query}` : ''}`
  )
}

export async function getProblem(problemId: number): Promise<ProblemDetail> {
  return fetchApi<ProblemDetail>(`/problems/${problemId}`)
}

export async function getTestcases(problemId: number): Promise<Testcase[]> {
  return fetchApi<Testcase[]>(`/problems/${problemId}/testcases`)
}
