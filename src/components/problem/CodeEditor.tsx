import Editor from '@monaco-editor/react'
import { Button } from '../common/Button'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function CodeEditor({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: CodeEditorProps) {
  return (
    <div className="bg-surface-dark h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 16 },
            ariaLabel: 'SQL 쿼리 입력',
          }}
        />
      </div>
      <div className="p-3 flex justify-end border-t border-surface-medium">
        <Button onClick={onSubmit} disabled={isSubmitting || !value.trim()}>
          {isSubmitting ? '제출 중...' : '제출'}
        </Button>
      </div>
    </div>
  )
}
