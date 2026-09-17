import { useCatalog } from '../application/catalog/useCatalog'
import { useFilters } from '../application/catalog/useFilters'
import { SIZES } from '../domain/catalog'
import ProductCard from '../components/product/ProductCard'

const eyebrowClass =
  "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']"

const chipBase =
  'rounded-full border px-3.5 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-200'

import { useDocumentTitle } from '../application/useDocumentTitle'

export default function CatalogPage() {
  useDocumentTitle('Catálogo — Podio Club')
  const { products } = useCatalog()
  const { query, setQuery, size, setSize, color, setColor, filtered } = useFilters(products)

  const colors = Array.from(
    new Map(
      products.flatMap((product) => product.colors).map((entry) => [entry.key, entry]),
    ).values(),
  )

  const resetFilters = () => {
    setQuery('')
    setSize('all')
    setColor('all')
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-4">
      <p className={eyebrowClass}>Catálogo</p>
      <h1 className="mt-3 mb-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-normal tracking-tighter">
        Remeras
      </h1>
      <p className="mb-8 text-[0.82rem] uppercase tracking-[0.08em] text-muted">
        {filtered.length} de {products.length} modelos
      </p>

      <section
        aria-label="Filtros del catálogo"
        className="mb-12 flex flex-wrap items-end gap-x-6 gap-y-4 border-y border-line py-5"
      >
        <label className="min-w-64 flex-1">
          <span className="sr-only">Buscar por nombre</span>
          <input
            type="search"
            value={query}
            placeholder="Buscar por nombre…"
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-none border-0 border-b border-ink bg-transparent py-2 font-body text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por talle"
        >
          <button
            type="button"
            aria-pressed={size === 'all'}
            onClick={() => setSize('all')}
            className={`${chipBase} ${size === 'all' ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}
          >
            Todos
          </button>
          {SIZES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={size === value}
              onClick={() => setSize(value)}
              className={`${chipBase} ${size === value ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}
            >
              {value}
            </button>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por color"
        >
          <button
            type="button"
            aria-pressed={color === 'all'}
            onClick={() => setColor('all')}
            className={`${chipBase} ${color === 'all' ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}
          >
            Todos los colores
          </button>
          {colors.map((entry) => (
            <button
              key={entry.key}
              type="button"
              aria-pressed={color === entry.key}
              onClick={() => setColor(entry.key)}
              className={`${chipBase} ${color === entry.key ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}
            >
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-black/20 align-[-0.05em]"
                style={{ backgroundColor: entry.hex }}
                aria-hidden="true"
              />
              {entry.name}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-line px-6 py-14 text-center text-muted">
          <p className="mb-1 font-display text-xl font-medium text-ink">
            No encontramos remeras con esos filtros.
          </p>
          <p>Probá con otra búsqueda o limpiá la selección.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 border-0 bg-transparent text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-accent underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
