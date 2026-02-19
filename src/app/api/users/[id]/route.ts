import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getApiAuthPayload, hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { UserUpdateSchema } from '@/lib/validators'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = UserUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      )
    }

    const nextPassword =
      parsed.data.password && parsed.data.password.length > 0
        ? await bcrypt.hash(parsed.data.password, 12)
        : null

    const user = await prisma.user.update({
      where: { id: context.params.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role,
        ...(nextPassword ? { password: nextPassword } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ data: user })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    console.error('PUT /api/users/[id] error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const auth = await getApiAuthPayload()
    if (auth?.userId === context.params.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: context.params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.error('DELETE /api/users/[id] error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
