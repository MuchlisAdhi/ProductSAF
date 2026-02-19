import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ACCESS_TOKEN_COOKIE, signAccessToken } from '@/lib/auth'
import { SignupSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = SignupSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        password: hashedPassword,
      },
    })

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
    }

    console.error('POST /api/auth/signup error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
