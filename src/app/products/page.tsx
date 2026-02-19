import { Prisma } from '@prisma/client'
import ProductListView from '@/components/public/ProductListView'
import prisma from '@/lib/prisma'

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const query = readStringParam(searchParams?.q).trim()
  const categoryFilter = readStringParam(searchParams?.category).trim()
  const sackColorFilter = readStringParam(searchParams?.sackColor).trim()
  const page = readPositiveIntParam(searchParams?.page, 1)
  const requestedPageSize = readPositiveIntParam(searchParams?.pageSize, 12)
  const allowedPageSizes = [6, 12, 24, 48]
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : 12

  const andFilters: Prisma.ProductWhereInput[] = []

  if (query.length > 0) {
    andFilters.push({
      OR: [
        { code: { contains: query } },
        { name: { contains: query } },
        { description: { contains: query } },
        { sackColor: { contains: query } },
        { category: { name: { contains: query } } },
      ],
    })
  }

  if (categoryFilter.length > 0) {
    andFilters.push({
      categoryId: categoryFilter,
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

  const [totalCount, filteredCount, categories, sackColorRows] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where }),
    prisma.category.findMany({
      select: {
        id: true,
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
      image: true,
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
      <ProductListView
        title="Semua Produk"
        subtitle="Gunakan filter dan pagination berbasis query parameter."
        basePath="/products"
        backHref="/"
        backLabel="Back"
        query={query}
        categoryFilter={categoryFilter}
        categoryOptions={categories}
        sackColorFilter={sackColorFilter}
        sackColorOptions={sackColorRows.map((item: { sackColor: string }) => item.sackColor)}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        filteredCount={filteredCount}
        products={products.map((product) => ({
          id: product.id,
          code: product.code,
          name: product.name,
          description: product.description,
          sackColor: product.sackColor,
          image: product.image
            ? {
                systemPath: product.image.systemPath,
              }
            : null,
          category: {
            id: product.category.id,
            name: product.category.name,
            icon: product.category.icon,
          },
        }))}
      />
    </main>
  )
}
