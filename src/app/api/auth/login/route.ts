import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ACCESS_TOKEN_COOKIE, signAccessToken } from '@/lib/auth'
import { LoginSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = LoginSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    console.error('POST /api/auth/login error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
