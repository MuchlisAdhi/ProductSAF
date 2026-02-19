import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { CategoryUpdateSchema } from '@/lib/validators'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = context.params.id
    if (!id) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = CategoryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ data: category })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
    }

    console.error('PUT /api/categories/[id] error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = context.params.id
    if (!id) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'Category is used by products and cannot be deleted' },
        { status: 409 }
      )
    }

    console.error('DELETE /api/categories/[id] error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
