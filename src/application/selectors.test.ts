import { describe, expect, it } from 'vitest'
import type { CartState } from '../domain/cart'
import { catalogFixture } from '../domain/fixtures'
import { selectCart } from './selectors'

const cart: CartState = [
  { variantId: 'rmc-negro-m', quantity: 2 },
  { variantId: 'rmc-blanco-m', quantity: 3 },
  { variantId: 'id-inexistente', quantity: 1 },
]

describe('selectCart', () => {
  it('resolves each line to its status', () => {
    const { lines } = selectCart(catalogFixture, cart)
    expect(lines.map((line) => line.status)).toEqual(['available', 'soldOut', 'missing'])
  })

  it('decorates resolved lines with product, color, variant and subtotal', () => {
    const { lines } = selectCart(catalogFixture, cart)
    const available = lines[0]
    expect(available.product?.slug).toBe('remera-monocromo')
    expect(available.color?.key).toBe('negro')
    expect(available.variant?.size).toBe('M')
    expect(available.subtotal).toBe(24000)
  })

  it('totals available and sold-out lines but excludes missing ones', () => {
    const { total } = selectCart(catalogFixture, cart)
    expect(total).toBe(12000 * 2 + 12000 * 3)
  })

  it('reports unavailable lines (sold-out or missing)', () => {
    const { hasUnavailableLines } = selectCart(catalogFixture, cart)
    expect(hasUnavailableLines).toBe(true)
  })

  it('reports no unavailable lines when the cart only has available items', () => {
    const { hasUnavailableLines } = selectCart(catalogFixture, [
      { variantId: 'rmc-negro-m', quantity: 1 },
    ])
    expect(hasUnavailableLines).toBe(false)
  })

  it('counts items across lines', () => {
    const { itemCount } = selectCart(catalogFixture, cart)
    expect(itemCount).toBe(6)
  })
})
