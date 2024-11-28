import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const categoryId = searchParams.get('categoryId')
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const channels = await ChannelService.getChannelsByCategory(
      parseInt(serverId, 10),
      categoryId || undefined
    )
    
    return NextResponse.json(channels, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to fetch channels:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch channels' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}