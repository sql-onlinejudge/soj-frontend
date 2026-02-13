import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const RETURN_KEY = 'soj-login-return'

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  useEffect(() => {
    login()
    const returnTo = sessionStorage.getItem(RETURN_KEY) || '/'
    sessionStorage.removeItem(RETURN_KEY)
    navigate(returnTo, { replace: true })
  }, [login, navigate])

  return null
}
