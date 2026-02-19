import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { ProductUpdateSchema } from '@/lib/validators'

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: context.params.id },
    include: {
      category: true,
      nutritions: true,
      image: true,
    },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ data: product })
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = ProductUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      )
    }

    const productId = context.params.id
    const data = parsed.data

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true },
      })
      if (!existing) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

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

      await tx.nutrition.deleteMany({
        where: { productId },
      })

      await tx.product.update({
        where: { id: productId },
        data: {
          code: data.code,
          name: data.name,
          description: data.description,
          sackColor: data.sackColor,
          categoryId: data.categoryId,
          imageId: data.imageId ?? null,
        },
      })

      await tx.nutrition.createMany({
        data: data.nutritions.map((nutrition) => ({
          productId,
          label: nutrition.label,
          value: nutrition.value,
        })),
      })

      return tx.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          nutritions: true,
          image: true,
        },
      })
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
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

    console.error('PUT /api/products/[id] error', error)
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

    await prisma.product.delete({
      where: { id: context.params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.error('DELETE /api/products/[id] error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
