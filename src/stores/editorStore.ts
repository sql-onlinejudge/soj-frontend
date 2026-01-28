import { create } from 'zustand'

interface EditorState {
  code: string
  setCode: (code: string) => void
  resetCode: () => void
}

const DEFAULT_CODE = 'SELECT '

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE,
  setCode: (code: string) => set({ code }),
  resetCode: () => set({ code: DEFAULT_CODE }),
}))
