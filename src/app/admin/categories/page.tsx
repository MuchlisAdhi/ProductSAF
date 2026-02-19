import { Prisma } from '@prisma/client'
import AdminShell from '../../../components/admin/AdminShell'
import CategoryManager from '../../../components/admin/CategoryManager'
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

export default async function CategoryAdminPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const auth = await requireRole(['SUPERADMIN', 'ADMIN'])
  const query = readStringParam(searchParams?.q).trim()
  const iconFilter = readStringParam(searchParams?.icon).trim()
  const page = readPositiveIntParam(searchParams?.page, 1)
  const requestedPageSize = readPositiveIntParam(searchParams?.pageSize, 10)
  const allowedPageSizes = [5, 10, 20, 50, 100]
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : 10

  const andFilters: Prisma.CategoryWhereInput[] = []
  if (query.length > 0) {
    const queryAsOrderNumber = Number(query)
    const isOrderNumberQuery =
      Number.isInteger(queryAsOrderNumber) && queryAsOrderNumber >= 0

    andFilters.push({
      OR: [
        { name: { contains: query } },
        { icon: { contains: query } },
        ...(isOrderNumberQuery ? [{ orderNumber: queryAsOrderNumber }] : []),
      ],
    })
  }
  if (iconFilter.length > 0) {
    andFilters.push({
      icon: iconFilter,
    })
  }

  const where: Prisma.CategoryWhereInput =
    andFilters.length > 0
      ? {
          AND: andFilters,
        }
      : {}

  const [totalCount, filteredCount, iconRows] = await Promise.all([
    prisma.category.count(),
    prisma.category.count({ where }),
    prisma.category.findMany({
      select: {
        icon: true,
      },
      distinct: ['icon'],
      orderBy: {
        icon: 'asc',
      },
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize))
  const currentPage = Math.min(page, totalPages)

  const categories = await prisma.category.findMany({
    where,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [{ orderNumber: 'asc' }, { name: 'asc' }],
  })

  return (
    <AdminShell
      title="Category Management"
      description="Create, update, and delete product categories."
      roleLabel={auth.role}
    >
      <CategoryManager
        initialCategories={categories}
        query={query}
        iconFilter={iconFilter}
        iconOptions={iconRows.map((item: { icon: string }) => item.icon)}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
    </AdminShell>
  )
}
