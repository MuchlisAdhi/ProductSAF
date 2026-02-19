import AdminShell from '../../../../components/admin/AdminShell'
import ProductForm from '../../../../components/admin/ProductForm'
import prisma from '../../../../lib/prisma'
import { requireRole } from '../../../../lib/serverAuth'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const auth = await requireRole(['SUPERADMIN', 'ADMIN'])
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: [{ orderNumber: 'asc' }, { name: 'asc' }],
  })

  return (
    <AdminShell
      title="Create Product"
      description="Admin form with dynamic nutrition rows and image upload."
      roleLabel={auth.role}
    >
      {categories.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No categories found. Create categories first.
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </AdminShell>
  )
}
