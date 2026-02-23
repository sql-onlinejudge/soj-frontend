import type { RunResult, RunTestCaseResult } from '../../types'

interface ExecutionResultProps {
  result: RunResult | null
}

function ResultTable({ testCase }: { testCase: RunTestCaseResult }) {
  if (testCase.errorMessage) {
    return (
      <div className="bg-status-error/10 border border-status-error/30 rounded p-3">
        <p className="text-status-error-text text-sm font-mono">{testCase.errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-sm font-mono border-collapse w-full">
        <thead>
          <tr className="border-b border-border-input">
            {testCase.columns.map((col) => (
              <th
                key={col}
                className="text-left px-3 py-2 text-text-secondary font-semibold whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testCase.rows.map((row, i) => (
            <tr key={i} className="border-b border-border-input/50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-text-primary whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {testCase.rows.length === 0 && (
        <p className="text-text-muted text-sm px-3 py-2">결과 없음</p>
      )}
    </div>
  )
}

export function ExecutionResult({ result }: ExecutionResultProps) {
  if (!result) {
    return (
      <div className="p-5 text-text-muted">
        쿼리를 실행하면 결과가 여기에 표시됩니다.
      </div>
    )
  }

  if (result.status === 'PENDING' || result.status === 'IN_PROGRESS') {
    return (
      <div className="p-5 flex items-center gap-3 text-text-secondary">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
        실행 중...
      </div>
    )
  }

  if (result.status === 'FAILED') {
    const errorMessage = result.results?.[0]?.errorMessage ?? '알 수 없는 오류가 발생했습니다.'
    return (
      <div className="p-5">
        <div className="bg-status-error/10 border border-status-error/30 rounded p-3">
          <p className="text-status-error-text text-sm font-mono">{errorMessage}</p>
        </div>
      </div>
    )
  }

  if (result.status === 'COMPLETED' && result.results) {
    return (
      <div className="p-5 space-y-4">
        {result.results.map((tc, i) => (
          <div key={tc.testCaseId}>
            {result.results!.length > 1 && (
              <p className="text-xs text-text-secondary mb-2">
                테스트케이스 {i + 1}
              </p>
            )}
            <div className="bg-surface-dark rounded overflow-hidden">
              <ResultTable testCase={tc} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
