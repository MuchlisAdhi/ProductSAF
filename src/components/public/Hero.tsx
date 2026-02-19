import { Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sido-green/12 via-white to-white" />
      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-6 sm:px-6 sm:pt-10">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-soft backdrop-blur sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sido-gold/20 px-3 py-1 text-xs font-semibold text-slate-800">
            <Sparkles className="h-4 w-4 text-sido-green" />
            Katalog Resmi
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Katalog Produk Pakan Ternak Berkualitas
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Pilih kategori, cari produk, lalu lihat detail nutrisi.
          </p>
        </div>
      </div>
    </section>
  )
}
