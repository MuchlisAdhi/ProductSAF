import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'
import { ProductBulkDeleteSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = ProductBulkDeleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      )
    }

    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: parsed.data.ids,
        },
      },
    })

    return NextResponse.json({ success: true, count: result.count })
  } catch (error) {
    console.error('POST /api/products/bulk-delete error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
