import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/serverAuth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const auth = await requireRole(['SUPERADMIN', 'ADMIN'])
  const [users, categories, products] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count(),
  ])

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Manage users, categories, and products."
      roleLabel={auth.role}
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Users</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{users}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Categories</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{categories}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Products</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{products}</p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-sido-green px-3 py-2 text-sm font-semibold text-white hover:bg-sido-green/90"
          >
            Create Product
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Manage Users
          </Link>
        </div>
      </section>
    </AdminShell>
  )
}
