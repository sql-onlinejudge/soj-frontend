import { Button } from './Button'
import { Modal } from './Modal'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-8">
      <div className="text-center">
        <p className="text-white text-xl mb-4">기능을 준비중입니다.</p>
        <Button onClick={onClose}>확인</Button>
      </div>
    </Modal>
  )
}
