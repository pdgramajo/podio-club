import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '../application/cart/CartContext'
import { CART_STORAGE_KEY } from '../application/cart/cartStorage'
import CartPage from './Cart'

function seedCart(lines: { variantId: string; quantity: number }[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
}

function renderCart() {
  return render(
    <CartProvider>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </CartProvider>,
  )
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty state without lines', () => {
    renderCart()
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toBeTruthy()
  })

  it('lists available lines with color, size, subtotals and total', () => {
    seedCart([
      { variantId: 'rmc-negro-s', quantity: 2 },
      { variantId: 'rpd-blanco-m', quantity: 1 },
    ])
    renderCart()
    expect(screen.getByRole('link', { name: 'Remera Monocromo' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Remera Podio' })).toBeTruthy()
    expect(screen.getByText('Negro / S')).toBeTruthy()
    expect(screen.getByText('Blanco / M')).toBeTruthy()
    expect(screen.getByText('$24.000')).toBeTruthy()
    expect(screen.getByText('$38.000')).toBeTruthy()
    expect(screen.getByText('3 modelos en tu pedido')).toBeTruthy()
  })

  it('updates subtotals when the quantity changes', () => {
    seedCart([{ variantId: 'rmc-negro-s', quantity: 1 }])
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }))
    expect(screen.getAllByText('$24.000')).toHaveLength(2)
    expect(screen.getAllByText('2')).toHaveLength(2)
  })

  it('blocks finalizing when a line is unavailable', () => {
    seedCart([
      { variantId: 'rmc-blanco-l', quantity: 1 },
      { variantId: 'rmc-negro-s', quantity: 1 },
    ])
    renderCart()
    expect(screen.getAllByText('Producto no disponible').length).toBeGreaterThan(0)
    const finalize = screen.getByRole('button', { name: 'Finalizar pedido por WhatsApp' })
    expect((finalize as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/Algunos artículos ya no están disponibles/)).toBeTruthy()
  })

  it('removes an unavailable line and enables the WhatsApp action', () => {
    seedCart([
      { variantId: 'rno-azul-xl', quantity: 1 },
      { variantId: 'rmc-negro-s', quantity: 1 },
    ])
    renderCart()
    expect(
      (screen.getByRole('button', { name: 'Finalizar pedido por WhatsApp' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    fireEvent.click(screen.getAllByRole('button', { name: 'Quitar' })[0])
    expect(screen.getByRole('link', { name: 'Finalizar pedido por WhatsApp' })).toBeTruthy()
  })

  it('builds the WhatsApp link with the order message', () => {
    seedCart([{ variantId: 'rmc-negro-m', quantity: 2 }])
    renderCart()
    const link = screen.getByRole('link', { name: 'Finalizar pedido por WhatsApp' })
    expect(link.getAttribute('target')).toBe('_blank')
    const url = new URL((link as HTMLAnchorElement).href)
    expect(url.pathname).toBe('/5493884372397')
    const message = url.searchParams.get('text')
    expect(message).toContain('2 × Remera Monocromo — Negro / M')
    expect(message).toContain('Total: $24.000')
  })
})
