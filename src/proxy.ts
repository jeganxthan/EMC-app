import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect Dashboard and Patient API routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/patients')) {
    if (!token) {
      // If API request, return 401 JSON
      if (pathname.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
      }
      // If Page request, redirect to Login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from Login/Register pages
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/patients/:path*', '/login', '/register'],
};
