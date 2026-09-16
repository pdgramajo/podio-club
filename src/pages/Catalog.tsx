import { useCatalog } from '../application/catalog/useCatalog'
import { useFilters } from '../application/catalog/useFilters'
import { SIZES } from '../domain/catalog'
import ProductCard from '../components/product/ProductCard'

export default function CatalogPage() {
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
    <div className="catalog">
      <p className="eyebrow">Catálogo</p>
      <h1 className="catalog__title">Remeras</h1>
      <p className="catalog__count">
        {filtered.length} de {products.length} modelos
      </p>

      <section className="toolbar" aria-label="Filtros del catálogo">
        <label className="search">
          <span className="visually-hidden">Buscar por nombre</span>
          <input
            type="search"
            className="search__input"
            value={query}
            placeholder="Buscar por nombre…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="chips" role="group" aria-label="Filtrar por talle">
          <button
            type="button"
            className="chip"
            aria-pressed={size === 'all'}
            onClick={() => setSize('all')}
          >
            Todos
          </button>
          {SIZES.map((value) => (
            <button
              key={value}
              type="button"
              className="chip"
              aria-pressed={size === value}
              onClick={() => setSize(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="Filtrar por color">
          <button
            type="button"
            className="chip"
            aria-pressed={color === 'all'}
            onClick={() => setColor('all')}
          >
            Todos los colores
          </button>
          {colors.map((entry) => (
            <button
              key={entry.key}
              type="button"
              className="chip"
              aria-pressed={color === entry.key}
              onClick={() => setColor(entry.key)}
            >
              <span
                className="chip__dot"
                style={{ backgroundColor: entry.hex }}
                aria-hidden="true"
              />
              {entry.name}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No encontramos remeras con esos filtros.</p>
          <p>Probá con otra búsqueda o limpiá la selección.</p>
          <button type="button" className="empty__reset" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
