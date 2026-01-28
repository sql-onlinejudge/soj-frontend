import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-white">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
