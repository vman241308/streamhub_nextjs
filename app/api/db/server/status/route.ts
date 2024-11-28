import { NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server/ServerService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const url = searchParams.get('url')

    if (!serverId && !url) {
      return NextResponse.json(
        { error: 'Missing serverId or url parameter' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const serverStatus = serverId 
      ? await ServerService.checkServerStatus(parseInt(serverId, 10))
      : await ServerService.checkServerStatusByUrl(url!)

    return NextResponse.json(serverStatus, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to check server status:', error)
    return NextResponse.json(
      { error: 'Failed to check server status' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}