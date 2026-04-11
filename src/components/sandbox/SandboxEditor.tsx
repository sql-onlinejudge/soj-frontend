import Editor from '@monaco-editor/react'
import { useUIStore } from '../../stores/uiStore'

interface SandboxEditorProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  isRunning?: boolean
  disabled?: boolean
}

export function SandboxEditor({ value, onChange, onRun, isRunning, disabled }: SandboxEditorProps) {
  const themePreference = useUIStore((s) => s.themePreference)
  const isDark = themePreference === 'dark'

  return (
    <div className="bg-surface-panel border border-border-input rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-surface-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-[13px] font-semibold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>
            SQL Editor
          </span>
        </div>
        <button
          onClick={onRun}
          disabled={isRunning || disabled || !value.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium bg-brand-primary hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
          style={{ fontFamily: 'JetBrains Mono', color: '#0A0A0A' }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          {isRunning ? '실행 중...' : '실행'}
        </button>
      </div>
      <div style={{ height: '240px' }}>
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
            readOnly: disabled,
            ariaLabel: 'SQL 쿼리 입력',
          }}
          onMount={(editor) => {
            editor.addCommand(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).monaco?.KeyMod.CtrlCmd | (window as any).monaco?.KeyCode.Enter,
              () => { if (!isRunning && !disabled && value.trim()) onRun() }
            )
          }}
        />
      </div>
    </div>
  )
}
