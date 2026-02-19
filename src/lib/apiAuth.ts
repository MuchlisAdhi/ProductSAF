import type { Role } from '@prisma/client'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from '@/lib/auth'

export async function getApiAuthPayload() {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value
  return verifyAccessToken(token)
}

export async function hasAnyRole(roles: Role[]) {
  const payload = await getApiAuthPayload()
  if (!payload) return false
  return roles.includes(payload.role)
}
