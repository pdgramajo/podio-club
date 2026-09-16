import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '../application/cart/CartContext'
import { CART_STORAGE_KEY } from '../application/cart/cartStorage'
import { ToastProvider } from '../application/toast/ToastContext'
import ToastHost from '../components/ui/ToastHost'
import ProductDetailPage from './ProductDetail'

function renderDetail(slug: string) {
  return render(
    <CartProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[`/producto/${slug}`]}>
          <Routes>
            <Route path="/producto/:slug" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
        <ToastHost />
      </ToastProvider>
    </CartProvider>,
  )
}

describe('ProductDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the product with the default color and size', () => {
    renderDetail('remera-monocromo')
    expect(screen.getByRole('heading', { name: 'Remera Monocromo' })).toBeTruthy()
    expect(screen.getByText('$12.000')).toBeTruthy()
    expect(screen.getByText('Negro')).toBeTruthy()
    expect(screen.getByText('En stock — talle M en Negro.')).toBeTruthy()
    expect(
      (screen.getByRole('button', { name: 'Agregar al carrito' }) as HTMLButtonElement).disabled,
    ).toBe(false)
  })

  it('switches the gallery photo', () => {
    renderDetail('remera-monocromo')
    expect(screen.getByAltText('Foto 1 de Remera Monocromo')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Ver foto 2' }))
    expect(screen.getByAltText('Foto 2 de Remera Monocromo')).toBeTruthy()
  })

  it('adds the selected combination to the cart', () => {
    renderDetail('remera-monocromo')
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(screen.getByText('Agregado al carrito: Remera Monocromo — Negro, talle M')).toBeTruthy()
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')
    expect(stored).toEqual([{ variantId: 'rmc-negro-m', quantity: 1 }])
  })

  it('shows a sold-out combination as disabled', () => {
    renderDetail('remera-monocromo')
    fireEvent.click(screen.getByRole('button', { name: 'Blanco' }))
    fireEvent.click(screen.getByRole('button', { name: 'L' }))
    expect((screen.getByRole('button', { name: 'Agotado' }) as HTMLButtonElement).disabled).toBe(
      true,
    )
    expect(screen.getByText('Este talle está agotado.')).toBeTruthy()
  })

  it('disables sizes that are not offered for the selected color', () => {
    renderDetail('remera-monocromo')
    fireEvent.click(screen.getByRole('button', { name: 'Blanco' }))
    expect((screen.getByRole('button', { name: 'S' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows a fallback when the product does not exist', () => {
    renderDetail('modelo-inexistente')
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toBeTruthy()
  })
})
