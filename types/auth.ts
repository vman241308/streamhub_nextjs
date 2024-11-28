export interface LoginCredentials {
    url: string
    username: string
    password: string
  }
  
  export interface AuthResponse {
    serverId: number
    username: string
    needsSetup: boolean
  }
  
  export interface VerifyResponse {
    isAuthenticated: boolean
    serverId?: number
    username?: string
  }
  
  export interface SessionUser {
    serverId: number
    username: string
  }