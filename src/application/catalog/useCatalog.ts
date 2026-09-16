import { useMemo } from 'react'
import { loadCatalog, loadSiteConfig } from '../../data/repository'
import type { Catalog, Product, SiteConfig } from '../../domain/schemas'

export interface CatalogSelection {
  products: Catalog
  featured: Catalog
  product: (slug: string) => Product | undefined
  config: SiteConfig
}

/**
 * Facade for the UI over the static catalog: memoized reads from the
 * repository plus ready-to-use lookups (by slug and home featured editions).
 */
export function useCatalog(): CatalogSelection {
  const products = useMemo(() => loadCatalog(), [])
  const config = useMemo(() => loadSiteConfig(), [])
  const bySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  )
  const featured = useMemo(
    () => products.slice(0, config.featuredOnHome),
    [products, config.featuredOnHome],
  )
  const product = useMemo(() => (slug: string) => bySlug.get(slug), [bySlug])

  return { products, featured, product, config }
}
