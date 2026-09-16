import catalogData from '../../data/catalog.json'
import configData from '../../data/config.json'
import { catalogSchema, siteConfigSchema } from '../domain/schemas'
import type { Catalog, SiteConfig } from '../domain/schemas'

/**
 * Single access point to the static JSON data (catalog + site config).
 * Zod validates at the boundary: malformed data fails when loading, before
 * reaching the UI.
 */
export function parseCatalog(json: unknown): Catalog {
  return catalogSchema.parse(json)
}

export function parseSiteConfig(json: unknown): SiteConfig {
  return siteConfigSchema.parse(json)
}

export function loadCatalog(): Catalog {
  return parseCatalog(catalogData)
}

export function loadSiteConfig(): SiteConfig {
  return parseSiteConfig(configData)
}
