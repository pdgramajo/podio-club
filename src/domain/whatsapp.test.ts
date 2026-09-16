import { describe, expect, it } from 'vitest'
import type { ResolvedCartLine } from './cart'
import { makeProduct } from './fixtures'
import { buildWhatsAppMessage } from './whatsapp'

function line(overrides: Partial<ResolvedCartLine> = {}): ResolvedCartLine {
  return {
    variantId: 'id',
    quantity: 1,
    status: 'available',
    price: 0,
    subtotal: 0,
    ...overrides,
  }
}

const product = makeProduct()

describe('buildWhatsAppMessage', () => {
  it('builds the agreed structured message', () => {
    const lines = [
      line({
        variantId: 'rmc-negro-m',
        quantity: 1,
        price: 12000,
        subtotal: 12000,
        product,
        color: product.colors[0],
        variant: product.variants[0],
      }),
      line({
        variantId: 'rmc-negro-l',
        quantity: 2,
        price: 12000,
        subtotal: 24000,
        product,
        color: product.colors[0],
        variant: product.variants[1],
      }),
    ]

    expect(buildWhatsAppMessage({ lines, total: 36000 })).toBe(
      'Hola! Quisiera hacer el siguiente pedido:\n' +
        '\n' +
        '1 × Remera Monocromo — Negro / M — $12.000\n' +
        '2 × Remera Monocromo — Negro / L — $24.000\n' +
        '\n' +
        'Total: $36.000',
    )
  })

  it('omits lines without a price (missing variants)', () => {
    const lines = [
      line({ variantId: 'ghost', status: 'missing' }),
      line({ variantId: 'x', quantity: 1, price: 5000, subtotal: 5000 }),
    ]

    const message = buildWhatsAppMessage({ lines, total: 5000 })

    expect(message).toContain('Total: $5.000')
    expect(message).not.toContain('ghost')
  })
})
