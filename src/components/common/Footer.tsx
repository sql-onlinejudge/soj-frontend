import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border-input bg-surface-bg px-10 py-6 mt-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <Link to="/terms" className="hover:text-text-secondary transition-colors">이용약관</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-text-secondary transition-colors">개인정보처리방침</Link>
          <span>·</span>
          <Link to="/refund" className="hover:text-text-secondary transition-colors">환불 정책</Link>
        </div>
        <p className="text-xs text-text-muted">© 2026 Querify. All rights reserved.</p>
      </div>
    </footer>
  )
}
