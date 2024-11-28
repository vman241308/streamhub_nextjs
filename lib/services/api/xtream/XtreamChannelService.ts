import { XtreamBaseService } from './XtreamBaseService'
import type { Channel } from '@/types/xtream'

export class XtreamChannelService extends XtreamBaseService {
  static async getChannels(url: string, username: string, password: string): Promise<Channel[]> {
    if (!url || !username || !password) {
      throw new Error('Missing required credentials')
    }

    try {
      const baseUrl = this.normalizeUrl(url)
      const apiUrl = new URL(this.buildApiUrl(baseUrl, username, password))
      apiUrl.searchParams.set('action', 'get_live_streams')

      const response = await this.proxyRequest<Channel[]>(apiUrl.toString())
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format')
      }

      return response
    } catch (error) {
      console.error('Failed to fetch channels:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to fetch channels from Xtream service')
    }
  }
}