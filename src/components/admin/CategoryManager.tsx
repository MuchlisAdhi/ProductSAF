'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { getLucideIcon, lucideIconOptions } from '../../lib/lucideIcons'
import { CategorySchema } from '../../lib/validators'

type CategoryFormValues = z.infer<typeof CategorySchema>

type CategoryItem = {
  id: string
  name: string
  icon: string
  orderNumber: number
  _count: {
    products: number
  }
}

type CategoryManagerProps = {
  initialCategories: CategoryItem[]
  query: string
  iconFilter: string
  iconOptions: string[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  filteredCount: number
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60'

export default function CategoryManager({
  initialCategories,
  query,
  iconFilter,
  iconOptions,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  filteredCount,
}: CategoryManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState(initialCategories)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [iconSearch, setIconSearch] = useState('')
  const [searchInput, setSearchInput] = useState(query)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      icon: 'Box',
      orderNumber: 0,
    },
  })

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const selectedIcon = watch('icon')
  const SelectedIcon = getLucideIcon(selectedIcon)

  const filteredIcons = useMemo(() => {
    const q = iconSearch.trim().toLowerCase()
    if (!q) return lucideIconOptions
    return lucideIconOptions.filter((iconName: string) =>
      iconName.toLowerCase().includes(q)
    )
  }, [iconSearch])

  const updateQueryParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value.trim() === '') {
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
      page: '1',
    })
  }

  const onSubmit = async (values: CategoryFormValues) => {
    setError(null)
    setSuccess(null)

    const isEdit = editingCategoryId !== null
    const endpoint = isEdit ? `/api/categories/${editingCategoryId}` : '/api/categories'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    const payload = await response.json()

    if (!response.ok) {
      setError(payload.error || 'Failed to save category')
      return
    }

    if (isEdit) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategoryId
            ? {
                ...item,
                name: payload.data.name,
                icon: payload.data.icon,
                orderNumber: payload.data.orderNumber,
              }
            : item
        )
      )
      setSuccess('Category updated.')
    } else {
      setSuccess('Category created.')
      router.refresh()
    }

    setEditingCategoryId(null)
    reset({
      name: '',
      icon: 'Box',
      orderNumber: 0,
    })
  }

  const startEdit = (category: CategoryItem) => {
    setEditingCategoryId(category.id)
    setValue('name', category.name, { shouldValidate: true })
    setValue('icon', category.icon, { shouldValidate: true })
    setValue('orderNumber', category.orderNumber, { shouldValidate: true })
    setError(null)
    setSuccess(null)
  }

  const cancelEdit = () => {
    setEditingCategoryId(null)
    reset({
      name: '',
      icon: 'Box',
      orderNumber: 0,
    })
    setError(null)
  }

  const removeCategory = async (id: string) => {
    setError(null)
    setSuccess(null)

    const shouldDelete = window.confirm('Delete this category?')
    if (!shouldDelete) return

    setIsDeletingId(id)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Failed to delete category')
        return
      }

      const nextRows = categories.filter((item) => item.id !== id)
      setCategories(nextRows)
      setSuccess('Category deleted.')
      if (nextRows.length === 0 && currentPage > 1) {
        updateQueryParams({ page: String(currentPage - 1) })
      } else {
        router.refresh()
      }
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">
          {editingCategoryId ? 'Edit Category' : 'Create Category'}
        </h2>
        <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Name</label>
            <input
              {...register('name')}
              className={inputClass}
              placeholder="Pakan Komplit Broiler"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Icon</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <SelectedIcon className="h-4 w-4 text-sido-green" />
                {selectedIcon}
              </button>
              <input {...register('icon')} className={inputClass} readOnly />
            </div>
            {errors.icon ? (
              <p className="mt-1 text-xs text-red-600">{errors.icon.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Order Number
            </label>
            <input
              type="number"
              min={0}
              step={1}
              {...register('orderNumber')}
              className={inputClass}
              placeholder="0"
            />
            {errors.orderNumber ? (
              <p className="mt-1 text-xs text-red-600">{errors.orderNumber.message}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-sido-green px-4 py-2 text-sm font-semibold text-white hover:bg-sido-green/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : editingCategoryId
                ? 'Update Category'
                : 'Create Category'}
            </button>

            {editingCategoryId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {error ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-slate-50/60 px-4 py-3 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">Category List</h2>
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
                  placeholder="Search category name or icon..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Icon</label>
              <select
                value={iconFilter}
                onChange={(event) =>
                  updateQueryParams({
                    icon: event.target.value || null,
                    page: '1',
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
              >
                <option value="">All Icons</option>
                {iconOptions.map((iconName: string) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Apply Search
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-sido-green text-white">
                <th className="w-16 px-3 py-2 text-left text-xs font-semibold">No</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Name</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Order</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Icon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Products</th>
                <th className="w-28 px-3 py-2 text-center text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => {
                const Icon = getLucideIcon(category.icon)
                return (
                  <tr key={category.id} className="border-t border-slate-200 bg-white">
                    <td className="px-3 py-2 text-sm text-slate-600">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-slate-900">
                      {category.name}
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">
                      {category.orderNumber}
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1">
                        <Icon className="h-4 w-4 text-sido-green" />
                        {category.icon}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-600">
                      {category._count.products}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(category.id)}
                          disabled={isDeletingId === category.id}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {categories.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-600" colSpan={6}>
                    No categories found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{categories.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{filteredCount}</span> filtered
            categories ({totalCount} total)
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Select Category Icon</h3>
                <p className="text-xs text-slate-600">Choose a Lucide icon name.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                aria-label="Close icon picker"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="p-4 sm:p-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={iconSearch}
                  onChange={(event) => setIconSearch(event.target.value)}
                  placeholder="Search icon name..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
                />
              </div>

              <div className="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-auto sm:grid-cols-3 md:grid-cols-4">
                {filteredIcons.map((iconName: string) => {
                  const Icon = getLucideIcon(iconName)
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setValue('icon', iconName, { shouldValidate: true })
                        setIsModalOpen(false)
                      }}
                      className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                        selectedIcon === iconName
                          ? 'border-sido-green bg-sido-green/10 text-sido-green'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{iconName}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
