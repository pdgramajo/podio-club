import { Link } from 'react-router-dom'
import { useCatalog } from '../application/catalog/useCatalog'
import ProductCard from '../components/product/ProductCard'

export default function HomePage() {
  const { featured } = useCatalog()

  return (
    <div>
      <section className="hero">
        <p className="eyebrow">Tienda de remeras — Argentina</p>
        <h1 className="hero__title">
          Para el <em>podio</em>.
        </h1>
        <p className="hero__lead">
          Diseños propios, tiras cortas y atención de persona a persona. Elegí modelo, color y
          talle, y coordinamos tu pedido por WhatsApp.
        </p>
        <div className="hero__actions">
          <Link to="/catalogo" className="button button--primary">
            Ver catálogo
          </Link>
          <a
            href="#destacados"
            className="button button--ghost"
            onClick={(event) => {
              event.preventDefault()
              document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Destacados
          </a>
        </div>
      </section>

      <section id="destacados" className="section">
        <header className="section__head">
          <p className="eyebrow">01 — Destacados</p>
          <Link to="/catalogo" className="link-more">
            Ver todo{' '}
            <span data-arrow aria-hidden="true">
              →
            </span>
          </Link>
        </header>
        <div className="grid">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
