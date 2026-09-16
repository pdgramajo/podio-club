import { MemoryRouter, Route, Routes, Link, Outlet } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useRouteFocus } from './useRouteFocus'

/**
 * Mirror real app structure: useRouteFocus lives in a persistent layout
 * (like App.tsx) that stays mounted across route changes.
 */
function Layout() {
  useRouteFocus('#contenido')
  return (
    <>
      <Link to="/b">Ir a B</Link>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}

function Fixture() {
  return (
    <MemoryRouter initialEntries={['/a']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/a" element={<p>Página A</p>} />
          <Route path="/b" element={<p>Página B</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('useRouteFocus', () => {
  it('skips focus on first render, then focuses #contenido on navigation', () => {
    render(<Fixture />)

    // First render: hook skips (isFirstRender guard)
    expect(document.activeElement).not.toBe(document.getElementById('contenido'))

    // Navigate: pathname changes → hook fires → focuses #contenido
    fireEvent.click(screen.getByRole('link', { name: 'Ir a B' }))
    expect(document.activeElement).toBe(document.getElementById('contenido'))
  })
})
