import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../application/catalog/useCatalog'
import { useDocumentTitle } from '../application/useDocumentTitle'
import ProductCard from '../components/product/ProductCard'
import ValueStrip from '../components/home/ValueStrip'
import HowToSteps from '../components/home/HowToSteps'
import CtaBand from '../components/home/CtaBand'

const eyebrowClass =
  "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold before:h-px before:w-6 before:bg-gold before:content-['']"

export default function HomePage() {
  useDocumentTitle('Podio Club — Remeras para el podio')
  const { featured } = useCatalog()

  const scrollToHowTo = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById('como-pedir')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero full-screen */}
      <section
        className="relative flex min-h-[92vh] items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.5) 55%, rgba(8,8,8,0.25) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1120px] px-6 pt-28 md:pt-32">
          <p className="mb-4 font-display text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-gold">
            Remeras &middot; Club &middot; Streetwear
          </p>
          <h1 className="mb-5 font-display text-[clamp(3rem,9vw,6.5rem)] font-bold leading-none tracking-tight text-white">
            PODIO <span className="text-gold">CLUB</span>
          </h1>
          <p className="mb-8 max-w-[34ch] text-[1.1rem] text-white/92">
            Remeras originales con estampa y corte pensado para el club.
            <br className="hidden sm:inline" /> Elegí tu talle, armá tu pedido y coordiná por
            WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2.5 rounded-[10px] border-2 border-gold bg-gold px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-[#101010] no-underline transition-colors duration-200 hover:border-gold-dark hover:bg-gold-dark hover:text-white"
            >
              Ver colección
            </Link>
            <a
              href="#como-pedir"
              onClick={scrollToHowTo}
              className="inline-flex items-center gap-2.5 rounded-[10px] border-2 border-white/85 bg-transparent px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-white no-underline transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
            >
              Cómo pedir
            </a>
          </div>
        </div>
      </section>

      {/* Franja de valor — full-width */}
      <ValueStrip />

      {/* Catálogo destacado */}
      <section id="destacados" className="mx-auto max-w-[1120px] px-6 py-16">
        <header className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-5">
          <p className={eyebrowClass}>01 — Destacados</p>
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] no-underline transition-colors duration-200 hover:text-accent"
          >
            Ver todo{' '}
            <span
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

      {/* Cómo pedir — full-width */}
      <div id="como-pedir">
        <HowToSteps />
      </div>

      {/* CTA WhatsApp — full-width */}
      <CtaBand />
    </div>
  )
}
