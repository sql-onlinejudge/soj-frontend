import { Link } from 'react-router-dom'

interface HeaderProps {
  onLoginClick: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-14 w-full">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-extrabold bg-gradient-to-r from-brand-gradient-from via-brand-gradient-via to-brand-gradient-to bg-clip-text text-transparent"
        >
          {'>_ SOJ'}
        </Link>
        <button
          onClick={onLoginClick}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          로그인 | 회원가입
        </button>
      </div>
    </header>
  )
}
