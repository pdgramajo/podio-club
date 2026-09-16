import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDocumentTitle } from './useDocumentTitle'

function Page({ title }: { title: string }) {
  useDocumentTitle(title)
  return <h1>{title}</h1>
}

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'Título inicial'
  })

  it('sets the document title and updates it when it changes', () => {
    const { rerender } = render(<Page title="Catálogo — Podio Club" />)
    expect(document.title).toBe('Catálogo — Podio Club')

    rerender(<Page title="Carrito — Podio Club" />)
    expect(document.title).toBe('Carrito — Podio Club')
  })

  it('restores the previous title on unmount', () => {
    const { unmount } = render(<Page title="Catálogo — Podio Club" />)
    expect(document.title).toBe('Catálogo — Podio Club')

    unmount()
    expect(document.title).toBe('Título inicial')
  })
})
