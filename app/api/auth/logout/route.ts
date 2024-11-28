import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function POST() {
  try {
    await AuthService.logout()
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Logout failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Logout failed' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}