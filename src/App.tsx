import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Header } from './components/common/Header'
import { ComingSoonModal } from './components/common/ComingSoonModal'
import { HomePage } from './pages/HomePage'
import { ProblemPage } from './pages/ProblemPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header onLoginClick={() => setIsLoginModalOpen(true)} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems/:problemId" element={<ProblemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <ComingSoonModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
