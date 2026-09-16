import { Link } from 'react-router-dom'
import { useCatalog } from '../../application/catalog/useCatalog'

export default function Footer() {
  const { config } = useCatalog()
  const whatsAppUrl = `https://wa.me/${config.whatsAppPhone}`

  return (
    <footer className="mt-16 w-full border-t border-line bg-paper-2 px-6 py-10">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-baseline justify-between gap-6">
        <div>
          <p className="font-display text-xl font-semibold">Podio&nbsp;Club</p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Remeras para el podio. Hechas con tiempo y con tinta.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Navegación del pie">
          <Link
            to="/catalogo"
            className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] no-underline transition-colors duration-200 hover:text-accent"
          >
            Catálogo
          </Link>
          <Link
            to="/carrito"
            className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] no-underline transition-colors duration-200 hover:text-accent"
          >
            Carrito
          </Link>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] no-underline transition-colors duration-200 hover:text-accent"
          >
            WhatsApp
          </a>
        </nav>
        <p className="w-full text-[0.78rem] text-muted">
          © {new Date().getFullYear()} Podio Club — Buenos Aires, Argentina
        </p>
      </div>
    </footer>
  )
}
