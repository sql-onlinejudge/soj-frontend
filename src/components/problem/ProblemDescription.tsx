import Markdown from 'react-markdown'
import type { AnswerMetadata, ColumnMetadata, InitMetadata, ProblemDetail, Testcase } from '../../types'
import { formatNumber } from '../../utils/formatters'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { StatusBadge } from '../badges/StatusBadge'

interface ProblemDescriptionProps {
  problem: ProblemDetail
  testcases: Testcase[]
}


function InitDataTable({ initMetadata }: { initMetadata: InitMetadata }) {
  return (
    <div className="space-y-3">
      {initMetadata.statements.map((stmt, idx) => {
        const columns = stmt.rows.length > 0 ? Object.keys(stmt.rows[0]) : []
        return (
          <div key={idx}>
            <p className="text-xs text-text-secondary mb-1">{stmt.table}</p>
            <div className="overflow-x-auto">
              <table className="w-full border border-border-light text-sm">
                <thead>
                  <tr className="bg-[rgba(0,0,0,0.06)]">
                    {columns.map(col => (
                      <th key={col} className="border border-border-light px-3 py-2 text-left font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stmt.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="bg-white">
                      {columns.map(col => (
                        <td key={col} className="border border-border-light px-3 py-2">
                          {row[col] != null ? String(row[col]) : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AnswerTable({ answerMetadata }: { answerMetadata: AnswerMetadata }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-border-light text-sm">
        <thead>
          <tr className="bg-[rgba(0,0,0,0.06)]">
            {answerMetadata.columns.map(col => (
              <th key={col} className="border border-border-light px-3 py-2 text-left font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {answerMetadata.rows.map((row, i) => (
            <tr key={i} className="bg-white">
              {row.map((cell, j) => (
                <td key={j} className="border border-border-light px-3 py-2">
                  {cell != null ? String(cell) : 'NULL'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SchemaTable({ tableName, columns }: { tableName: string; columns: ColumnMetadata[] }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-text-primary mb-2">{tableName}</p>
      <table className="w-full border border-border-light rounded text-sm">
        <thead>
          <tr className="bg-[rgba(0,0,0,0.06)]">
            <th className="border border-border-light px-3 py-2 text-left font-semibold">Column</th>
            <th className="border border-border-light px-3 py-2 text-left font-semibold">Type</th>
            <th className="border border-border-light px-3 py-2 text-left font-semibold">Constraints</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, idx) => (
            <tr key={idx} className="bg-white">
              <td className="border border-border-light px-3 py-2">{col.name}</td>
              <td className="border border-border-light px-3 py-2">{col.type}</td>
              <td className="border border-border-light px-3 py-2">{col.constraints.join(' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TestcaseTable({ testcase, index }: { testcase: Testcase; index: number }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-text-primary mb-2">테스트 케이스 #{index + 1}</h3>

      {testcase.initMetadata && (
        <>
          <p className="text-sm text-text-secondary mb-1">초기 데이터</p>
          <div className="mb-3">
            <InitDataTable initMetadata={testcase.initMetadata} />
          </div>
        </>
      )}

      {testcase.answerMetadata && (
        <>
          <p className="text-sm text-text-secondary mb-1">예상 결과</p>
          <AnswerTable answerMetadata={testcase.answerMetadata} />
        </>
      )}
    </div>
  )
}

export function ProblemDescription({ problem, testcases }: ProblemDescriptionProps) {
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
          {problem.schemaMetadata ? (
            problem.schemaMetadata.tables.map((table, idx) => (
              <SchemaTable key={idx} tableName={table.name} columns={table.columns} />
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
