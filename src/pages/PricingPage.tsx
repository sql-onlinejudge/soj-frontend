import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import toast from 'react-hot-toast'
import { checkout } from '../services/api/payments'
import { cancelSubscription } from '../services/api/subscriptions'
import { ApiError } from '../services/api/client'
import { useAuthStore } from '../stores/authStore'
import { useSubscriptionStore } from '../stores/subscriptionStore'
import { getUserId } from '../hooks/useUserId'
import { LoginModal } from '../components/common/LoginModal'
import { Modal } from '../components/common/Modal'

const FEATURES = [
  '프리미엄 문제집 전체 이용',
  'AI 피드백 무제한 (Claude Haiku)',
  '오답 쿼리 개선 방향 제시',
  '풀이 접근법 상세 설명',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function PricingPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const isPremium = useSubscriptionStore((s) => s.isPremium)
  const subscription = useSubscriptionStore((s) => s.subscription)
  const invalidate = useSubscriptionStore((s) => s.invalidate)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

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

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelSubscription()
      await invalidate()
      toast.success('구독이 취소되었습니다.')
      setIsCancelModalOpen(false)
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message)
      } else {
        toast.error('구독 취소에 실패했습니다.')
      }
    } finally {
      setIsCancelling(false)
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
          {isPremium && subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 w-fit">
                    PRO
                  </span>
                  <span className="text-sm text-text-secondary mt-1">
                    {formatDate(subscription.expiresAt)} 만료
                  </span>
                </div>
                <span className="text-3xl font-bold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>
                  구독 중
                </span>
              </div>

              <ul className="flex flex-col gap-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-brand-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full h-12 rounded-lg font-semibold border border-border-input text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
              >
                구독 취소
              </button>
            </>
          ) : (
            <>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>1,900</span>
                <span className="text-sm text-text-secondary mb-1">원 / 월</span>
              </div>

              <ul className="flex flex-col gap-3">
                {FEATURES.map((feature) => (
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
            </>
          )}
        </div>

        <p className="text-center text-xs text-text-muted">
          토스페이먼츠를 통해 안전하게 결제됩니다. 언제든지 해지할 수 있습니다.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
          <Link to="/terms" className="hover:text-text-secondary transition-colors">이용약관</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-text-secondary transition-colors">개인정보처리방침</Link>
          <span>·</span>
          <Link to="/refund" className="hover:text-text-secondary transition-colors">환불 정책</Link>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} ariaLabel="구독 취소 확인">
        <div className="flex flex-col gap-5 p-6 w-80">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base font-bold text-text-primary">구독을 취소하시겠습니까?</h2>
            {subscription && (
              <p className="text-sm text-text-secondary">
                {formatDate(subscription.expiresAt)}까지는 계속 이용할 수 있습니다.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
              className="flex-1 h-10 rounded-lg text-sm font-semibold border border-border-input text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors disabled:opacity-60"
            >
              유지하기
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex-1 h-10 rounded-lg text-sm font-semibold bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
            >
              {isCancelling ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  처리 중...
                </>
              ) : (
                '취소하기'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
