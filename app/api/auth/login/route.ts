import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function POST(request: Request) {
  try {
    const credentials = await request.json()
    
    if (!credentials.url || !credentials.username || !credentials.password) {
      return NextResponse.json(
        { error: 'Missing required credentials' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const result = await AuthService.login(credentials)
    return NextResponse.json(result, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Login failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}