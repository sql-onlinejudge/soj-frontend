import { v4 as uuidv4 } from 'uuid'

const CUSTOMER_KEY = 'soj-customer-key'

export function getUserId(): string {
  let id = localStorage.getItem(CUSTOMER_KEY)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(CUSTOMER_KEY, id)
  }
  return id
}

export function useUserId(): string {
  return getUserId()
}
