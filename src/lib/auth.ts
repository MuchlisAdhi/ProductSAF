import type { Role } from '@prisma/client'
import { jwtVerify, SignJWT } from 'jose'

export const ACCESS_TOKEN_COOKIE = 'saf_access_token'

export type AuthTokenPayload = {
  userId: string
  email: string
  role: Role
}

function getJwtSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-only-jwt-secret-change-me'
  )
}

export async function signAccessToken(payload: AuthTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtSecret())
}

export async function verifyAccessToken(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: payload.role as Role,
    }
  } catch {
    return null
  }
}
