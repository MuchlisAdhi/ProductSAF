'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type ProductRow = {
  id: string
  code: string
  name: string
  sackColor: string
  createdAt: string | Date
  category: {
    name: string
  }
  _count: {
    nutritions: number
  }
}

export default function ProductManager({
  initialProducts,
  query,
  categoryFilter,
  sackColorFilter,
  categoryOptions,
  sackColorOptions,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  filteredCount,
}: {
  initialProducts: ProductRow[]
  query: string
  categoryFilter: string
  sackColorFilter: string
  categoryOptions: string[]
  sackColorOptions: string[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  filteredCount: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<ProductRow[]>(initialProducts)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  useEffect(() => {
    setSelectedIds(new Set())
  }, [initialProducts])

  useEffect(() => {
    const status = searchParams.get('status')
    if (!status) return

    if (status === 'created') {
      setSuccess('Product has been created.')
    } else if (status === 'updated') {
      setSuccess('Product has been updated.')
    } else {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete('status')
    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname)
  }, [searchParams, pathname, router])

  const pageProductIds = products.map((product) => product.id)
  const allPageSelected =
    pageProductIds.length > 0 &&
    pageProductIds.every((productId) => selectedIds.has(productId))
  const selectedCount = selectedIds.size

  const updateQueryParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value.trim() === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    const next = params.toString()
    router.push(next ? `${pathname}?${next}` : pathname)
  }

  const submitFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateQueryParams({
      q: searchInput.trim() || null,
      category: categoryFilter || null,
      sackColor: sackColorFilter || null,
      page: '1',
    })
  }

  const handleDelete = async (productId: string) => {
    setError(null)
    setSuccess(null)
    if (!window.confirm('Delete this product?')) return

    setDeletingId(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Failed to delete product')
        return
      }

      setProducts((prev) => prev.filter((product) => product.id !== productId))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
      setSuccess('Product deleted.')
      if (products.length === 1 && currentPage > 1) {
        updateQueryParams({ page: String(currentPage - 1) })
      } else {
        router.refresh()
      }
    } finally {
      setDeletingId(null)
    }
  }

  const toggleRow = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const toggleSelectPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        for (const productId of pageProductIds) {
          next.delete(productId)
        }
      } else {
        for (const productId of pageProductIds) {
          next.add(productId)
        }
      }
      return next
    })
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setError(null)
    setSuccess(null)

    if (!window.confirm(`Delete ${selectedIds.size} selected products?`)) return

    setBulkDeleting(true)
    try {
      const ids = Array.from(selectedIds)
      const response = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Failed to delete selected products')
        return
      }

      const remainingRows = products.filter((product) => !selectedIds.has(product.id))
      setProducts(remainingRows)
      setSelectedIds(new Set())
      setSuccess(`${payload.count || ids.length} products deleted.`)
      if (remainingRows.length === 0 && currentPage > 1) {
        updateQueryParams({ page: String(currentPage - 1) })
      } else {
        router.refresh()
      }
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-4 py-3 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">Product List</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={selectedCount === 0 || bulkDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedCount})
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-sido-green px-3 py-2 text-sm font-semibold text-white hover:bg-sido-green/90"
          >
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </div>
      </header>

      <div className="grid gap-3 border-b border-slate-200 bg-white p-4 sm:grid-cols-4 sm:p-6">
        <form className="contents" onSubmit={submitFilters}>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search code, name, category..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
            <select
              value={categoryFilter}
              onChange={(event) =>
                updateQueryParams({
                  category: event.target.value || null,
                  page: '1',
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Sack Color</label>
            <select
              value={sackColorFilter}
              onChange={(event) =>
                updateQueryParams({
                  sackColor: event.target.value || null,
                  page: '1',
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
            >
              <option value="">All Colors</option>
              {sackColorOptions.map((sackColor) => (
                <option key={sackColor} value={sackColor}>
                  {sackColor}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply Search
            </button>
          </div>
        </form>
      </div>

      {error ? (
        <p className="m-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="m-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-sido-green text-white">
              <th className="w-12 px-3 py-2 text-left text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectPage}
                  className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white/60"
                  aria-label="Select all products on current page"
                />
              </th>
              <th className="w-14 px-3 py-2 text-left text-xs font-semibold">No</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Code</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Category</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Sack Color</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Nutritions</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Created</th>
              <th className="w-28 px-3 py-2 text-center text-xs font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-t border-slate-200 bg-white">
                <td className="px-3 py-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleRow(product.id)}
                    className="h-4 w-4 rounded border-slate-300 text-sido-green focus:ring-sido-gold/70"
                    aria-label={`Select ${product.name}`}
                  />
                </td>
                <td className="px-3 py-2 text-sm text-slate-600">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-sido-green">{product.code}</td>
                <td className="px-3 py-2 text-sm text-slate-900">{product.name}</td>
                <td className="px-3 py-2 text-sm text-slate-700">{product.category.name}</td>
                <td className="px-3 py-2 text-sm text-slate-700">{product.sackColor}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{product._count.nutritions}</td>
                <td className="px-3 py-2 text-sm text-slate-600">
                  {new Date(product.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-600" colSpan={9}>
                  No products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-600">
          Showing{' '}
          <span className="font-semibold text-slate-900">{products.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{filteredCount}</span> filtered
          products ({totalCount} total)
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Rows:</label>
          <select
            value={pageSize}
            onChange={(event) =>
              updateQueryParams({
                pageSize: event.target.value,
                page: '1',
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <button
            type="button"
            onClick={() =>
              updateQueryParams({
                page: String(Math.max(1, currentPage - 1)),
              })
            }
            disabled={currentPage <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-sm font-semibold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              updateQueryParams({
                page: String(Math.min(totalPages, currentPage + 1)),
              })
            }
            disabled={currentPage >= totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
