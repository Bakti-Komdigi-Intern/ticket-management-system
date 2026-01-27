import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/api/auth/login'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Allow API routes to handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect to login if no token and not on login page
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if has token and on login page
  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};