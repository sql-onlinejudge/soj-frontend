import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useSandboxStore } from '../stores/sandboxStore'
import { LoginModal } from '../components/common/LoginModal'
import { ImageUploadZone } from '../components/sandbox/ImageUploadZone'
import { SetupResult } from '../components/sandbox/SetupResult'
import { SandboxEditor } from '../components/sandbox/SandboxEditor'
import { SandboxQueryResult } from '../components/sandbox/SandboxQueryResult'
import { SandboxHistory } from '../components/sandbox/SandboxHistory'

export function SandboxPage() {
  const QUERY_STORAGE_KEY = 'sandbox-query'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [query, setQuery] = useState(() => sessionStorage.getItem(QUERY_STORAGE_KEY) ?? 'SELECT ')

  const handleQueryChange = (value: string) => {
    setQuery(value)
    sessionStorage.setItem(QUERY_STORAGE_KEY, value)
  }

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const phase = useSandboxStore((s) => s.phase)
  const session = useSandboxStore((s) => s.session)
  const queryResult = useSandboxStore((s) => s.queryResult)
  const queryError = useSandboxStore((s) => s.queryError)
  const runQuery = useSandboxStore((s) => s.runQuery)
  const restoreSession = useSandboxStore((s) => s.restoreSession)
  const resetSession = useSandboxStore((s) => s.resetSession)
  const closeSession = useSandboxStore((s) => s.closeSession)
  const loadSession = useSandboxStore((s) => s.loadSession)
  const reactivateSession = useSandboxStore((s) => s.reactivateSession)

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    restoreSession()
  }, [isLoggedIn, restoreSession])

  useEffect(() => {
    const handleUnload = () => closeSession()
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [closeSession])

  const handleRun = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    runQuery(query)
  }

  const isReady = phase === 'ready'
  const isQuerying = phase === 'querying'

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>
            OCR 샌드박스
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            ERD 또는 테이블 구조 이미지를 업로드하면 샌드박스 DB가 세팅됩니다.
          </p>
        </div>

        {!isReady && !isQuerying ? (
          <ImageUploadZone onLoginRequired={() => setIsLoginModalOpen(true)} />
        ) : session ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <SetupResult session={session} collapsed />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={resetSession}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  새 세션
                </button>
              </div>
            </div>

            <SandboxEditor
              value={query}
              onChange={handleQueryChange}
              onRun={handleRun}
              isRunning={isQuerying}
              disabled={!isReady && !isQuerying}
            />

            <SandboxQueryResult
              result={queryResult}
              isLoading={isQuerying}
              error={queryError}
            />
          </>
        ) : null}
        {isLoggedIn && (
          <SandboxHistory
            currentSessionKey={session?.sessionKey}
            onLoad={loadSession}
            onReactivate={reactivateSession}
          />
        )}
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
