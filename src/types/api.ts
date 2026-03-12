export interface SubmissionResponse {
  submissionId: string;
  status: string;
  verdict?: string;
  executionTimeMs?: number;
}

export interface SubmissionDetailResponse {
  submissionId: string;
  status: string;
  verdict?: string;
  executionTimeMs?: number;
  errorMessage?: string;
  code: string;
  language: string;
  createdAt: string;
}

export interface RunResponse {
  runId: string;
  status: string;
}

export type ProblemSortType = 'CREATED_AT_DESC' | 'CREATED_AT_ASC' | 'SOLVED_COUNT_DESC';

export interface ProblemListParams {
  sort?: ProblemSortType;
  page?: number;
  size?: number;
}

export interface TestCaseUpdateRequest {
  visible?: boolean;
  input?: string;
  expectedOutput?: string;
}
