import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const UPLOAD_FOLDER = path.join(process.cwd(), 'public', 'uploads')

export async function processAndStoreImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  await fs.mkdir(UPLOAD_FOLDER, { recursive: true })

  const inputBuffer = Buffer.from(await file.arrayBuffer())
  const systemFileName = `${Date.now()}-${crypto.randomUUID()}.webp`
  const absolutePath = path.join(UPLOAD_FOLDER, systemFileName)

  const result = await sharp(inputBuffer)
    .rotate()
    .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(absolutePath)

  return {
    originalFileName: file.name,
    systemPath: `/uploads/${systemFileName}`,
    mimeType: 'image/webp',
    size: result.size,
  }
}
