import { describe, expect, it } from 'vitest'
import {
  addLine,
  cartTotal,
  clearCart,
  hasUnavailableLines,
  removeLine,
  resolveCart,
  setLineQuantity,
} from './cart'
import { makeProduct } from './fixtures'

const product = makeProduct()

describe('addLine', () => {
  it('adds a new line to an empty cart', () => {
    expect(addLine([], 'rmc-negro-m', 1)).toEqual([{ variantId: 'rmc-negro-m', quantity: 1 }])
  })

  it('merges the same variant by summing quantities', () => {
    const state = addLine(addLine([], 'rmc-negro-m', 1), 'rmc-negro-m', 2)
    expect(state).toEqual([{ variantId: 'rmc-negro-m', quantity: 3 }])
  })

  it('keeps a minimum of 1 and discards fractions', () => {
    expect(addLine([], 'a', 0)).toEqual([{ variantId: 'a', quantity: 1 }])
    expect(addLine([], 'a', 2.9)).toEqual([{ variantId: 'a', quantity: 2 }])
  })
})

describe('setLineQuantity', () => {
  it('sets the quantity of a line', () => {
    const state = setLineQuantity([{ variantId: 'a', quantity: 3 }], 'a', 5)
    expect(state).toEqual([{ variantId: 'a', quantity: 5 }])
  })

  it('does not go below 1', () => {
    const state = setLineQuantity([{ variantId: 'a', quantity: 3 }], 'a', 0)
    expect(state).toEqual([{ variantId: 'a', quantity: 1 }])
  })
})

describe('removeLine and clearCart', () => {
  it('removes a line by variantId', () => {
    const state = [
      { variantId: 'a', quantity: 1 },
      { variantId: 'b', quantity: 2 },
    ]
    expect(removeLine(state, 'a')).toEqual([{ variantId: 'b', quantity: 2 }])
  })

  it('clears the cart', () => {
    expect(clearCart()).toEqual([])
  })
})

describe('resolveCart', () => {
  it('resolves an available line', () => {
    const [resolved] = resolveCart([product], [{ variantId: 'rmc-negro-m', quantity: 2 }])
    expect(resolved.status).toBe('available')
    expect(resolved.product?.slug).toBe('remera-monocromo')
    expect(resolved.color?.name).toBe('Negro')
    expect(resolved.variant?.size).toBe('M')
    expect(resolved.subtotal).toBe(24000)
  })

  it('marks a sold-out line when available is false', () => {
    const [resolved] = resolveCart([product], [{ variantId: 'rmc-blanco-m', quantity: 1 }])
    expect(resolved.status).toBe('soldOut')
    expect(resolved.subtotal).toBe(12000)
  })

  it('marks a missing line when the variant is not in the catalog', () => {
    const [resolved] = resolveCart([product], [{ variantId: 'ghost', quantity: 1 }])
    expect(resolved.status).toBe('missing')
    expect(resolved.subtotal).toBeUndefined()
  })
})

describe('cartTotal and finalization blocking', () => {
  it('sums all visible lines, including sold-out ones', () => {
    const lines = resolveCart(
      [product],
      [
        { variantId: 'rmc-negro-m', quantity: 1 },
        { variantId: 'rmc-blanco-m', quantity: 2 },
      ],
    )
    expect(cartTotal(lines)).toBe(36000)
  })

  it('does not sum missing lines (no price available)', () => {
    const lines = resolveCart(
      [product],
      [
        { variantId: 'rmc-negro-m', quantity: 1 },
        { variantId: 'ghost', quantity: 9 },
      ],
    )
    expect(cartTotal(lines)).toBe(12000)
  })

  it('detects unavailable lines', () => {
    const available = resolveCart([product], [{ variantId: 'rmc-negro-m', quantity: 1 }])
    const withSoldOut = resolveCart([product], [{ variantId: 'rmc-blanco-m', quantity: 1 }])
    const withMissing = resolveCart([product], [{ variantId: 'ghost', quantity: 1 }])
    expect(hasUnavailableLines(available)).toBe(false)
    expect(hasUnavailableLines(withSoldOut)).toBe(true)
    expect(hasUnavailableLines(withMissing)).toBe(true)
  })
})
