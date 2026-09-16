import type { Catalog, Product, SiteConfig } from './schemas'

export const baseProduct: Product = {
  slug: 'remera-monocromo',
  name: 'Remera Monocromo',
  description: 'Una remera de prueba para los tests del dominio.',
  price: 12000,
  colors: [
    { key: 'negro', name: 'Negro', hex: '#171717', photos: ['/img/rmc-negro-1.svg'] },
    { key: 'blanco', name: 'Blanco', hex: '#fafafa', photos: ['/img/rmc-blanco-1.svg'] },
  ],
  variants: [
    { id: 'rmc-negro-m', size: 'M', color: 'negro', available: true },
    { id: 'rmc-negro-l', size: 'L', color: 'negro', available: true },
    { id: 'rmc-blanco-m', size: 'M', color: 'blanco', available: false },
  ],
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return { ...baseProduct, ...overrides }
}

export const catalogFixture: Catalog = [makeProduct()]

export const configFixture: SiteConfig = {
  whatsAppPhone: '5493884372397',
  storeName: 'Podio Club',
  defaultSize: 'M',
  featuredOnHome: 6,
  currency: 'ARS',
}
