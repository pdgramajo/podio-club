import { cartTotal, hasUnavailableLines, resolveCart } from '../domain/cart'
import type { CartState, ResolvedCartLine } from '../domain/cart'
import type { Catalog } from '../domain/schemas'

export interface CartSelection {
  lines: ResolvedCartLine[]
  total: number
  hasUnavailableLines: boolean
  itemCount: number
}

/**
 * Pure selector: turns the persisted cart (variantId + quantity) into the
 * resolved view the UI needs, combining catalog and cart state.
 */
export function selectCart(catalog: Catalog, state: CartState): CartSelection {
  const lines = resolveCart(catalog, state)
  return {
    lines,
    total: cartTotal(lines),
    hasUnavailableLines: hasUnavailableLines(lines),
    itemCount: state.reduce((sum, line) => sum + line.quantity, 0),
  }
}
