import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const categoryId = params.id
  if (!categoryId) {
    notFound()
  }

  const query = readStringParam(searchParams?.q).trim()
  const sackColorFilter = readStringParam(searchParams?.sackColor).trim()
  const page = readPositiveIntParam(searchParams?.page, 1)
  const requestedPageSize = readPositiveIntParam(searchParams?.pageSize, 12)
  const allowedPageSizes = [6, 12, 24, 48]
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : 12

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  })

  if (!category) {
    notFound()
  }

  const andFilters: Prisma.ProductWhereInput[] = [{ categoryId }]

  if (query.length > 0) {
    andFilters.push({
      OR: [
        { code: { contains: query } },
        { name: { contains: query } },
        { description: { contains: query } },
        { sackColor: { contains: query } },
      ],
    })
  }

  if (sackColorFilter.length > 0) {
    andFilters.push({
      sackColor: sackColorFilter,
    })
  }

  const where: Prisma.ProductWhereInput = {
    AND: andFilters,
  }

  const [totalCount, filteredCount, sackColorRows] = await Promise.all([
    prisma.product.count({
      where: {
        categoryId,
      },
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: {
        categoryId,
      },
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
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
      <ProductListView
        title={category.name}
        subtitle="Cari produk berdasarkan kode, nama, deskripsi, atau warna karung."
        basePath={`/categories/${category.id}`}
        backHref="/"
        backLabel="Back"
        categoryMeta={{
          name: category.name,
          icon: category.icon,
        }}
        query={query}
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
        }))}
      />
    </main>
  )
}
