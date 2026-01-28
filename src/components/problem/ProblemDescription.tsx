import Markdown from 'react-markdown'
import type { ProblemDetail, Testcase } from '../../types'
import { formatNumber } from '../../utils/formatters'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { StatusBadge } from '../badges/StatusBadge'

interface ProblemDescriptionProps {
  problem: ProblemDetail
  testcases: Testcase[]
}

function parseCreateTableSQL(sql: string): { tableName: string; columns: { name: string; type: string }[] }[] {
  const tables: { tableName: string; columns: { name: string; type: string }[] }[] = []
  const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\((.+?)\)(?:;|$)/gi

  let match
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1]
    const columnsStr = match[2]
    const columns: { name: string; type: string }[] = []

    const columnLines = columnsStr.split(',').map(line => line.trim()).filter(line => line)
    for (const line of columnLines) {
      if (line.toUpperCase().startsWith('PRIMARY KEY') ||
          line.toUpperCase().startsWith('FOREIGN KEY') ||
          line.toUpperCase().startsWith('CONSTRAINT')) {
        continue
      }
      const parts = line.split(/\s+/)
      if (parts.length >= 2) {
        columns.push({ name: parts[0], type: parts.slice(1).join(' ') })
      }
    }

    tables.push({ tableName, columns })
  }

  return tables
}

function parseAnswerToTable(answer: string): { rows: string[][] } | null {
  const lines = answer.trim().split('\n').filter(line => line.trim())
  if (lines.length === 0) return null

  const rows = lines.map(line => line.split('\t'))
  const colCount = rows[0].length
  if (colCount < 2 || rows.some(r => r.length !== colCount)) return null

  return { rows }
}

function parseInsertSQL(sql: string): { rows: string[][] } | null {
  if (!sql) return null
  const valuesMatch = sql.match(/VALUES\s*(.+)$/i)
  if (!valuesMatch) return null

  const rows: string[][] = []
  const tupleRegex = /\(([^)]+)\)/g
  let match
  while ((match = tupleRegex.exec(valuesMatch[1])) !== null) {
    const values = match[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''))
    rows.push(values)
  }

  if (rows.length === 0) return null
  return { rows }
}

function DataTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-border-light text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="bg-white">
              {row.map((cell, j) => (
                <td key={j} className="border border-border-light px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SchemaTable({ tableName, columns }: { tableName: string; columns: { name: string; type: string }[] }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-text-primary mb-2">{tableName}</p>
      <table className="w-full border border-border-light rounded text-sm">
        <thead>
          <tr className="bg-[rgba(0,0,0,0.06)]">
            <th className="border border-border-light px-3 py-2 text-left font-semibold">Column</th>
            <th className="border border-border-light px-3 py-2 text-left font-semibold">Type</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, idx) => (
            <tr key={idx} className="bg-white">
              <td className="border border-border-light px-3 py-2">{col.name}</td>
              <td className="border border-border-light px-3 py-2">{col.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TestcaseTable({ testcase, index }: { testcase: Testcase; index: number }) {
  const initParsed = parseInsertSQL(testcase.initSql)
  const answerParsed = parseAnswerToTable(testcase.answer)

  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-text-primary mb-2">테스트 케이스 #{index + 1}</h3>

      <p className="text-sm text-text-secondary mb-1">초기 데이터</p>
      {initParsed ? (
        <div className="mb-3">
          <DataTable rows={initParsed.rows} />
        </div>
      ) : (
        <div className="bg-white border border-border-light rounded p-3 mb-3 overflow-x-auto">
          <pre className="text-xs font-mono text-black whitespace-pre-wrap">{testcase.initSql || '(없음)'}</pre>
        </div>
      )}

      <p className="text-sm text-text-secondary mb-1">예상 결과</p>
      {answerParsed ? (
        <DataTable rows={answerParsed.rows} />
      ) : (
        <div className="bg-white border border-border-light rounded p-3 overflow-x-auto">
          <pre className="text-xs font-mono text-black whitespace-pre-wrap">{testcase.answer}</pre>
        </div>
      )}
    </div>
  )
}

export function ProblemDescription({ problem, testcases }: ProblemDescriptionProps) {
  const tables = parseCreateTableSQL(problem.schemaSql)

  return (
    <div className="bg-surface-background h-full overflow-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-xl font-medium text-text-primary">
            #{problem.id} {problem.title}
          </h1>
          <DifficultyBadge level={problem.difficulty} />
          <StatusBadge status={problem.trialStatus} />
        </div>
        <p className="text-base text-text-secondary mb-6">
          제출 수: {formatNumber(problem.submissionCount)} &nbsp;&nbsp; 정답 수:{' '}
          {formatNumber(problem.solvedCount)}
        </p>

        <section className="mb-6">
          <h2 className="text-base font-bold text-text-primary mb-2">문제 설명</h2>
          <div className="prose prose-sm max-w-none text-text-primary">
            <Markdown>{problem.description}</Markdown>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-bold text-text-primary mb-2">테이블 스키마</h2>
          {tables.length > 0 ? (
            tables.map((table, idx) => (
              <SchemaTable key={idx} tableName={table.tableName} columns={table.columns} />
            ))
          ) : (
            <div className="bg-white border border-border-light rounded p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-black whitespace-pre-wrap">
                {problem.schemaSql}
              </pre>
            </div>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-base font-bold text-text-primary mb-2">문제 조건</h2>
          <ul className="text-base text-text-primary list-disc pl-5 space-y-1">
            <li>제한 시간: {problem.timeLimit}ms</li>
            <li>
              결과 순서: {problem.isOrderSensitive ? '순서 구분' : '순서 무관'}
            </li>
          </ul>
        </section>

        {testcases.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-text-primary mb-4">테스트 케이스</h2>
            {testcases.map((tc, idx) => (
              <TestcaseTable key={tc.id} testcase={tc} index={idx} />
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
