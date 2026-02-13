import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Header } from './components/common/Header'
import { HomePage } from './pages/HomePage'
import { ProblemsPage } from './pages/ProblemsPage'
import { ProblemPage } from './pages/ProblemPage'
import { WorkbooksPage } from './pages/WorkbooksPage'
import { WorkbookDetailPage } from './pages/WorkbookDetailPage'
import { OAuthCallbackPage } from './pages/OAuthCallbackPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useUIStore, applyTheme } from './stores/uiStore'

function App() {
  const themePreference = useUIStore((s) => s.themePreference)

  useEffect(() => {
    applyTheme(themePreference)
  }, [themePreference])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-bg transition-colors">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:problemId" element={<ProblemPage />} />
          <Route path="/workbooks" element={<WorkbooksPage />} />
          <Route path="/workbooks/:workbookId" element={<WorkbookDetailPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface-dark)',
            color: 'var(--color-text-light)',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
