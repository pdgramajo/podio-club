import type { Catalog, Product, ProductColor, ProductVariant, Size } from './schemas'

export const SIZES: readonly Size[] = ['S', 'M', 'L', 'XL']

export interface ResolvedVariant {
  product: Product
  color: ProductColor
  variant: ProductVariant
}

export function primaryColor(product: Product): ProductColor {
  return product.colors[0]
}

export function colorByKey(product: Product, key: string): ProductColor | undefined {
  return product.colors.find((c) => c.key === key)
}

export function productBySlug(catalog: Catalog, slug: string): Product | undefined {
  return catalog.find((p) => p.slug === slug)
}

export function isVariantAvailable(variant: ProductVariant): boolean {
  return variant.available
}

export function resolveVariant(catalog: Catalog, variantId: string): ResolvedVariant | undefined {
  for (const product of catalog) {
    const variant = product.variants.find((v) => v.id === variantId)
    if (!variant) continue
    const color = colorByKey(product, variant.color)
    if (!color) return undefined
    return { product, color, variant }
  }
  return undefined
}

export function defaultVariant(product: Product, defaultSize: Size): ResolvedVariant | undefined {
  const color = primaryColor(product)
  const variant = product.variants.find((v) => v.color === color.key && v.size === defaultSize)
  if (!variant) return undefined
  return { product, color, variant }
}
