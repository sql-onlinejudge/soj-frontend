import { useState } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import toast from 'react-hot-toast'
import { checkout } from '../services/api/payments'
import { ApiError } from '../services/api/client'
import { useAuthStore } from '../stores/authStore'
import { getUserId } from '../hooks/useUserId'
import { LoginModal } from '../components/common/LoginModal'

export function PricingPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const data = await checkout()
      const tossPayments = await loadTossPayments(data.clientKey)
      const payment = tossPayments.payment({ customerKey: getUserId() })

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: data.amount },
        orderId: data.orderId,
        orderName: 'SOJ 프리미엄 구독 1개월',
        successUrl: data.successUrl,
        failUrl: data.failUrl,
      })
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">프리미엄 구독</h1>
          <p className="text-sm text-text-secondary">AI 피드백과 프리미엄 문제집으로 실력을 한 단계 높이세요.</p>
        </div>

        <div className="rounded-xl border border-brand-primary/40 bg-surface-panel p-6 flex flex-col gap-6">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>9,900</span>
            <span className="text-sm text-text-secondary mb-1">원 / 월</span>
          </div>

          <ul className="flex flex-col gap-3">
            {[
              '프리미엄 문제집 전체 이용',
              'AI 피드백 무제한 (Claude Haiku)',
              '오답 쿼리 개선 방향 제시',
              '풀이 접근법 상세 설명',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary">
                <svg className="w-4 h-4 text-brand-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full h-12 rounded-lg font-semibold bg-brand-primary text-[#0A0A0A] hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                처리 중...
              </>
            ) : (
              '구독 시작하기'
            )}
          </button>
        </div>

        <p className="text-center text-xs text-text-muted">
          토스페이먼츠를 통해 안전하게 결제됩니다. 언제든지 해지할 수 있습니다.
        </p>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}
