import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
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

function Layout() {
  const themePreference = useUIStore((s) => s.themePreference)

  useEffect(() => {
    applyTheme(themePreference)
  }, [themePreference])

  return (
    <div className="min-h-screen bg-surface-bg transition-colors">
      <Header />
      <Outlet />
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
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/problems', element: <ProblemsPage /> },
      { path: '/problems/:problemId', element: <ProblemPage /> },
      { path: '/workbooks', element: <WorkbooksPage /> },
      { path: '/workbooks/:workbookId', element: <WorkbookDetailPage /> },
      { path: '/oauth/callback', element: <OAuthCallbackPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
