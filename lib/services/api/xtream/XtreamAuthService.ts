import { XtreamBaseService } from './XtreamBaseService'
import type { AuthResponse } from '@/types/xtream'

export class XtreamAuthService extends XtreamBaseService {
  static async authenticate(url: string, username: string, password: string): Promise<AuthResponse> {
    if (!url || !username || !password) {
      throw new Error('Missing required credentials')
    }

    try {
      const baseUrl = this.normalizeUrl(url)
      const apiUrl = this.buildApiUrl(baseUrl, username, password)
      
      const response = await this.proxyRequest<AuthResponse>(apiUrl)
      
      if (!response.user_info?.auth) {
        throw new Error('Invalid credentials')
      }

      return response
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to authenticate with Xtream service')
    }
  }
}