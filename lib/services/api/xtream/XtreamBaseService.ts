import { CORS_HEADERS, API_USER_AGENT, ALLOWED_HOSTS } from '@/lib/config/constants'

export abstract class XtreamBaseService {
  protected static buildApiUrl(baseUrl: string, username: string, password: string): string {
    if (!baseUrl || !username || !password) {
      throw new Error('Missing required credentials')
    }

    const url = new URL(`${baseUrl}/player_api.php`)
    url.searchParams.set('username', username)
    url.searchParams.set('password', password)
    return url.toString()
  }

  public static normalizeUrl(url: string | undefined | null): string {
    if (!url) {
      throw new Error('URL is required')
    }

    const trimmedUrl = url.trim().replace(/\/+$/, '')
    
    try {
      // Test if it's already a valid URL
      new URL(trimmedUrl)
      return trimmedUrl
    } catch {
      // If not, prepend http://
      const urlWithProtocol = `http://${trimmedUrl}`
      // Validate the URL with protocol
      try {
        new URL(urlWithProtocol)
        return urlWithProtocol
      } catch {
        throw new Error('Invalid URL format')
      }
    }
  }

  protected static async proxyRequest<T>(url: string): Promise<T> {
    if (!url) {
      throw new Error('URL is required for API request')
    }

    try {
      const targetUrl = new URL(url)
      
      if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
        throw new Error(`Invalid host: ${targetUrl.hostname}`)
      }

      const response = await fetch(url, {
        headers: {
          'Accept': '*/*',
          'User-Agent': API_USER_AGENT
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data) {
        throw new Error('Empty response from API')
      }

      return data as T
    } catch (error) {
      console.error('Xtream API request failed:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to fetch data from Xtream service')
    }
  }
}