import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../application/catalog/useCatalog'
import ProductCard from '../components/product/ProductCard'

const eyebrowClass =
  "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']"

export default function HomePage() {
  const { featured } = useCatalog()

  const scrollToFeatured = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <section className="max-w-[58rem] pb-10 pt-12 md:pb-14 md:pt-16 lg:pb-18 lg:pt-24">
        <p className={eyebrowClass}>Tienda de remeras — Argentina</p>
        <h1 className="mt-4 mb-7 font-display text-[clamp(2.8rem,8vw,5.75rem)] font-normal leading-none tracking-tighter">
          Para el <em className="font-light italic text-accent">podio</em>.
        </h1>
        <p className="mb-8 max-w-[34rem] text-base text-muted">
          Diseños propios, tiras cortas y atención de persona a persona. Elegí modelo, color y
          talle, y coordinamos tu pedido por WhatsApp.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2.5 border border-ink bg-ink px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] no-underline transition-colors duration-200 hover:border-accent hover:bg-accent"
          >
            Ver catálogo
          </Link>
          <a
            href="#destacados"
            onClick={scrollToFeatured}
            className="inline-flex items-center gap-2.5 border border-ink px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] no-underline transition-colors duration-200 hover:bg-ink hover:text-paper"
          >
            Destacados
          </a>
        </div>
      </section>

      <section id="destacados" className="pb-8">
        <header className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-5">
          <p className={eyebrowClass}>01 — Destacados</p>
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] no-underline transition-colors duration-200 hover:text-accent"
          >
            Ver todo{' '}
            <span
              data-arrow
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </header>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
