import { z } from 'zod'

export const sizeSchema = z.enum(['S', 'M', 'L', 'XL'])

export const productColorSchema = z.object({
  key: z.string().min(1, 'color needs a key'),
  name: z.string().min(1, 'color needs a name'),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'invalid hex (expected #rrggbb)'),
  photos: z.array(z.string().min(1)).min(1, 'each color needs at least one photo'),
})

export const productVariantSchema = z.object({
  id: z.string().min(1, 'variant needs an id'),
  size: sizeSchema,
  color: z.string().min(1, 'variant needs to reference a color'),
  available: z.boolean().default(true),
})

export const productSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'invalid slug (lowercase and hyphens)'),
    name: z.string().min(1, 'product needs a name'),
    description: z.string().min(1, 'product needs a description'),
    price: z.number().int().positive('price must be a positive integer (ARS)'),
    colors: z.array(productColorSchema).min(1, 'each product needs at least one color'),
    variants: z.array(productVariantSchema).min(1, 'each product needs at least one variant'),
  })
  .superRefine((product, ctx) => {
    const colorKeys = new Set(product.colors.map((c) => c.key))
    if (colorKeys.size !== product.colors.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'color keys must be unique within the product',
        path: ['colors'],
      })
    }

    product.variants.forEach((variant, i) => {
      if (!colorKeys.has(variant.color)) {
        ctx.addIssue({
          code: 'custom',
          message: `variant references an unknown color: ${variant.color}`,
          path: ['variants', i, 'color'],
        })
      }
    })

    const ids = new Set(product.variants.map((v) => v.id))
    if (ids.size !== product.variants.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'variant ids must be unique within the product',
        path: ['variants'],
      })
    }
  })

export const catalogSchema = z.array(productSchema).min(1, 'catalog cannot be empty')

export const siteConfigSchema = z.object({
  whatsAppPhone: z.string().regex(/^\+?\d{8,15}$/, 'invalid WhatsApp phone (digits only)'),
  storeName: z.string().min(1, 'store needs a name'),
  defaultSize: sizeSchema,
  featuredOnHome: z.number().int().nonnegative(),
  currency: z.literal('ARS'),
})

export type Size = z.infer<typeof sizeSchema>
export type ProductColor = z.infer<typeof productColorSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>
export type Product = z.infer<typeof productSchema>
export type Catalog = z.infer<typeof catalogSchema>
export type SiteConfig = z.infer<typeof siteConfigSchema>
