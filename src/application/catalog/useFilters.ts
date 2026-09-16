import { useMemo, useState } from 'react'
import type { Catalog, Size } from '../../domain/schemas'

export type SizeFilter = Size | 'all'
export type ColorFilter = string // color key, or 'all'

function normalize(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

/**
 * Client-side catalog filtering: free-text search (name) plus size and color
 * selects. Returns the current values, their setters for the UI and the
 * filtered product list.
 */
export function useFilters(products: Catalog) {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState<SizeFilter>('all')
  const [color, setColor] = useState<ColorFilter>('all')

  const filtered = useMemo(() => {
    const search = normalize(query.trim())
    return products.filter((product) => {
      if (size !== 'all' && !product.variants.some((variant) => variant.size === size)) {
        return false
      }
      if (color !== 'all' && !product.colors.some((entry) => entry.key === color)) {
        return false
      }
      if (search !== '' && !normalize(product.name).includes(search)) {
        return false
      }
      return true
    })
  }, [products, query, size, color])

  return { query, setQuery, size, setSize, color, setColor, filtered }
}
