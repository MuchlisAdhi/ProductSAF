import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sidoagung Farm Product Catalog',
  description: 'Catalog and admin dashboard for Sidoagung Farm products.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <header className="sticky top-0 z-40 border-b border-white/20 bg-farm-green-dark text-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3" aria-label="Sidoagung Farm Home">
              <img
                src="/images/logo/Logo Sidoagung (Merah).png"
                alt="Logo Sidoagung"
                className="h-20 w-14 object-contain"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">Sidoagung Farm</div>
                <div className="text-xs text-white/80">Product Catalog</div>
              </div>
            </Link>

            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 font-medium text-white hover:bg-white/15"
              >
                Beranda
              </Link>
              <Link
                href="/products"
                className="rounded-lg px-3 py-2 font-medium text-white hover:bg-white/15"
              >
                Produk
              </Link>
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2 font-medium text-white hover:bg-white/15"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-white/20 bg-farm-green-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-white sm:px-6">
            (c) {new Date().getFullYear()} Sidoagung Farm - Product Catalog
          </div>
        </footer>
      </body>
    </html>
  )
}
