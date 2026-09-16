import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ToastHost from '../../components/ui/ToastHost'
import { TOAST_DURATION_MS, ToastProvider } from './ToastContext'
import { useToast } from './useToast'

function Trigger() {
  const { show } = useToast()
  return (
    <button type="button" onClick={() => show('Agregado al carrito')}>
      agregar
    </button>
  )
}

function renderToast() {
  return render(
    <ToastProvider>
      <Trigger />
      <ToastHost />
    </ToastProvider>,
  )
}

describe('useToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a message and removes it after the duration', () => {
    vi.useFakeTimers()
    renderToast()
    fireEvent.click(screen.getByRole('button', { name: 'agregar' }))
    expect(screen.getByText('Agregado al carrito')).toBeTruthy()

    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS))
    expect(screen.queryByText('Agregado al carrito')).toBeNull()
  })

  it('throws when used outside a ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider',
    )
  })
})
