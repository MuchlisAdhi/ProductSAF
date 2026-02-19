import CategoryGrid from '@/components/public/CategoryGrid'
import Hero from '@/components/public/Hero'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const categories = await prisma.category.findMany({
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
    <main>
      <Hero />

      <section id="katalog" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <CategoryGrid categories={categories} />
      </section>
    </main>
  )
}
