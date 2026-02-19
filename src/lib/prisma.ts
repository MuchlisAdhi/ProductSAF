import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const useMariaDbAdapter = process.env.PRISMA_USE_MARIADB_ADAPTER === 'true'
  if (useMariaDbAdapter && process.env.DATABASE_URL) {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
    return new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    })
  }

  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
