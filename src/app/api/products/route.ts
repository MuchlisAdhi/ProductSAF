import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { ProductSchema } from '@/lib/validators'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      nutritions: true,
      image: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: products })
}

export async function POST(request: Request) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = ProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      )
    }

    const data = parsed.data

    const created = await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      })
      if (!category) {
        throw new Error('CATEGORY_NOT_FOUND')
      }

      if (data.imageId) {
        const asset = await tx.asset.findUnique({
          where: { id: data.imageId },
          select: { id: true },
        })
        if (!asset) {
          throw new Error('ASSET_NOT_FOUND')
        }
      }

      return tx.product.create({
        data: {
          code: data.code,
          name: data.name,
          description: data.description,
          sackColor: data.sackColor,
          categoryId: data.categoryId,
          imageId: data.imageId ?? null,
          nutritions: {
            create: data.nutritions.map((nutrition) => ({
              label: nutrition.label,
              value: nutrition.value,
            })),
          },
        },
        include: {
          category: true,
          nutritions: true,
          image: true,
        },
      })
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'CATEGORY_NOT_FOUND') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (error instanceof Error && error.message === 'ASSET_NOT_FOUND') {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Product code must be unique' }, { status: 409 })
    }

    console.error('POST /api/products error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
