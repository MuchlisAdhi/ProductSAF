import { NextResponse } from 'next/server'
import { hasAnyRole } from '@/lib/apiAuth'
import { processAndStoreImage } from '@/lib/imageUpload'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    if (!(await hasAnyRole(['SUPERADMIN', 'ADMIN']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    const image = await processAndStoreImage(file)
    const asset = await prisma.asset.create({ data: image })

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('POST /api/assets/upload error', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
