export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Your `image` field is a markdown-link string like: [label](url)
// This extracts the URL and also works if later replaced with a raw URL.
export function extractImageUrl(value) {
  if (!value) return ''
  const str = String(value)
  const match = str.match(/\]\((.*?)\)/)
  return match?.[1] || str
}

// Convert the `nutrition` string to rows for a table.
// Examples:
// - "Protein: Min 21%, Lemak: Min 5%"
// - "Grade A - Bebas Pullorum" (no colon)
export function parseNutrition(nutrition) {
  const raw = String(nutrition || '').trim()
  if (!raw) return []

  // Split on commas, but keep it simple for this dataset
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const rows = []
  for (const part of parts) {
    const idx = part.indexOf(':')
    if (idx !== -1) {
      const label = part.slice(0, idx).trim()
      const value = part.slice(idx + 1).trim()
      rows.push({ label: label || 'Parameter', value: value || '-' })
    } else if (part.includes(' - ')) {
      const [label, value] = part.split(' - ')
      rows.push({ label: (label || 'Keterangan').trim(), value: (value || '-').trim() })
    } else {
      rows.push({ label: 'Keterangan', value: part })
    }
  }
  return rows
}
