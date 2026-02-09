import Editor from '@monaco-editor/react'
import { useUIStore } from '../../stores/uiStore'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onRun: () => void
  isSubmitting?: boolean
}

export function CodeEditor({
  value,
  onChange,
  onSubmit,
  onRun,
  isSubmitting,
}: CodeEditorProps) {
  const themePreference = useUIStore((s) => s.themePreference)
  const isDark = themePreference === 'dark'

  return (
    <div className="bg-surface-panel h-full flex flex-col">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-surface-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-[13px] font-semibold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>
            SQL Editor
          </span>
          <select
            className="bg-surface-dark text-text-light text-[12px] rounded px-2 py-1 border-none focus:outline-none cursor-pointer"
            style={{ fontFamily: 'JetBrains Mono' }}
            aria-label="DBMS 선택"
          >
            <option value="mysql">MySQL</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium bg-surface-dark text-text-light transition-colors"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            실행
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium bg-brand-primary hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
            style={{ fontFamily: 'JetBrains Mono', color: '#0A0A0A' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {isSubmitting ? '제출 중...' : '제출'}
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={(val) => onChange(val || '')}
          theme={isDark ? 'vs-dark' : 'light'}
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
    </div>
  )
}
