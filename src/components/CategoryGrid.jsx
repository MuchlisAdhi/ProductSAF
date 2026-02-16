import { categories, products } from '../data/catalog.js'
import { iconMap } from './IconMap.jsx'
import { cn } from '../lib/catalogUtils.js'

export default function CategoryGrid({ onSelectCategory }) {
  const counts = products.reduce((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Kategori Produk</h2>
          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            Total: {products.length}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Ketuk kategori untuk menampilkan daftar produk.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon]
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm',
                  'transition hover:-translate-y-0.5 hover:border-sido-green/40 hover:shadow-soft',
                  'focus:outline-none focus:ring-2 focus:ring-sido-gold/70',
                  'min-h-[96px]'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-sido-green/10 text-sido-green">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </div>
                  <span className="rounded-full bg-sido-gold/20 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {counts[cat.id] || 0}
                  </span>
                </div>

                <div className="mt-3 text-sm font-semibold leading-snug text-slate-900">
                  {cat.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">Lihat produk</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
