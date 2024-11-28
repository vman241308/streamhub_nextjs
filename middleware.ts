import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that don't require authentication
const publicRoutes = ['/', '/api/auth/login', '/api/auth/verify', '/api/dev/truncate']
const publicApiRoutes = ['/api/auth']

// Secret key for JWT verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow all auth-related API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Check for session token
  const sessionToken = request.cookies.get('session')?.value

  if (!sessionToken) {
    // Return 401 for API routes, redirect to login for pages
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return redirectToLogin(request)
  }

  try {
    // Verify JWT
    await jwtVerify(sessionToken, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // Token is invalid or expired
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const response = redirectToLogin(request)
    response.cookies.delete('session')
    return response
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}