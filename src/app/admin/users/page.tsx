import { Prisma, Role } from '@prisma/client'
import AdminShell from '../../../components/admin/AdminShell'
import UserManager from '../../../components/admin/UserManager'
import prisma from '../../../lib/prisma'
import { requireRole } from '../../../lib/serverAuth'

export const dynamic = 'force-dynamic'

function readStringParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function readPositiveIntParam(value?: string | string[], fallback = 1) {
  const raw = readStringParam(value)
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

export default async function UserAdminPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const auth = await requireRole(['SUPERADMIN'])
  const query = readStringParam(searchParams?.q).trim()
  const roleFilter = readStringParam(searchParams?.role).trim()
  const page = readPositiveIntParam(searchParams?.page, 1)
  const requestedPageSize = readPositiveIntParam(searchParams?.pageSize, 10)
  const allowedPageSizes = [5, 10, 20, 50, 100]
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : 10

  const andFilters: Prisma.UserWhereInput[] = []
  if (query.length > 0) {
    andFilters.push({
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
      ],
    })
  }
  if (roleFilter.length > 0 && Object.values(Role).includes(roleFilter as Role)) {
    andFilters.push({
      role: roleFilter as Role,
    })
  }

  const where: Prisma.UserWhereInput =
    andFilters.length > 0
      ? {
          AND: andFilters,
        }
      : {}

  const [totalCount, filteredCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize))
  const currentPage = Math.min(page, totalPages)

  const users = await prisma.user.findMany({
    where,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <AdminShell
      title="User Management"
      description="Only SUPERADMIN can manage users and roles."
      roleLabel={auth.role}
    >
      <UserManager
        initialUsers={users}
        currentUserId={auth.userId}
        query={query}
        roleFilter={roleFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
    </AdminShell>
  )
}
