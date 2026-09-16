import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { CART_STORAGE_KEY } from './cartStorage'
import { CartProvider } from './CartContext'
import { useCart } from './useCart'

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

function renderCart() {
  return renderHook(() => useCart(), { wrapper })
}

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty cart', () => {
    const { result } = renderCart()
    expect(result.current.state).toEqual([])
  })

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ variantId: 'rmc-negro-s', quantity: 2 }]),
    )
    const { result } = renderCart()
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 2 }])
  })

  it('adds a line and persists it', () => {
    const { result } = renderCart()
    act(() => result.current.add('rmc-negro-s', 2))
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 2 }])
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')
    expect(stored).toEqual([{ variantId: 'rmc-negro-s', quantity: 2 }])
  })

  it('merges repeated additions of the same variant', () => {
    const { result } = renderCart()
    act(() => result.current.add('rmc-negro-s', 1))
    act(() => result.current.add('rmc-negro-s', 3))
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 4 }])
  })

  it('increments and decrements with a minimum of 1', () => {
    const { result } = renderCart()
    act(() => result.current.add('rmc-negro-s', 1))
    act(() => result.current.increment('rmc-negro-s'))
    act(() => result.current.increment('rmc-negro-s'))
    act(() => result.current.decrement('rmc-negro-s'))
    act(() => result.current.decrement('rmc-negro-s'))
    act(() => result.current.decrement('rmc-negro-s'))
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 1 }])
  })

  it('sets an explicit quantity', () => {
    const { result } = renderCart()
    act(() => result.current.add('rmc-negro-s', 1))
    act(() => result.current.setQuantity('rmc-negro-s', 5))
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 5 }])
  })

  it('keeps unavailable lines and lets them be removed', () => {
    const { result } = renderCart()
    act(() => result.current.add('rno-azul-xl', 2))
    act(() => result.current.add('rmc-negro-s', 1))
    act(() => result.current.remove('rno-azul-xl'))
    expect(result.current.state).toEqual([{ variantId: 'rmc-negro-s', quantity: 1 }])
  })

  it('clears the whole cart', () => {
    const { result } = renderCart()
    act(() => result.current.add('rmc-negro-s', 1))
    act(() => result.current.add('rpd-blanco-m', 1))
    act(() => result.current.clear())
    expect(result.current.state).toEqual([])
  })

  it('throws when used outside a CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider')
  })
})
