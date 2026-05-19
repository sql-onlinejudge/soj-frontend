import { fetchApi } from './client'
import type { AiFeedback } from '../../types'

export async function getAiFeedback(problemId: number, submissionId: number): Promise<AiFeedback> {
  return fetchApi<AiFeedback>(`/problems/${problemId}/submissions/${submissionId}/feedback`, {
    method: 'POST',
  })
}
