import type { SandboxQueryResponse } from '../../types'

interface SandboxQueryResultProps {
  result: SandboxQueryResponse | null
  isLoading?: boolean
  error?: string | null
}

export function SandboxQueryResult({ result, isLoading, error }: SandboxQueryResultProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-panel border border-border-input rounded-lg p-5 flex items-center gap-3 text-text-secondary">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
        실행 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface-panel border border-border-input rounded-lg p-5">
        <div className="bg-status-error/10 border border-status-error/30 rounded p-3">
          <p className="text-status-error-text text-sm font-mono">{error}</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="bg-surface-panel border border-border-input rounded-lg p-5 text-text-muted text-sm">
        쿼리를 실행하면 결과가 여기에 표시됩니다.
      </div>
    )
  }

  return (
    <div className="bg-surface-panel border border-border-input rounded-lg overflow-hidden">
      <div className="bg-surface-dark overflow-x-auto">
        <table className="text-sm font-mono border-collapse w-full">
          <thead>
            <tr className="border-b border-border-input">
              {result.columns.map((col) => (
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
            {result.rows.map((row, i) => (
              <tr key={i} className="border-b border-border-input/50">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 whitespace-nowrap">
                    {cell === null ? (
                      <span className="text-text-muted italic">NULL</span>
                    ) : (
                      <span className="text-text-primary">{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {result.rows.length === 0 && (
          <p className="text-text-muted text-sm px-3 py-2">결과 없음</p>
        )}
      </div>
    </div>
  )
}
