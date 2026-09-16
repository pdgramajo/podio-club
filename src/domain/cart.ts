import { isVariantAvailable, resolveVariant } from './catalog'
import type { Product, ProductColor, ProductVariant } from './schemas'

export interface CartLine {
  variantId: string
  quantity: number
}

export type CartState = CartLine[]

export type LineStatus = 'available' | 'soldOut' | 'missing'

export interface ResolvedCartLine {
  variantId: string
  quantity: number
  status: LineStatus
  product?: Product
  color?: ProductColor
  variant?: ProductVariant
  price?: number
  subtotal?: number
}

export function resolveCart(catalog: Product[], state: CartState): ResolvedCartLine[] {
  return state.map(({ variantId, quantity }) => {
    const resolved = resolveVariant(catalog, variantId)
    if (!resolved) {
      return { variantId, quantity, status: 'missing' }
    }
    const available = isVariantAvailable(resolved.variant)
    const price = resolved.product.price
    return {
      variantId,
      quantity,
      status: available ? 'available' : 'soldOut',
      product: resolved.product,
      color: resolved.color,
      variant: resolved.variant,
      price,
      subtotal: price * quantity,
    }
  })
}

export function cartTotal(lines: ResolvedCartLine[]): number {
  return lines.reduce((sum, line) => sum + (line.subtotal ?? 0), 0)
}

export function hasUnavailableLines(lines: ResolvedCartLine[]): boolean {
  return lines.some((line) => line.status !== 'available')
}

export function addLine(state: CartState, variantId: string, quantity: number): CartState {
  const finalQuantity = Math.max(1, Math.floor(quantity))
  const existing = state.find((line) => line.variantId === variantId)
  if (existing) {
    return state.map((line) =>
      line.variantId === variantId ? { ...line, quantity: line.quantity + finalQuantity } : line,
    )
  }
  return [...state, { variantId, quantity: finalQuantity }]
}

export function setLineQuantity(state: CartState, variantId: string, quantity: number): CartState {
  const finalQuantity = Math.max(1, Math.floor(quantity))
  return state.map((line) =>
    line.variantId === variantId ? { ...line, quantity: finalQuantity } : line,
  )
}

export function removeLine(state: CartState, variantId: string): CartState {
  return state.filter((line) => line.variantId !== variantId)
}

export function clearCart(): CartState {
  return []
}
