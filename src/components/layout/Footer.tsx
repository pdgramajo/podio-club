import { Link } from 'react-router-dom'
import { useCatalog } from '../../application/catalog/useCatalog'

export default function Footer() {
  const { config } = useCatalog()
  const whatsAppUrl = `https://wa.me/${config.whatsAppPhone}`

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__name">Podio&nbsp;Club</p>
          <p className="footer__tagline">Remeras para el podio. Hechas con tiempo y con tinta.</p>
        </div>
        <nav className="footer__nav" aria-label="Navegación del pie">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/carrito">Carrito</Link>
          <a href={whatsAppUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
        <p className="footer__meta">
          © {new Date().getFullYear()} Podio Club — Buenos Aires, Argentina
        </p>
      </div>
    </footer>
  )
}
