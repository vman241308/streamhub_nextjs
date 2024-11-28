"use client"

interface LoginCredentials {
  url: string
  username: string
  password: string
}

interface AuthResponse {
  serverId: number
  username: string
  needsSetup: boolean
}

interface VerifyResponse {
  isAuthenticated: boolean
  serverId?: number
  username?: string
  needsSetup?: boolean
}

interface CurrentUser {
  serverId: number
  username: string
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Authentication failed')
    }

    return response.json()
  }

  static async logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', { 
      method: 'POST' 
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Logout failed')
    }
  }

  static async verify(): Promise<VerifyResponse> {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      return { isAuthenticated: false }
    }

    return response.json()
  }

  static async getCurrentUser(): Promise<CurrentUser | null> {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  }
}