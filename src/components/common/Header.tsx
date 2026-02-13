import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { logout as logoutApi } from '../../services/api/auth'
import { LoginModal } from './LoginModal'

export function Header() {
  const themePreference = useUIStore((s) => s.themePreference)
  const setThemePreference = useUIStore((s) => s.setThemePreference)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const logout = useAuthStore((s) => s.logout)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const toggleTheme = () => {
    setThemePreference(themePreference === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = async () => {
    try {
      await logoutApi()
    } finally {
      logout()
    }
  }

  return (
    <>
    <header className="bg-surface-bg/80 backdrop-blur-sm border-b border-border-input h-14 w-full sticky top-0 z-50 transition-colors">
      <div className="px-10 h-full flex items-center justify-between">
        <Link to="/" aria-label="Querify 홈으로" className="flex items-center gap-1.5">
          <span className="text-brand-primary text-[22px] font-bold" style={{ fontFamily: 'JetBrains Mono' }}>{'>'}</span>
          <span className="text-text-primary text-lg font-medium" style={{ fontFamily: 'JetBrains Mono' }}>Querify</span>
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={themePreference === 'dark'}
            aria-label="다크 모드 전환"
            className={`relative w-11 h-6 rounded-full transition-colors ${
              themePreference === 'dark' ? 'bg-brand-primary' : 'bg-surface-light'
            }`}
          >
            <span
              className={`absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-surface-bg shadow transition-all ${
                themePreference === 'dark' ? 'left-[22px]' : 'left-0.5'
              }`}
            >
              {themePreference === 'dark' ? (
                <svg className="w-3 h-3 text-brand-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              )}
            </span>
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-[13px] font-medium bg-brand-primary text-surface-bg rounded px-4 py-2 hover:bg-brand-primary-hover transition-colors"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              로그인
            </button>
          )}
        </div>
      </div>

    </header>
    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
