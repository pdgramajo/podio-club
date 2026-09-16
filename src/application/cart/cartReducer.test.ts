import { describe, expect, it } from 'vitest'
import type { CartState } from '../../domain/cart'
import { cartReducer } from './cartReducer'
import type { CartAction } from './cartReducer'

function reduce(initial: CartState, ...actions: CartAction[]): CartState {
  return actions.reduce(cartReducer, initial)
}

const initial: CartState = [{ variantId: 'rmc-negro-s', quantity: 2 }]

describe('cartReducer', () => {
  it('adds a new line', () => {
    const next = cartReducer(initial, { type: 'add', variantId: 'rpd-blanco-m', quantity: 1 })
    expect(next).toEqual([
      { variantId: 'rmc-negro-s', quantity: 2 },
      { variantId: 'rpd-blanco-m', quantity: 1 },
    ])
  })

  it('merges an existing variant and sums quantities', () => {
    expect(cartReducer(initial, { type: 'add', variantId: 'rmc-negro-s', quantity: 3 })).toEqual([
      { variantId: 'rmc-negro-s', quantity: 5 },
    ])
  })

  it('increments an existing line', () => {
    expect(cartReducer(initial, { type: 'increment', variantId: 'rmc-negro-s' })).toEqual([
      { variantId: 'rmc-negro-s', quantity: 3 },
    ])
  })

  it('decrements an existing line keeping a minimum of 1', () => {
    const next = reduce(
      initial,
      { type: 'decrement', variantId: 'rmc-negro-s' },
      { type: 'decrement', variantId: 'rmc-negro-s' },
    )
    expect(next).toEqual([{ variantId: 'rmc-negro-s', quantity: 1 }])
  })

  it('sets an explicit quantity', () => {
    expect(
      cartReducer(initial, { type: 'setQuantity', variantId: 'rmc-negro-s', quantity: 7 }),
    ).toEqual([{ variantId: 'rmc-negro-s', quantity: 7 }])
  })

  it('floors a quantity below 1 up to 1', () => {
    expect(
      cartReducer(initial, { type: 'setQuantity', variantId: 'rmc-negro-s', quantity: 0 }),
    ).toEqual([{ variantId: 'rmc-negro-s', quantity: 1 }])
  })

  it('removes a line', () => {
    const state: CartState = [
      { variantId: 'a', quantity: 1 },
      { variantId: 'b', quantity: 2 },
    ]
    expect(cartReducer(state, { type: 'remove', variantId: 'a' })).toEqual([
      { variantId: 'b', quantity: 2 },
    ])
  })

  it('removing an unknown variant keeps the state unchanged but fresh', () => {
    const next = cartReducer(initial, { type: 'remove', variantId: 'no-existe' })
    expect(next).toEqual(initial)
    expect(next).not.toBe(initial)
  })

  it('clears the cart', () => {
    expect(cartReducer(initial, { type: 'clear' })).toEqual([])
  })

  it('keeps transitions pure: the input state is never mutated', () => {
    const state: CartState = [{ variantId: 'rmc-negro-s', quantity: 1 }]
    const snapshot = JSON.stringify(state)
    cartReducer(state, { type: 'increment', variantId: 'rmc-negro-s' })
    cartReducer(state, { type: 'remove', variantId: 'rmc-negro-s' })
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})
