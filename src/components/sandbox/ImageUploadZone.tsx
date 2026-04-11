import { useRef, useState } from 'react'
import { useSandboxStore } from '../../stores/sandboxStore'
import { useAuthStore } from '../../stores/authStore'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

interface ImageUploadZoneProps {
  onLoginRequired: () => void
}

export function ImageUploadZone({ onLoginRequired }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [clientError, setClientError] = useState<string | null>(null)

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const phase = useSandboxStore((s) => s.phase)
  const setupError = useSandboxStore((s) => s.setupError)
  const setupSandbox = useSandboxStore((s) => s.setupSandbox)

  const isUploading = phase === 'uploading'

  function handleFile(file: File) {
    setClientError(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setClientError('지원하지 않는 이미지 형식입니다. JPEG, PNG, GIF, WEBP만 가능합니다.')
      return
    }
    const url = URL.createObjectURL(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(url)
    setupSandbox(file)
  }

  function handleClick() {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    inputRef.current?.click()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const error = clientError || setupError

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-brand-primary bg-brand-primary/5'
            : 'border-border-input hover:border-brand-primary/50 hover:bg-surface-panel'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={previewUrl}
              alt="업로드된 이미지 미리보기"
              className="max-h-48 max-w-full rounded object-contain"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                OCR 처리 중...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-text-primary text-sm font-medium">이미지를 드래그하거나 클릭하여 업로드</p>
              <p className="text-text-muted text-xs mt-1">JPEG, PNG, GIF, WEBP 지원</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error/30 rounded p-3">
          <p className="text-status-error-text text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
