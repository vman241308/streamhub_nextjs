import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { XtreamAuthService } from '@/lib/services/api/xtream/XtreamAuthService'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { CredentialsRepository } from '@/lib/repositories/CredentialsRepository'
import { AUTH_COOKIE_OPTIONS } from '@/lib/config/constants'
import type { XtreamCredentials } from '@/types/xtream'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!'
)

const JWT_EXPIRES_IN = '24h'

interface SessionData {
  serverId: number
  username: string
}

interface SessionUser {
  serverId: number
  username: string
}

type CustomJWTPayload = {
  serverId: number
  username: string
  exp?: number
  iat?: number
}

export class AuthService {
  private static async createSession(serverId: number, username: string) {
    const token = await new SignJWT({ serverId, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET)

    cookies().set('session', token, AUTH_COOKIE_OPTIONS)

    return {
      serverId,
      username
    }
  }

  static async getCurrentUser(): Promise<SessionUser | null> {
    const sessionToken = cookies().get('session')?.value
    if (!sessionToken) return null

    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET)
      const { serverId, username } = payload as { serverId: number; username: string }

      if (!serverId || !username) {
        return null
      }

      return { serverId, username }
    } catch (error) {
      console.error('Failed to verify session:', error)
      return null
    }
  }

  static async login(credentials: XtreamCredentials) {
    const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
    
    // First check if server exists
    const server = await ServerRepository.getByUrl(baseUrl)
    if (server) {
      // Check if credentials exist and are valid
      const storedCredentials = await CredentialsRepository.findCredentials(
        credentials.username,
        credentials.password,
        server.id
      )

      if (storedCredentials) {
        return this.createSession(server.id, credentials.username)
      }
    }

    // If no valid credentials found, verify with external API
    const authResponse = await XtreamAuthService.authenticate(
      baseUrl,
      credentials.username,
      credentials.password
    )

    if (!authResponse.user_info?.auth) {
      throw new Error('Invalid credentials')
    }

    // Store new server and credentials
    const serverId = await ServerRepository.createOrUpdate(baseUrl)
    await CredentialsRepository.save(
      credentials.username,
      credentials.password,
      serverId
    )

    return this.createSession(serverId, credentials.username)
  }

  static async logout() {
    cookies().delete('session')
  }

  static async verify() {
    const sessionToken = cookies().get('session')?.value
    if (!sessionToken) return { isAuthenticated: false }

    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET)
      // Cast the generic JWT payload to our custom type
      const customPayload = payload as unknown as CustomJWTPayload

      if (!customPayload.serverId || !customPayload.username) {
        throw new Error('Invalid token payload')
      }

      return {
        isAuthenticated: true,
        serverId: customPayload.serverId,
        username: customPayload.username
      }
    } catch (error) {
      // Token is invalid or expired
      cookies().delete('session')
      return { isAuthenticated: false }
    }
  }
}