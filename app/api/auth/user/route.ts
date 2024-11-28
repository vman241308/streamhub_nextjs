import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        null,
        { status: 401, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(user, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to get current user:', error)
    return NextResponse.json(
      null,
      { status: 401, headers: CORS_HEADERS }
    )
  }
}