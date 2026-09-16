import { describe, expect, it } from 'vitest'
import { colorByKey, defaultVariant, primaryColor, productBySlug, resolveVariant } from './catalog'
import { catalogFixture, makeProduct } from './fixtures'

describe('primaryColor', () => {
  it('returns the first declared color (default color)', () => {
    expect(primaryColor(makeProduct()).key).toBe('negro')
  })
})

describe('colorByKey', () => {
  it('finds a color by its key', () => {
    const product = makeProduct()
    expect(colorByKey(product, 'blanco')?.name).toBe('Blanco')
  })

  it('returns undefined for an unknown key', () => {
    expect(colorByKey(makeProduct(), 'rojo')).toBeUndefined()
  })
})

describe('productBySlug', () => {
  it('finds a product by slug', () => {
    expect(productBySlug(catalogFixture, 'remera-monocromo')?.name).toBe('Remera Monocromo')
  })

  it('returns undefined for an unknown slug', () => {
    expect(productBySlug(catalogFixture, 'no-existe')).toBeUndefined()
  })
})

describe('resolveVariant', () => {
  it('resolves a variant to its product, color and variant', () => {
    const resolved = resolveVariant(catalogFixture, 'rmc-negro-m')
    expect(resolved?.product.slug).toBe('remera-monocromo')
    expect(resolved?.color.key).toBe('negro')
    expect(resolved?.variant.size).toBe('M')
  })

  it('returns undefined for an unknown id', () => {
    expect(resolveVariant(catalogFixture, 'ghost')).toBeUndefined()
  })
})

describe('defaultVariant', () => {
  it('uses the primary color and the default size', () => {
    const product = makeProduct()
    const resolved = defaultVariant(product, 'M')
    expect(resolved?.variant.id).toBe('rmc-negro-m')
    expect(resolved?.color.key).toBe('negro')
  })

  it('returns undefined when the combination does not exist', () => {
    const product = makeProduct()
    expect(defaultVariant(product, 'XL')).toBeUndefined()
  })
})
