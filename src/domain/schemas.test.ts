import { describe, expect, it } from 'vitest'
import { catalogSchema, productSchema, productVariantSchema, siteConfigSchema } from './schemas'
import { configFixture, makeProduct } from './fixtures'

describe('productSchema', () => {
  it('accepts a valid product', () => {
    expect(productSchema.safeParse(makeProduct()).success).toBe(true)
  })

  it('applies available: true by default', () => {
    const product = productSchema.parse(makeProduct())
    expect(product.variants[0].available).toBe(true)
  })

  it('rejects an invalid hex', () => {
    const product = makeProduct({
      colors: [{ key: 'x', name: 'X', hex: 'negro', photos: ['a'] }],
    })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects a color without photos', () => {
    const product = makeProduct({
      colors: [{ key: 'x', name: 'X', hex: '#111111', photos: [] }],
    })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects duplicate color keys', () => {
    const product = makeProduct({
      colors: [
        { key: 'a', name: 'A', hex: '#111111', photos: ['f'] },
        { key: 'a', name: 'B', hex: '#222222', photos: ['f'] },
      ],
    })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects a variant referencing an unknown color', () => {
    const product = makeProduct({
      variants: [{ id: 'v1', size: 'M', color: 'unknown', available: true }],
    })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects duplicate variant ids', () => {
    const product = makeProduct({
      variants: [
        { id: 'dup', size: 'M', color: 'negro', available: true },
        { id: 'dup', size: 'L', color: 'negro', available: true },
      ],
    })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects an invalid slug', () => {
    const product = makeProduct({ slug: 'Remera Mono' })
    expect(productSchema.safeParse(product).success).toBe(false)
  })

  it('rejects a non-integer price', () => {
    const product = makeProduct({ price: 12000.5 })
    expect(productSchema.safeParse(product).success).toBe(false)
  })
})

describe('productVariantSchema', () => {
  it('rejects a size outside the enumeration', () => {
    expect(productVariantSchema.safeParse({ id: 'v', size: 'XXL', color: 'negro' }).success).toBe(
      false,
    )
  })
})

describe('catalogSchema', () => {
  it('rejects an empty catalog', () => {
    expect(catalogSchema.safeParse([]).success).toBe(false)
  })
})

describe('siteConfigSchema', () => {
  it('accepts a valid config', () => {
    expect(siteConfigSchema.safeParse(configFixture).success).toBe(true)
  })

  it('rejects phones with non-digit characters', () => {
    const config = { ...configFixture, whatsAppPhone: '5493-884-372397' }
    expect(siteConfigSchema.safeParse(config).success).toBe(false)
  })

  it('only accepts ARS as currency', () => {
    const config = { ...configFixture, currency: 'USD' }
    expect(siteConfigSchema.safeParse(config).success).toBe(false)
  })
})
