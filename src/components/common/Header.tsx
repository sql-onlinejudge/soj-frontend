import { Link } from 'react-router-dom'

interface HeaderProps {
  onLoginClick: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  return (
    <header className="bg-surface-medium h-14 w-full flex items-center justify-between px-4 md:px-16 lg:px-64">
      <Link
        to="/"
        className="text-xl font-extrabold bg-gradient-to-r from-brand-gradient-from via-brand-gradient-via to-brand-gradient-to bg-clip-text text-transparent"
      >
        {'>_ SOJ'}
      </Link>
      <button
        onClick={onLoginClick}
        className="text-white text-base hover:opacity-80 transition-opacity"
      >
        로그인 | 회원가입
      </button>
    </header>
  )
}
