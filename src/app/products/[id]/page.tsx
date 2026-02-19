import { notFound } from 'next/navigation'
import ProductDetailView from '@/components/public/ProductDetailView'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function readStringParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      image: true,
      nutritions: true,
    },
  })

  if (!product) {
    notFound()
  }

  const returnTo = readStringParam(searchParams?.returnTo).trim()
  const safeReturnTo =
    returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : ''

  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
      <ProductDetailView
        backHref={safeReturnTo || `/categories/${product.category.id}`}
        backLabel={safeReturnTo ? 'Back to List' : 'Kembali'}
        category={{
          id: product.category.id,
          name: product.category.name,
          icon: product.category.icon,
        }}
        product={{
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
          nutritions: product.nutritions.map((nutrition) => ({
            id: nutrition.id,
            label: nutrition.label,
            value: nutrition.value,
          })),
        }}
      />
    </main>
  )
}
