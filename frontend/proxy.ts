import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const role = request.cookies.get('role')?.value
  const pathname = request.nextUrl.pathname

  // If not logged in, only allow access to login and register
  if (!token) {
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // User is logged in from here
  
  // If role cookie is missing or invalid, redirect to login (session may be corrupted)
  if (!role || (role !== 'ADMIN' && role !== 'PARTICIPANT')) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('access_token')
    response.cookies.delete('role')
    return response
  }

  // Redirect away from login/register if already authenticated
  if (pathname === '/login' || pathname === '/register') {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Protect Admin Dashboard - only ADMIN can access
  if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Protect Participant Home - only PARTICIPANT can access
  if (pathname.startsWith('/home') && role !== 'PARTICIPANT') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/home/:path*', '/login', '/register'],
}
