import { describe, expect, it } from 'vitest'
import type { CartState } from '../../domain/cart'
import { CART_STORAGE_KEY, loadCart, saveCart } from './cartStorage'
import type { CartStorage } from './cartStorage'

function createMemoryStorage(): CartStorage & { entries: Map<string, string> } {
  const entries = new Map<string, string>()
  return {
    entries,
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  }
}

const state: CartState = [
  { variantId: 'rmc-negro-s', quantity: 2 },
  { variantId: 'rno-azul-m', quantity: 1 },
]

describe('cartStorage', () => {
  it('persists only variantId and quantity', () => {
    const storage = createMemoryStorage()
    saveCart(state, storage)
    expect(storage.entries.get(CART_STORAGE_KEY)).toBe(
      JSON.stringify([
        { variantId: 'rmc-negro-s', quantity: 2 },
        { variantId: 'rno-azul-m', quantity: 1 },
      ]),
    )
  })

  it('round-trips a saved cart', () => {
    const storage = createMemoryStorage()
    saveCart(state, storage)
    expect(loadCart(storage)).toEqual(state)
  })

  it('returns null when nothing is stored', () => {
    expect(loadCart(createMemoryStorage())).toBeNull()
  })

  it('returns null when the payload is not JSON', () => {
    const storage = createMemoryStorage()
    storage.setItem(CART_STORAGE_KEY, '{corrupted')
    expect(loadCart(storage)).toBeNull()
  })

  it('returns null when the payload is not an array', () => {
    const storage = createMemoryStorage()
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ variantId: 'rmc-negro-s', quantity: 1 }))
    expect(loadCart(storage)).toBeNull()
  })

  it('discards malformed lines and keeps valid ones', () => {
    const storage = createMemoryStorage()
    storage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        { variantId: 'rmc-negro-s', quantity: 1 },
        { variantId: '', quantity: 1 },
        { quantity: 2 },
        { variantId: 'rpd-blanco-m', quantity: 0 },
        { variantId: 'rno-azul-m', quantity: 2.5 },
        'not-an-object',
        null,
      ]),
    )
    expect(loadCart(storage)).toEqual([{ variantId: 'rmc-negro-s', quantity: 1 }])
  })

  it('returns null when only malformed lines remain', () => {
    const storage = createMemoryStorage()
    storage.setItem(CART_STORAGE_KEY, JSON.stringify([{ variantId: 42, quantity: 'x' }]))
    expect(loadCart(storage)).toBeNull()
  })

  it('persists an emptied cart and reloads it as an empty initial state', () => {
    const storage = createMemoryStorage()
    saveCart([], storage)
    expect(storage.entries.get(CART_STORAGE_KEY)).toBe('[]')
    expect(loadCart(storage)).toBeNull()
  })
})
