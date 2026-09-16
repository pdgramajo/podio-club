import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="nav-bar">
      <Link to="/" className="nav-bar__brand">
        Podio&nbsp;Club
      </Link>
      <nav className="nav-bar__nav" aria-label="Navegación principal">
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito</Link>
      </nav>
    </header>
  )
}
