import { BASE_URL } from './client'

export function getGoogleLoginUrl(): string {
  return `${BASE_URL}/oauth2/authorization/google`
}

export function getGithubLoginUrl(): string {
  return `${BASE_URL}/oauth2/authorization/github`
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
