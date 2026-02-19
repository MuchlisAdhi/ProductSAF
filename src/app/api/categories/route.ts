import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { CategorySchema } from '@/lib/validators'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [{ orderNumber: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json({ data: categories })
}

export async function POST(request: Request) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = CategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: parsed.data,
    })
    return NextResponse.json({ data: category }, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
    }
    console.error('POST /api/categories error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
