import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../auth'

// Rate limiting store (in production, use Redis)
const rateLimit = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  const limit = rateLimit.get(ip)

  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  limit.count++

  return limit.count > maxRequests
}

export default async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Security headers
  const response = NextResponse.next()

  // CSRF protection (skip for setup-admin and init-db)
  if (request.method === 'POST' && !request.nextUrl.pathname.startsWith('/api/setup-admin') && !request.nextUrl.pathname.startsWith('/api/init-db')) {
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (!referer || !origin || !referer.includes(host!) || !origin.includes(host!)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com https://accounts.google.com;"
  )

  // Check authentication for protected routes
  const session = await auth()

  // Define unprotected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/')
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/')
  const isSetupRoute = request.nextUrl.pathname.startsWith('/api/setup-admin')
  const isInitRoute = request.nextUrl.pathname.startsWith('/api/init-db')
  const isSetupPageRoute = request.nextUrl.pathname === '/setup'
  const isPublicRoute = request.nextUrl.pathname === '/'

  // Don't protect public homepage, auth routes, and setup page
  if (!isAuthRoute && !isApiAuthRoute && !isSetupRoute && !isInitRoute && !isSetupPageRoute && !isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}