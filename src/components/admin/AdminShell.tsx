import Link from 'next/link'
import LogoutButton from './LogoutButton'

type AdminShellProps = {
  title: string
  description: string
  roleLabel?: string
  children: React.ReactNode
}

export default function AdminShell({
  title,
  description,
  roleLabel,
  children,
}: AdminShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {roleLabel ? (
              <span className="rounded-full bg-sido-gold/20 px-3 py-1 text-xs font-semibold text-slate-700">
                {roleLabel}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </div>

        <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Categories
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Users
          </Link>
        </nav>
      </section>

      {children}
    </main>
  )
}
