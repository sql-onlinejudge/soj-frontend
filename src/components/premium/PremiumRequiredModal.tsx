import { useNavigate } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

interface PremiumRequiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PremiumRequiredModal({ isOpen, onClose }: PremiumRequiredModalProps) {
  const navigate = useNavigate()

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="프리미엄 구독 필요">
      <div className="flex flex-col items-center gap-5 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold text-text-primary">프리미엄 구독이 필요합니다</h2>
          <p className="text-sm text-text-secondary">이 콘텐츠는 프리미엄 구독자만 이용할 수 있습니다.</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            닫기
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              onClose()
              navigate('/pricing')
            }}
          >
            구독하기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
