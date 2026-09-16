import { useContext } from 'react'
import { CartContext } from './CartContext'
import type { CartContextValue } from './CartContext'

/**
 * Facade for the UI: exposes the cart reducer via context.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
