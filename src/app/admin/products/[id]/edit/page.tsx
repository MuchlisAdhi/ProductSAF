import { notFound } from 'next/navigation'
import AdminShell from '../../../../../components/admin/AdminShell'
import ProductForm from '../../../../../components/admin/ProductForm'
import prisma from '../../../../../lib/prisma'
import { requireRole } from '../../../../../lib/serverAuth'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const auth = await requireRole(['SUPERADMIN', 'ADMIN'])

  const [categories, product] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: [{ orderNumber: 'asc' }, { name: 'asc' }],
    }),
    prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        image: true,
        nutritions: true,
      },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <AdminShell
      title="Edit Product"
      description="Update product details, nutritions, and image."
      roleLabel={auth.role}
    >
      {categories.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No categories found. Create categories first.
        </div>
      ) : (
        <ProductForm
          mode="edit"
          productId={product.id}
          categories={categories}
          redirectTo="/admin/products"
          initialValues={{
            code: product.code,
            name: product.name,
            description: product.description,
            sackColor: product.sackColor,
            categoryId: product.categoryId,
            imageId: product.imageId,
            imagePath: product.image?.systemPath || null,
            nutritions: product.nutritions.map((nutrition: { label: string; value: string }) => ({
              label: nutrition.label,
              value: nutrition.value,
            })),
          }}
        />
      )}
    </AdminShell>
  )
}
