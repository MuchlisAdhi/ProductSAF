export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-farm-green-dark text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label="Sidoagung Farm Home">
          <img
            src="/images/logo/Logo Sidoagung (Merah).png"
            alt="Logo Sidoagung"
            className="h-20 w-14 object-contain"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">
              Sidoagung Farm
            </div>
            <div className="text-xs text-white/80">Product Catalog</div>
          </div>
        </a>

        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          <a
            href="#top"
            className="rounded-lg px-3 py-2 font-medium text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            Beranda
          </a>
          <a
            href="#katalog"
            className="rounded-lg px-3 py-2 font-medium text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            Katalog
          </a>
        </nav>
      </div>
    </header>
  )
}
