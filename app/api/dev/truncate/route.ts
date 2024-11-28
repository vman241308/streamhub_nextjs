import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/server/DatabaseService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403, headers: CORS_HEADERS }
    )
  }

  try {
    const connection = await DatabaseService.getConnection()
    
    // Disable foreign key checks temporarily
    await connection.query('SET FOREIGN_KEY_CHECKS = 0')
    
    // Drop all tables
    await connection.query('DROP TABLE IF EXISTS credentials')
    await connection.query('DROP TABLE IF EXISTS channels')
    await connection.query('DROP TABLE IF EXISTS categories')
    await connection.query('DROP TABLE IF EXISTS servers')
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1')
    
    connection.release()

    // Reinitialize database with fresh tables
    await DatabaseService.initialize()

    return NextResponse.json(
      { message: 'Database reset successfully' },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('Failed to reset database:', error)
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}