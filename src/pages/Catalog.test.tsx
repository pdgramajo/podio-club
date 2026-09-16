import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import CatalogPage from './Catalog'

function renderCatalog() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  it('shows the full catalog initially', () => {
    renderCatalog()
    expect(screen.getAllByRole('link', { name: /Remera Monocromo/ })).toHaveLength(1)
    expect(screen.getByText('10 de 10 modelos')).toBeTruthy()
    expect(screen.getByText('$14.000')).toBeTruthy()
  })

  it('filters the grid as the visitor types', () => {
    renderCatalog()
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre…'), {
      target: { value: 'podio' },
    })
    expect(screen.getByText('1 de 10 modelos')).toBeTruthy()
    expect(screen.getByText('Remera Podio')).toBeTruthy()
    expect(screen.queryByText('Remera Monocromo')).toBeNull()
  })

  it('shows the empty state and clears the filters', () => {
    renderCatalog()
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre…'), {
      target: { value: 'zzz' },
    })
    expect(screen.getByText('No encontramos remeras con esos filtros.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(screen.getByText('10 de 10 modelos')).toBeTruthy()
  })

  it('filters by size chip', () => {
    renderCatalog()
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    expect(screen.getByText('4 de 10 modelos')).toBeTruthy()
  })
})
