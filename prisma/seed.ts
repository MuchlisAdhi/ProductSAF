import bcrypt from 'bcryptjs'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@sidoagung.com'
  const password = 'password123'
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Super Admin',
      password: passwordHash,
      role: Role.SUPERADMIN,
    },
    create: {
      name: 'Super Admin',
      email,
      password: passwordHash,
      role: Role.SUPERADMIN,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Seed failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
