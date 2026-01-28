import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'soj-user-id'

export function useUserId(): string {
  const [userId] = useState<string>(() => {
    const stored = localStorage.getItem(USER_ID_KEY)
    if (stored) return stored
    const newId = uuidv4()
    localStorage.setItem(USER_ID_KEY, newId)
    return newId
  })

  return userId
}

export function getUserId(): string {
  const stored = localStorage.getItem(USER_ID_KEY)
  if (stored) return stored
  const newId = uuidv4()
  localStorage.setItem(USER_ID_KEY, newId)
  return newId
}
