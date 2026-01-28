interface ExecutionResultProps {
  result: string | null
}

export function ExecutionResult({ result }: ExecutionResultProps) {
  if (!result) {
    return (
      <div className="p-5 text-text-muted">
        쿼리를 실행하면 결과가 여기에 표시됩니다.
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="bg-surface-dark rounded p-4 overflow-x-auto">
        <pre className="text-base font-mono text-text-light whitespace-pre-wrap">
          {result}
        </pre>
      </div>
    </div>
  )
}
