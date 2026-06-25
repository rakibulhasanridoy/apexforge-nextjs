import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isPrivate =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/payment') ||
    /^\/classes\/.+/.test(pathname) ||
    /^\/forum\/.+/.test(pathname)

  if (isPrivate && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Prevent logged-in users from visiting login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/payment/:path*',
    '/classes/:path*',
    '/forum/:path*',
    '/login',
    '/register',
  ],
}
