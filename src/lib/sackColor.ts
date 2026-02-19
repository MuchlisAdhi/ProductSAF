export const SACK_COLOR_OPTIONS = [
  { value: 'Merah', label: 'Merah' },
  { value: 'Biru', label: 'Biru' },
  { value: 'Hijau', label: 'Hijau' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Pink', label: 'Pink' },
] as const

export const SACK_COLOR_VALUES = SACK_COLOR_OPTIONS.map((item) => item.value)

function normalizeSackColor(color: string) {
  return color.trim().toLowerCase()
}

export function getSackColorBadgeClass(color: string) {
  const normalized = normalizeSackColor(color)

  if (normalized === 'merah' || normalized === 'red') {
    return 'bg-red-100 text-red-700 ring-red-200'
  }
  if (normalized === 'biru' || normalized === 'blue') {
    return 'bg-blue-100 text-blue-700 ring-blue-200'
  }
  if (normalized === 'hijau' || normalized === 'green') {
    return 'bg-emerald-100 text-emerald-700 ring-emerald-200'
  }
  if (normalized === 'orange' || normalized === 'oranye') {
    return 'bg-orange-100 text-orange-700 ring-orange-200'
  }
  if (normalized === 'pink') {
    return 'bg-pink-100 text-pink-700 ring-pink-200'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}
