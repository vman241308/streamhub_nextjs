import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const query = searchParams.get('query')
    
    if (!serverId || !query) {
      return NextResponse.json(
        { error: 'Server ID and query are required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const channels = await ChannelService.searchChannels(
      parseInt(serverId, 10),
      query
    )
    
    return NextResponse.json(channels, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to search channels:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search channels' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}