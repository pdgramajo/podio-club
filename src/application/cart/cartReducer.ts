import { addLine, clearCart, removeLine, setLineQuantity } from '../../domain/cart'
import type { CartState } from '../../domain/cart'

export type CartAction =
  | { type: 'add'; variantId: string; quantity?: number }
  | { type: 'increment'; variantId: string }
  | { type: 'decrement'; variantId: string }
  | { type: 'setQuantity'; variantId: string; quantity: number }
  | { type: 'remove'; variantId: string }
  | { type: 'clear' }

/**
 * Pure transitions over CartState. Only violations worth guarding live here:
 * quantity floors/merges are delegated to the domain helpers.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      return addLine(state, action.variantId, action.quantity ?? 1)
    case 'increment':
      return addLine(state, action.variantId, 1)
    case 'decrement': {
      const current = state.find((line) => line.variantId === action.variantId)?.quantity ?? 1
      return setLineQuantity(state, action.variantId, current - 1)
    }
    case 'setQuantity':
      return setLineQuantity(state, action.variantId, action.quantity)
    case 'remove':
      return removeLine(state, action.variantId)
    case 'clear':
      return clearCart()
  }
}
