import { NextRequest, NextResponse } from 'next/server'
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from './src/lib/auth'

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const payload = await verifyAccessToken(token)

  if (!payload) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (
    request.nextUrl.pathname.startsWith('/admin/users') &&
    payload.role !== 'SUPERADMIN'
  ) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
