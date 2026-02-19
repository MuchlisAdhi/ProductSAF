import type { Role } from '@prisma/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from '@/lib/auth'

export async function getAuthPayloadFromCookie() {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value
  return verifyAccessToken(token)
}

export async function requireAuth() {
  const payload = await getAuthPayloadFromCookie()
  if (!payload) {
    redirect('/login')
  }
  return payload
}

export async function requireRole(roles: Role[]) {
  const payload = await requireAuth()
  if (!roles.includes(payload.role)) {
    redirect('/admin')
  }
  return payload
}
