import { useMemo, useState } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { products } from '../data/catalog.js'
import { iconMap } from './IconMap.jsx'
import { cn, extractImageUrl } from '../lib/catalogUtils.js'

export default function ProductListView({ category, onBack, onOpenProduct }) {
  const Icon = iconMap[category.icon]
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const base = products.filter((p) => p.categoryId === category.id)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((p) => {
      const hay = `${p.code} ${p.name} ${p.description}`.toLowerCase()
      return hay.includes(q)
    })
  }, [category.id, query])

  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-sido-green focus:outline-none focus:ring-2 focus:ring-sido-gold/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {filtered.length} produk
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sido-green/10 text-sido-green">
            {Icon ? <Icon className="h-5 w-5" /> : null}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{category.name}</h2>
            <p className="text-xs text-slate-600">Cari berdasarkan kode, nama, atau deskripsi.</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <label className="sr-only" htmlFor="search">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className={cn(
                'w-full min-h-[44px] rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm',
                'placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60'
              )}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sido-gold/70"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Menampilkan <span className="font-semibold">{filtered.length}</span> hasil.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Tidak ada produk yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpenProduct(p.id)}
                className={cn(
                  'group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm',
                  'transition hover:border-sido-green/40 hover:shadow-soft',
                  'focus:outline-none focus:ring-2 focus:ring-sido-gold/70'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img
                      src={extractImageUrl(p.image)}
                      alt={`Karung ${p.code}`}
                      className="h-20 w-16 object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-sido-green">{p.code}</div>
                    <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
                      {p.name}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sido-green/10 px-2 py-0.5 text-[11px] font-semibold text-sido-green">
                        {p.sackColor}
                      </span>
                      <span className="rounded-full bg-sido-gold/20 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        Detail
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600">
                      {p.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
