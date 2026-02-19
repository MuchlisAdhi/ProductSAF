import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { getLucideIcon } from '@/lib/lucideIcons'
import { getSackColorBadgeClass } from '@/lib/sackColor'

type ProductItem = {
  id: string
  code: string
  name: string
  description: string
  sackColor: string
  image: {
    systemPath: string
  } | null
  category?: {
    id: string
    name: string
    icon: string
  }
}

type ProductListViewProps = {
  title: string
  subtitle: string
  basePath: string
  products: ProductItem[]
  query: string
  categoryFilter?: string
  categoryOptions?: Array<{ id: string; name: string }>
  sackColorFilter: string
  sackColorOptions: string[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  filteredCount: number
  backHref?: string
  backLabel?: string
  categoryMeta?: {
    name: string
    icon: string
  }
}

function withQuery(
  basePath: string,
  params: {
    query: string
    categoryFilter?: string
    sackColorFilter: string
    pageSize: number
    page: number
  }
) {
  const next = new URLSearchParams()
  if (params.query.trim()) {
    next.set('q', params.query.trim())
  }
  if (params.categoryFilter && params.categoryFilter.trim()) {
    next.set('category', params.categoryFilter.trim())
  }
  if (params.sackColorFilter.trim()) {
    next.set('sackColor', params.sackColorFilter.trim())
  }
  if (params.pageSize !== 12) {
    next.set('pageSize', String(params.pageSize))
  }
  if (params.page > 1) {
    next.set('page', String(params.page))
  }

  const serialized = next.toString()
  return serialized ? `${basePath}?${serialized}` : basePath
}

export default function ProductListView({
  title,
  subtitle,
  basePath,
  products,
  query,
  categoryFilter = '',
  categoryOptions = [],
  sackColorFilter,
  sackColorOptions,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  filteredCount,
  backHref = '/',
  backLabel = 'Back',
  categoryMeta,
}: ProductListViewProps) {
  const CategoryIcon = getLucideIcon(categoryMeta?.icon || 'Box')

  const previousPageHref = withQuery(basePath, {
    query,
    categoryFilter,
    sackColorFilter,
    pageSize,
    page: Math.max(1, currentPage - 1),
  })

  const nextPageHref = withQuery(basePath, {
    query,
    categoryFilter,
    sackColorFilter,
    pageSize,
    page: Math.min(totalPages, currentPage + 1),
  })

  const currentListHref = withQuery(basePath, {
    query,
    categoryFilter,
    sackColorFilter,
    pageSize,
    page: currentPage,
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-sido-green focus:outline-none focus:ring-2 focus:ring-sido-gold/70"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {filteredCount} produk
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sido-green/10 text-sido-green">
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-600">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white p-4 sm:p-6">
        <form
          action={basePath}
          method="get"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Search code, name, description..."
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
              />
            </div>
          </div>

          {categoryOptions.length > 0 ? (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Category
              </label>
              <select
                name="category"
                defaultValue={categoryFilter}
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Sack Color</label>
            <select
              name="sackColor"
              defaultValue={sackColorFilter}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
            >
              <option value="">All Colors</option>
              {sackColorOptions.map((sackColorOption) => (
                <option key={sackColorOption} value={sackColorOption}>
                  {sackColorOption}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Rows</label>
              <select
                name="pageSize"
                defaultValue={String(pageSize)}
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <input type="hidden" name="page" value="1" />
              <button
                type="submit"
                className="min-h-[44px] flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
          </div>
        </form>

        <div className="mt-3 flex justify-end">
          <Link
            href={basePath}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Reset filters
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            No products found for current filters.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}?returnTo=${encodeURIComponent(currentListHref)}`}
                className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sido-green/40 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-sido-gold/70"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img
                      src={
                        product.image?.systemPath ||
                        'https://placehold.co/120x180/e2e8f0/334155?text=No+Image'
                      }
                      alt={`Karung ${product.code}`}
                      className="h-20 w-16 object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-sido-green">{product.code}</div>
                    <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
                      {product.name}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${getSackColorBadgeClass(
                          product.sackColor
                        )}`}
                      >
                        {product.sackColor}
                      </span>
                      {product.category ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {product.category.name}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-xs text-slate-600">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{products.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{filteredCount}</span> products (
          {totalCount} total)
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={previousPageHref}
            aria-disabled={currentPage <= 1}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 ${
              currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <span className="px-2 text-sm font-semibold text-slate-700">
            {currentPage} / {totalPages}
          </span>

          <Link
            href={nextPageHref}
            aria-disabled={currentPage >= totalPages}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 ${
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-100'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
