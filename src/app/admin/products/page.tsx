import { Prisma } from '@prisma/client'
import AdminShell from '../../../components/admin/AdminShell'
import ProductManager from '../../../components/admin/ProductManager'
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

export default async function ProductAdminPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const auth = await requireRole(['SUPERADMIN', 'ADMIN'])
  const query = readStringParam(searchParams?.q).trim()
  const categoryFilter = readStringParam(searchParams?.category).trim()
  const sackColorFilter = readStringParam(searchParams?.sackColor).trim()
  const page = readPositiveIntParam(searchParams?.page, 1)
  const requestedPageSize = readPositiveIntParam(searchParams?.pageSize, 10)
  const allowedPageSizes = [5, 10, 20, 50, 100]
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : 10

  const andFilters: Prisma.ProductWhereInput[] = []
  if (query.length > 0) {
    andFilters.push({
      OR: [
        { code: { contains: query } },
        { name: { contains: query } },
        { sackColor: { contains: query } },
        { category: { name: { contains: query } } },
      ],
    })
  }
  if (categoryFilter.length > 0) {
    andFilters.push({
      category: {
        name: categoryFilter,
      },
    })
  }
  if (sackColorFilter.length > 0) {
    andFilters.push({
      sackColor: sackColorFilter,
    })
  }

  const where: Prisma.ProductWhereInput =
    andFilters.length > 0
      ? {
          AND: andFilters,
        }
      : {}

  const [totalCount, filteredCount, categoryRows, sackColorRows] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where }),
    prisma.category.findMany({
      select: {
        name: true,
      },
      orderBy: [{ orderNumber: 'asc' }, { name: 'asc' }],
    }),
    prisma.product.findMany({
      select: {
        sackColor: true,
      },
      distinct: ['sackColor'],
      orderBy: {
        sackColor: 'asc',
      },
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize))
  const currentPage = Math.min(page, totalPages)

  const products = await prisma.product.findMany({
    where,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          nutritions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <AdminShell
      title="Product Management"
      description="Create, update, and delete products."
      roleLabel={auth.role}
    >
      <ProductManager
        initialProducts={products}
        query={query}
        categoryFilter={categoryFilter}
        sackColorFilter={sackColorFilter}
        categoryOptions={categoryRows.map((item: { name: string }) => item.name)}
        sackColorOptions={sackColorRows.map((item: { sackColor: string }) => item.sackColor)}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
    </AdminShell>
  )
}
