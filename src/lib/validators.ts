import { z } from 'zod'

const RoleSchema = z.enum(['SUPERADMIN', 'ADMIN', 'USER'])

export const LoginSchema = z.object({
  email: z.string().trim().email('Email is invalid'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const SignupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Email is invalid'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const CategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required'),
  icon: z.string().trim().min(1, 'Icon name is required'),
  orderNumber: z.coerce
    .number()
    .int('Order number must be a whole number')
    .min(0, 'Order number must be 0 or greater')
    .default(0),
})

export const CategoryUpdateSchema = CategorySchema

export const NutritionInputSchema = z.object({
  label: z.string().trim().min(1, 'Nutrition label is required'),
  value: z.string().trim().min(1, 'Nutrition value is required'),
})

export const ProductSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(2, 'Name is required'),
  description: z.string().trim().min(4, 'Description is required'),
  sackColor: z.string().trim().min(2, 'Sack color is required'),
  categoryId: z.string().cuid('Category is required'),
  imageId: z.string().cuid().nullable().optional(),
  nutritions: z
    .array(NutritionInputSchema)
    .min(1, 'At least one nutrition item is required'),
})

export const ProductUpdateSchema = ProductSchema
export const ProductBulkDeleteSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'Select at least one product'),
})

export const UserCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Email is invalid'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: RoleSchema.default('USER'),
})

export const UserUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Email is invalid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  role: RoleSchema,
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
export type CategoryInput = z.infer<typeof CategorySchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type ProductBulkDeleteInput = z.infer<typeof ProductBulkDeleteSchema>
export type UserCreateInput = z.infer<typeof UserCreateSchema>
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>
