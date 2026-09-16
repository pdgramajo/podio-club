import { NavLink } from 'react-router-dom'
import { useCart } from '../../application/cart/useCart'

const linkBase =
  'relative text-[0.8rem] font-semibold uppercase tracking-[0.12em] no-underline transition-colors duration-200'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? `${linkBase} text-accent after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:bg-accent after:content-['']`
    : `${linkBase} text-ink hover:text-accent`
}

export default function NavBar() {
  const { state } = useCart()
  const itemCount = state.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-paper/85 px-6 py-4 backdrop-blur-md">
      <NavLink to="/" className="font-display text-xl font-semibold no-underline">
        Podio&nbsp;Club
      </NavLink>
      <nav className="flex items-center gap-6" aria-label="Navegación principal">
        <NavLink to="/catalogo" className={navLinkClass}>
          Catálogo
        </NavLink>
        <NavLink
          to="/carrito"
          className={navLinkClass}
          aria-label={`Carrito (${itemCount} artículos)`}
        >
          Carrito
          {itemCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-semibold leading-none text-paper">
              {itemCount}
            </span>
          )}
        </NavLink>
      </nav>
    </header>
  )
}
