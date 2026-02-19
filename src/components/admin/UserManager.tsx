'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Role } from '@prisma/client'
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { UserUpdateSchema } from '../../lib/validators'

type UserFormValues = z.infer<typeof UserUpdateSchema>

type UserItem = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string | Date
  updatedAt: string | Date
}

type UserManagerProps = {
  initialUsers: UserItem[]
  currentUserId: string
  query: string
  roleFilter: string
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  filteredCount: number
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60'

export default function UserManager({
  initialUsers,
  currentUserId,
  query,
  roleFilter,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  filteredCount,
}: UserManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState(initialUsers)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(query)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'USER',
      password: '',
    },
  })

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  useEffect(() => {
    setSearchInput(query)
  }, [query])

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

  const onSubmit = async (values: UserFormValues) => {
    setError(null)
    setSuccess(null)

    const isEdit = editingUserId !== null
    if (!isEdit && (!values.password || values.password.length < 8)) {
      setError('Password must be at least 8 characters')
      return
    }

    const endpoint = isEdit ? `/api/users/${editingUserId}` : '/api/users'
    const method = isEdit ? 'PUT' : 'POST'
    const payload = isEdit
      ? values
      : {
          ...values,
          password: values.password || '',
        }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Failed to save user')
      return
    }

    if (isEdit) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUserId ? data.data : user))
      )
      setSuccess('User updated.')
    } else {
      setSuccess('User created.')
      router.refresh()
    }

    setEditingUserId(null)
    reset({
      name: '',
      email: '',
      role: 'USER',
      password: '',
    })
  }

  const startEdit = (user: UserItem) => {
    setEditingUserId(user.id)
    setError(null)
    setSuccess(null)
    setValue('name', user.name, { shouldValidate: true })
    setValue('email', user.email, { shouldValidate: true })
    setValue('role', user.role, { shouldValidate: true })
    setValue('password', '')
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setError(null)
    reset({
      name: '',
      email: '',
      role: 'USER',
      password: '',
    })
  }

  const removeUser = async (id: string) => {
    setError(null)
    setSuccess(null)

    const shouldDelete = window.confirm('Delete this user?')
    if (!shouldDelete) return

    setIsDeletingId(id)
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Failed to delete user')
        return
      }

      const nextRows = users.filter((user) => user.id !== id)
      setUsers(nextRows)
      setSuccess('User deleted.')
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
          {editingUserId ? 'Edit User' : 'Create User'}
        </h2>
        <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Name</label>
            <input {...register('name')} className={inputClass} placeholder="Admin Name" />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Email</label>
            <input
              {...register('email')}
              className={inputClass}
              placeholder="name@sidoagung.com"
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Role</label>
            <select {...register('role')} className={inputClass}>
              <option value="SUPERADMIN">SUPERADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
            {errors.role ? (
              <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              {editingUserId ? 'New Password (Optional)' : 'Password'}
            </label>
            <input
              type="password"
              {...register('password')}
              className={inputClass}
              placeholder="Minimum 8 characters"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-sido-green px-4 py-2 text-sm font-semibold text-white hover:bg-sido-green/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : editingUserId ? 'Update User' : 'Create User'}
            </button>
            {editingUserId ? (
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
          <h2 className="text-base font-semibold text-slate-900">User List</h2>
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
                  placeholder="Search name or email..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Role</label>
              <select
                value={roleFilter}
                onChange={(event) =>
                  updateQueryParams({
                    role: event.target.value || null,
                    page: '1',
                  })
                }
                className={inputClass}
              >
                <option value="">All Roles</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
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
                <th className="w-14 px-3 py-2 text-left text-xs font-semibold">No</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Name</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Email</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Role</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Created</th>
                <th className="w-28 px-3 py-2 text-center text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-t border-slate-200 bg-white">
                  <td className="px-3 py-2 text-sm text-slate-600">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-slate-900">
                    {user.name}
                    {user.id === currentUserId ? (
                      <span className="ml-2 rounded-full bg-sido-gold/20 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        You
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700">{user.email}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{user.role}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Edit ${user.email}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        disabled={isDeletingId === user.id || user.id === currentUserId}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${user.email}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-600" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{users.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{filteredCount}</span> filtered users (
            {totalCount} total)
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
    </div>
  )
}
