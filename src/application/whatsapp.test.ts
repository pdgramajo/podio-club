import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from './whatsapp'
import { buildWhatsAppMessage } from '../domain/whatsapp'
import type { ResolvedCartLine } from '../domain/cart'

const line: ResolvedCartLine = {
  variantId: 'rmc-negro-s',
  quantity: 2,
  status: 'available',
  product: {
    slug: 'remera-monocromo',
    name: 'Remera Monocromo',
    description: 'Una remera de prueba.',
    price: 12000,
    colors: [],
    variants: [],
  },
  color: { key: 'negro', name: 'Negro', hex: '#111111', photos: ['/img/rmc-negro-1.svg'] },
  variant: { id: 'rmc-negro-s', size: 'S', color: 'negro', available: true },
  price: 12000,
  subtotal: 24000,
}

const input = { lines: [line], total: 24000 }

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with the phone cleaned to digits and the encoded message', () => {
    const url = buildWhatsAppUrl('+54 9 388 4372397', input)
    expect(url).toBe(
      `https://wa.me/5493884372397?text=${encodeURIComponent(buildWhatsAppMessage(input))}`,
    )
  })

  it('embeds the order message readable by the receiver', () => {
    const url = new URL(buildWhatsAppUrl('5493884372397', input))
    expect(url.pathname).toBe('/5493884372397')
    expect(url.searchParams.get('text')).toBe(buildWhatsAppMessage(input))
  })
})
