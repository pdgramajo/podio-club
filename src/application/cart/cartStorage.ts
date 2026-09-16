import type { CartLine, CartState } from '../../domain/cart'

export const CART_STORAGE_KEY = 'podio-club.cart'

/**
 * Minimal storage surface so tests can inject an in-memory implementation.
 */
export interface CartStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const line = value as Record<string, unknown>
  return (
    typeof line.variantId === 'string' &&
    line.variantId.length > 0 &&
    typeof line.quantity === 'number' &&
    Number.isInteger(line.quantity) &&
    line.quantity >= 1
  )
}

/**
 * Reads the cart from localStorage. Returns null when nothing was stored or
 * the payload is missing/corrupted. Only { variantId, quantity } is
 * persisted; lines that fail validation are discarded.
 */
export function loadCart(storage: CartStorage = window.localStorage): CartState | null {
  const raw = storage.getItem(CART_STORAGE_KEY)
  if (raw === null) {
    return null
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return null
    }
    const lines = parsed.filter(isCartLine)
    return lines.length > 0 ? lines : null
  } catch {
    return null
  }
}

/**
 * Persists the cart as a plain array of { variantId, quantity }. Failures
 * (quota, private mode, disabled storage) keep the cart in memory only.
 */
export function saveCart(state: CartState, storage: CartStorage = window.localStorage): void {
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: cart stays in memory for the current session
  }
}
