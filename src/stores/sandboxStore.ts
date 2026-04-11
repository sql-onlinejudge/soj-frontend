import { create } from 'zustand'
import type { SandboxSession, SandboxQueryResponse } from '../types'
import { setupSandbox as setupSandboxApi, querySandbox, getSandboxSession } from '../services/api'
import { ApiError } from '../services/api/client'

const SESSION_STORAGE_KEY = 'sandbox-session-key'

const ERROR_MESSAGES: Record<string, string> = {
  UNSUPPORTED_IMAGE_TYPE: '지원하지 않는 이미지 형식입니다. JPEG, PNG, GIF, WEBP만 가능합니다.',
  FORBIDDEN_SETUP_SQL: '이미지에서 허용되지 않는 SQL이 감지되었습니다.',
  OCR_EXTRACTION_FAILED: '이미지에서 SQL을 추출하지 못했습니다. 더 선명한 이미지를 사용해 주세요.',
  SANDBOX_SCHEMA_SETUP_FAILED: '죄송합니다. 처리 중 오류가 발생했습니다.',
  SANDBOX_FORBIDDEN: '권한이 없습니다.',
  SANDBOX_SESSION_NOT_FOUND: '세션을 찾을 수 없습니다.',
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code] ?? '죄송합니다. 처리 중 오류가 발생했습니다.'
  }
  return '죄송합니다. 처리 중 오류가 발생했습니다.'
}

interface SandboxState {
  phase: 'idle' | 'uploading' | 'ready' | 'querying'
  session: SandboxSession | null
  queryResult: SandboxQueryResponse | null
  setupError: string | null
  queryError: string | null

  setupSandbox: (image: File) => Promise<void>
  runQuery: (query: string) => Promise<void>
  restoreSession: () => Promise<void>
  resetSession: () => void
  markExpired: () => void
}

export const useSandboxStore = create<SandboxState>((set, get) => ({
  phase: 'idle',
  session: null,
  queryResult: null,
  setupError: null,
  queryError: null,

  setupSandbox: async (image: File) => {
    set({ phase: 'uploading', setupError: null })
    try {
      const session = await setupSandboxApi(image)
      sessionStorage.setItem(SESSION_STORAGE_KEY, session.sessionKey)
      set({ phase: 'ready', session, queryResult: null })
    } catch (error) {
      set({ phase: 'idle', setupError: getErrorMessage(error) })
    }
  },

  runQuery: async (query: string) => {
    const { session } = get()
    if (!session) return
    set({ phase: 'querying', queryError: null })
    try {
      const result = await querySandbox(session.sessionKey, query)
      set({ phase: 'ready', queryResult: result })
    } catch (error) {
      if (error instanceof ApiError && error.status === 410) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        set({ phase: 'idle', session: null, queryError: 'SANDBOX_SESSION_EXPIRED' })
      } else {
        set({ phase: 'ready', queryError: getErrorMessage(error) })
      }
    }
  },

  restoreSession: async () => {
    const key = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!key) return
    try {
      const session = await getSandboxSession(key)
      if (session.expired) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        return
      }
      set({ phase: 'ready', session })
    } catch (error) {
      if (error instanceof ApiError && (error.status === 410 || error.status === 404)) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
      }
    }
  },

  resetSession: () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    set({ phase: 'idle', session: null, queryResult: null, setupError: null, queryError: null })
  },

  markExpired: () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    set({ phase: 'idle', session: null, queryResult: null })
  },
}))
