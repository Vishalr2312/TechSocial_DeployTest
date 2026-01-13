import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('loginToken')?.value;
  const { pathname } = req.nextUrl;

  // Define public routes
  const publicPaths = ['/login', '/api/public'];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If no token and not in a public route → redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If logged in and tries to access login → redirect home
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
