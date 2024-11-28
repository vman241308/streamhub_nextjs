import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/server/CategoryService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    
    const categories = await CategoryService.getCategories(
      serverId ? parseInt(serverId, 10) : undefined
    )
    
    return NextResponse.json(categories, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}