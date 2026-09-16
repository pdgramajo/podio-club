import { describe, expect, it } from 'vitest'
import { loadCatalog, loadSiteConfig, parseCatalog, parseSiteConfig } from './repository'

describe('loadCatalog', () => {
  it('loads and validates the example catalog', () => {
    const catalog = loadCatalog()
    expect(catalog.length).toBe(10)
  })

  it('loads products with colors and variants', () => {
    const catalog = loadCatalog()
    const first = catalog[0]
    expect(first.slug).toBe('remera-monocromo')
    expect(first.colors.length).toBeGreaterThanOrEqual(2)
    expect(first.variants.length).toBeGreaterThan(0)
  })

  it('includes sold-out variants to exercise the UI states', () => {
    const catalog = loadCatalog()
    const soldOut = catalog
      .flatMap((product) => product.variants)
      .filter((variant) => variant.available === false)
    expect(soldOut.length).toBeGreaterThan(0)
  })

  it('keeps variant ids unique across the whole catalog', () => {
    const catalog = loadCatalog()
    const ids = catalog.flatMap((product) => product.variants.map((variant) => variant.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all photos are valid placehold.co URLs', () => {
    const catalog = loadCatalog()
    const photos = catalog.flatMap((product) => product.colors.flatMap((color) => color.photos))
    expect(photos.length).toBeGreaterThan(0)
    for (const photo of photos) {
      expect(photo).toMatch(/^https:\/\/placehold\.co\/\d+x\d+\/[a-f0-9]+\/[a-f0-9]+\.png/)
    }
  })
})

describe('loadSiteConfig', () => {
  it('loads the site config', () => {
    const config = loadSiteConfig()
    expect(config.storeName).toBe('Podio Club')
    expect(config.whatsAppPhone).toBe('5493884372397')
    expect(config.defaultSize).toBe('M')
    expect(config.currency).toBe('ARS')
  })
})

describe('parseCatalog', () => {
  it('rejects malformed products at the zod boundary', () => {
    const broken = [
      {
        slug: 'x',
        name: 'Remera',
        description: 'd',
        price: 100,
        colors: [{ key: 'a', name: 'A', hex: '#12345', photos: ['f'] }],
        variants: [],
      },
    ]
    expect(() => parseCatalog(broken)).toThrow()
  })
})

describe('parseSiteConfig', () => {
  it('rejects unsupported currencies at the zod boundary', () => {
    const broken = {
      whatsAppPhone: '5493884372397',
      storeName: 'Podio Club',
      defaultSize: 'M',
      featuredOnHome: 6,
      currency: 'USD',
    }
    expect(() => parseSiteConfig(broken)).toThrow()
  })
})
