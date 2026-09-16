import { NavLink } from 'react-router-dom'
import { useCart } from '../../application/cart/useCart'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-link is-active' : 'nav-link'
}

export default function NavBar() {
  const { state } = useCart()
  const itemCount = state.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <header className="nav-bar">
      <NavLink to="/" className="nav-bar__brand">
        Podio&nbsp;Club
      </NavLink>
      <nav className="nav-bar__nav" aria-label="Navegación principal">
        <NavLink to="/catalogo" className={navLinkClass}>
          Catálogo
        </NavLink>
        <NavLink
          to="/carrito"
          className={navLinkClass}
          aria-label={`Carrito (${itemCount} artículos)`}
        >
          Carrito
          {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
        </NavLink>
      </nav>
    </header>
  )
}
