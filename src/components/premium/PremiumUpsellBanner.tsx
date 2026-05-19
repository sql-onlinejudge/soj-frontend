import { useNavigate } from 'react-router-dom'

interface PremiumUpsellBannerProps {
  message?: string
}

export function PremiumUpsellBanner({ message = 'AI 피드백은 프리미엄 전용입니다' }: PremiumUpsellBannerProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm text-amber-300">{message}</span>
      </div>
      <button
        onClick={() => navigate('/pricing')}
        className="shrink-0 px-3 py-1.5 rounded text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
      >
        구독하기
      </button>
    </div>
  )
}
