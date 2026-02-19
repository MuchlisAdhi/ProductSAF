# Sidoagung Farm Product Catalog

Next.js App Router full-stack catalog and admin dashboard for Sidoagung Farm.
Katalog dan dashboard admin full-stack berbasis Next.js App Router untuk Sidoagung Farm.

## Project Overview / Ringkasan Proyek
- Public catalog views (hero, categories, product list, product detail) with database data.
- Admin dashboard with JWT auth, CRUD for users/categories/products, icon picker, image upload, and nutrition dynamic form.
- Server-side filtering/pagination on admin list pages.

## Tech Stack / Teknologi
- Next.js 14+ (App Router)
- React 18
- Tailwind CSS
- Prisma ORM
- MySQL / MariaDB
- JWT (`jose`) with HttpOnly cookie
- Zod validation
- React Hook Form + `useFieldArray`
- Sharp (image compression)
- Playwright (E2E test)

## Prerequisites / Prasyarat
- Node.js 18+ (recommended Node.js 20+)
- MySQL or MariaDB server running
- `npm`

## Environment Variables / Variabel Lingkungan
Create `.env` in project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
JWT_SECRET="your-long-random-secret"
PRISMA_USE_MARIADB_ADAPTER=true
```

Important / Penting:
- For Prisma datasource `provider = "mysql"`, `DATABASE_URL` must start with `mysql://` even if using MariaDB.

## Install & Run / Instalasi & Menjalankan
```bash
npm install
npm run dev
```

App URL: `http://127.0.0.1:3000`

## Prisma Workflow / Alur Prisma
1. Generate Prisma Client
```bash
npm run prisma:generate
```

2. Run migration
```bash
npm run prisma:migrate
```

3. Seed default data (SUPERADMIN)
```bash
npm run prisma:seed
```

Default admin / akun admin default:
- Email: `admin@sidoagung.com`
- Password: `password123`

## Migration Fallback (Non-interactive) / Fallback Migrasi (Non-interaktif)
If `prisma migrate dev` hangs in your terminal, use:

PowerShell:
```powershell
$env:CI='1'; npx prisma migrate dev --skip-generate --skip-seed
```

## Build & Start Production / Build & Jalankan Produksi
```bash
npm run build
npm run start
```

## Run Automation Test / Menjalankan Tes Otomasi
Install Playwright browsers once:
```bash
npx playwright install
```

Run tests:
```bash
npm run test:e2e
```

## Main Routes / Rute Utama
Public:
- `/` (home + category grid)
- `/categories/[id]` (product list by category)
- `/products/[id]` (product detail)

Auth:
- `/login`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/signup`

Admin:
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/users` (SUPERADMIN only)

## Troubleshooting / Pemecahan Masalah
1. Prisma error `URL must start with protocol mysql://`
- Fix `.env` `DATABASE_URL` prefix to `mysql://`.

2. Migration appears stuck
- Use CI mode command in the fallback section above.

3. Cannot access `/admin`
- Ensure login succeeded and `saf_access_token` cookie exists.
- Ensure `JWT_SECRET` is set and stable.

4. Image upload fails
- Check `sharp` installed successfully.
- Ensure app has write access to `public/uploads`.
