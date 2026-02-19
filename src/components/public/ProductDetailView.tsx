import Link from 'next/link'
import { ArrowLeft, ClipboardList, Layers, Package, Tag } from 'lucide-react'
import { getLucideIcon } from '@/lib/lucideIcons'
import { getSackColorBadgeClass } from '@/lib/sackColor'

type ProductDetailViewProps = {
  backHref?: string
  backLabel?: string
  category: {
    id: string
    name: string
    icon: string
  }
  product: {
    id: string
    code: string
    name: string
    description: string
    sackColor: string
    image: {
      systemPath: string
    } | null
    nutritions: Array<{
      id: string
      label: string
      value: string
    }>
  }
}

export default function ProductDetailView({
  backHref,
  backLabel = 'Kembali',
  category,
  product,
}: ProductDetailViewProps) {
  const CategoryIcon = getLucideIcon(category.icon)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6">
        <Link
          href={backHref || `/categories/${category.id}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-sido-green focus:outline-none focus:ring-2 focus:ring-sido-gold/70"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-sido-green">{product.code}</div>
            <h2 className="mt-1 truncate text-base font-semibold text-slate-900">
              {product.name}
            </h2>
            <p className="mt-1 text-xs text-slate-600">Detail produk & kandungan nutrisi.</p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${getSackColorBadgeClass(
                product.sackColor
              )}`}
            >
              {product.sackColor}
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sido-gold/20 px-3 py-1 text-xs font-semibold text-slate-800">
            <CategoryIcon className="h-4 w-4 text-sido-green" />
            <span className="max-w-[14rem] truncate">{category.name}</span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6">
            <img
              src={
                product.image?.systemPath ||
                'https://placehold.co/300x450/e2e8f0/334155?text=No+Image'
              }
              alt={`Karung ${product.code}`}
              className="mx-auto h-56 w-auto object-contain drop-shadow-md sm:h-64"
              loading="eager"
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              {category.name}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-slate-600">{product.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <Tag className="mx-auto h-5 w-5 text-sido-green" />
                <p className="mt-1 text-[10px] text-slate-500">Kode</p>
                <p className="text-xs font-bold text-slate-900">{product.code}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <Package className="mx-auto h-5 w-5 text-amber-600" />
                <p className="mt-1 text-[10px] text-slate-500">Warna Karung</p>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getSackColorBadgeClass(
                      product.sackColor
                    )}`}
                  >
                    {product.sackColor}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-sky-50 p-3 text-center">
                <Layers className="mx-auto h-5 w-5 text-sky-600" />
                <p className="mt-1 text-[10px] text-slate-500">Kategori</p>
                <p className="text-xs font-bold text-slate-900">{category.name}</p>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ClipboardList className="h-5 w-5 text-sido-green" />
                Kandungan Nutrisi
              </h3>

              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sido-green text-white">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold">Parameter</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.nutritions.length > 0 ? (
                      product.nutritions.map((nutrition, index) => (
                        <tr
                          key={nutrition.id}
                          className={`border-t border-slate-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/40'
                          }`}
                        >
                          <td className="px-4 py-2.5 text-sm text-slate-600">
                            {nutrition.label}
                          </td>
                          <td className="px-4 py-2.5 text-right text-sm font-semibold text-slate-900">
                            {nutrition.value}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-4 text-sm text-slate-600" colSpan={2}>
                          Tidak ada data nutrisi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
