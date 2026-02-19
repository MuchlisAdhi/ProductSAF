'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { SACK_COLOR_OPTIONS } from '@/lib/sackColor'
import { ProductSchema } from '@/lib/validators'

type ProductFormValues = z.infer<typeof ProductSchema>

type ProductFormProps = {
  categories: Array<{ id: string; name: string }>
  mode?: 'create' | 'edit'
  productId?: string
  initialValues?: {
    code: string
    name: string
    description: string
    sackColor: string
    categoryId: string
    imageId: string | null
    imagePath?: string | null
    nutritions: Array<{ label: string; value: string }>
  }
  redirectTo?: string
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sido-green/40 focus:outline-none focus:ring-2 focus:ring-sido-gold/60'

export default function ProductForm({
  categories,
  mode = 'create',
  productId,
  initialValues,
  redirectTo,
}: ProductFormProps) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValues?.imagePath || null
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const sackColorOptions = useMemo(() => {
    const current = initialValues?.sackColor?.trim()
    if (!current) return SACK_COLOR_OPTIONS
    if (SACK_COLOR_OPTIONS.some((item) => item.value === current)) {
      return SACK_COLOR_OPTIONS
    }
    return [{ value: current, label: `${current} (Legacy)` }, ...SACK_COLOR_OPTIONS]
  }, [initialValues?.sackColor])

  const emptyValues: ProductFormValues = {
    code: '',
    name: '',
    description: '',
    sackColor: '',
    categoryId: categories[0]?.id ?? '',
    imageId: null,
    nutritions: [{ label: '', value: '' }],
  }

  const resolvedInitialValues: ProductFormValues = initialValues
    ? {
        code: initialValues.code,
        name: initialValues.name,
        description: initialValues.description,
        sackColor: initialValues.sackColor,
        categoryId: initialValues.categoryId,
        imageId: initialValues.imageId,
        nutritions:
          initialValues.nutritions.length > 0
            ? initialValues.nutritions
            : [{ label: '', value: '' }],
      }
    : emptyValues

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: resolvedInitialValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nutritions',
  })

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null)

    const endpoint =
      mode === 'edit' && productId ? `/api/products/${productId}` : '/api/products'
    const response = await fetch(endpoint, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const payload = await response.json()
    if (!response.ok) {
      setSubmitError(payload.error || 'Failed to save product')
      return
    }

    const nextBase = redirectTo || '/admin/products'
    const status = mode === 'edit' ? 'updated' : 'created'
    const separator = nextBase.includes('?') ? '&' : '?'
    const nextUrl = `${nextBase}${separator}status=${status}`
    router.push(nextUrl)
    router.refresh()
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSubmitError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/assets/upload', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Image upload failed')
      }

      setValue('imageId', payload.asset.id, { shouldValidate: true })
      setPreviewUrl(payload.asset.systemPath)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Image upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('imageId', null, { shouldValidate: true, shouldDirty: true })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-slate-50/60 px-4 py-3 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Product Configuration
          </h2>
          <p className="text-xs text-slate-600">
            Fill product identity, category, and image.
          </p>
        </header>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Code
            </label>
            <input {...register('code')} className={inputClass} placeholder="SA 571 NS" />
            {errors.code ? (
              <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Name
            </label>
            <input
              {...register('name')}
              className={inputClass}
              placeholder="Pakan Starter Broiler"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={inputClass}
              placeholder="Product description"
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Sack Color
            </label>
            <select {...register('sackColor')} className={inputClass}>
              <option value="">Select sack color</option>
              {sackColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.sackColor ? (
              <p className="mt-1 text-xs text-red-600">{errors.sackColor.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Category
            </label>
            <select {...register('categoryId')} className={inputClass}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Product Image
            </label>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sido-green px-3 py-2 text-sm font-semibold text-white hover:bg-sido-green/90">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  ref={fileInputRef}
                />
              </label>

              {previewUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove image
                </button>
              ) : null}

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <p className="text-xs text-slate-600">No image uploaded yet.</p>
              )}
            </div>
            <input type="hidden" {...register('imageId')} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Nutrition List</h2>
            <p className="text-xs text-slate-600">
              Add one or more nutrition parameters in table format.
            </p>
          </div>
          <button
            type="button"
            onClick={() => append({ label: '', value: '' })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Add Row
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-sido-green text-white">
                <th className="w-16 px-3 py-2 text-left text-xs font-semibold">No</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Parameter</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Value</th>
                <th className="w-24 px-3 py-2 text-center text-xs font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-t border-slate-200 bg-white">
                  <td className="px-3 py-2 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`nutritions.${index}.label`)}
                      placeholder="Protein"
                      className={inputClass}
                    />
                    {errors.nutritions?.[index]?.label ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.nutritions[index]?.label?.message}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`nutritions.${index}.value`)}
                      placeholder="Min 20%"
                      className={inputClass}
                    />
                    {errors.nutritions?.[index]?.value ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.nutritions[index]?.value?.message}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete nutrition row ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {submitError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex items-center gap-2 rounded-xl bg-sido-green px-4 py-2 text-sm font-semibold text-white hover:bg-sido-green/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === 'edit' ? 'Save Product Changes' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
