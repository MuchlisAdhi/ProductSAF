# Sidoagung Farm Product Catalog (Vite + React + Tailwind)

Mobile-first landing page + katalog produk:

- View 1: **Kategori** (grid)
- View 2: **Daftar Produk** (filter by kategori + **search**)
- View 3: **Detail Produk** (info lengkap + **tabel nutrisi**)

## Tech
- Vite + React 18
- Tailwind CSS
- Lucide React (icons)

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Data
Data ada di: `src/data/catalog.js` (sesuai JSON yang Anda berikan).

## Notes
- Field `nutrition` diubah otomatis menjadi tabel (lihat `parseNutrition()` di `src/lib/catalogUtils.js`).
- Field `image` mendukung format markdown-link: `[text](url)`.
