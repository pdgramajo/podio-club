import { createContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { CartState } from '../../domain/cart'
import { cartReducer } from './cartReducer'
import { loadCart, saveCart } from './cartStorage'

export interface CartContextValue {
  state: CartState
  add: (variantId: string, quantity?: number) => void
  increment: (variantId: string) => void
  decrement: (variantId: string) => void
  setQuantity: (variantId: string, quantity: number) => void
  remove: (variantId: string) => void
  clear: () => void
}

// Context lives next to its provider by design; keep fast-refresh quiet here.
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => loadCart() ?? [])

  useEffect(() => {
    saveCart(state)
  }, [state])

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      add: (variantId, quantity) => dispatch({ type: 'add', variantId, quantity }),
      increment: (variantId) => dispatch({ type: 'increment', variantId }),
      decrement: (variantId) => dispatch({ type: 'decrement', variantId }),
      setQuantity: (variantId, quantity) => dispatch({ type: 'setQuantity', variantId, quantity }),
      remove: (variantId) => dispatch({ type: 'remove', variantId }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
