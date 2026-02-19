import Link from 'next/link'
import { getLucideIcon } from '@/lib/lucideIcons'

type CategoryItem = {
  id: string
  name: string
  icon: string
  _count: {
    products: number
  }
}

export default function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  const total = categories.reduce((acc, category) => acc + category._count.products, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Kategori Produk</h2>
          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            Total: {total}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Pilih kategori untuk menampilkan daftar produk.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = getLucideIcon(category.icon)
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sido-green/40 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-sido-gold/70 min-h-[96px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-sido-green/10 text-sido-green">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-sido-gold/20 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {category._count.products}
                  </span>
                </div>

                <div className="mt-3 text-sm font-semibold leading-snug text-slate-900">
                  {category.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">Lihat produk</div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
