import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`Middleware: ${pathname}, Role: ${role}, Token: ${!!token}`);

  // 1. Protect Dashboard Routes
  if (pathname.startsWith('/dashboard')) {
    // If not logged in, redirect to login
    if (!token || !role) {
      const url = new URL('/login', request.url);
      url.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Role-based Access Control
    if (pathname.startsWith('/dashboard/organizer') && role !== 'ORGANIZER') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname.startsWith('/dashboard/participant') && role !== 'PARTICIPANT') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Protect Auth Routes (if already logged in)
  if ((pathname === '/login' || pathname === '/register') && token && role) {
    // Redirect to appropriate dashboard based on role
    if (role === 'ORGANIZER') {
      return NextResponse.redirect(new URL('/dashboard/organizer', request.url));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
    // Default fallback
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
