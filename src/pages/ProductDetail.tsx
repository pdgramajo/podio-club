import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../application/catalog/useCatalog'
import { useDocumentTitle } from '../application/useDocumentTitle'
import { useToast } from '../application/toast/useToast'
import { useCart } from '../application/cart/useCart'
import { SIZES } from '../domain/catalog'
import { formatARS } from '../domain/money'
import type { Size } from '../domain/schemas'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const { product, config } = useCatalog()
  const { add } = useCart()
  const { show } = useToast()

  const selectedProduct = product(slug)
  useDocumentTitle(
    selectedProduct
      ? `${selectedProduct.name} — Podio Club`
      : 'Producto no encontrado — Podio Club',
  )

  const [colorKey, setColorKey] = useState<string | undefined>(selectedProduct?.colors[0]?.key)
  const [size, setSize] = useState<Size>(config.defaultSize)
  const [rawPhoto, setRawPhoto] = useState(0)

  if (!selectedProduct) {
    return (
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-4 px-6 pb-24 pt-12">
        <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']">
          404
        </p>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Producto no encontrado</h1>
        <p className="text-muted">Ese modelo ya no está en el catálogo.</p>
        <Link
          to="/catalogo"
          className="mt-4 inline-flex items-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  const { name, description, price, colors, variants } = selectedProduct
  const color = colors.find((c) => c.key === colorKey) ?? colors[0]
  const photoIndex = Math.min(rawPhoto, color.photos.length - 1)
  const offeredSizes = new Set(
    variants.filter((variant) => variant.color === color.key).map((variant) => variant.size),
  )
  const variant = variants.find((v) => v.color === color.key && v.size === size)
  const canAdd = variant !== undefined && variant.available

  const handleColorChange = (key: string) => {
    setColorKey(key)
    setRawPhoto(0)
  }

  const handleAdd = () => {
    if (!canAdd || !variant) {
      return
    }
    add(variant.id)
    show(`Agregado al carrito: ${name} — ${color.name}, talle ${size}`)
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-6">
      <Link to="/catalogo" className="text-sm text-muted transition-colors hover:text-accent">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <img
            src={color.photos[photoIndex]}
            alt={`Foto ${photoIndex + 1} de ${name}`}
            className="aspect-4/5 w-full bg-paper-2 object-cover"
          />
          {color.photos.length > 1 && (
            <div className="mt-3 flex gap-2">
              {color.photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setRawPhoto(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  className={`aspect-4/5 w-16 overflow-hidden rounded border-2 bg-paper-2 sm:w-20 ${
                    index === photoIndex
                      ? 'border-ink'
                      : 'border-line transition-colors hover:border-ink/40'
                  }`}
                >
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']">
            Modelo
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">{name}</h1>
          <p className="mt-2 font-display text-2xl text-ink">{formatARS(price)}</p>
          <p className="mt-6 text-ink-2">{description}</p>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Color</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleColorChange(c.key)}
                  aria-label={c.name}
                  aria-pressed={c.key === color.key}
                  title={c.name}
                  className={`h-9 w-9 rounded-full border-2 transition-colors ${
                    c.key === color.key ? 'border-ink' : 'border-line hover:border-ink/50'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-sm text-muted">{color.name}</span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Talle</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SIZES.map((candidate) => {
                const offered = offeredSizes.has(candidate)
                const selected = candidate === size
                return (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => setSize(candidate)}
                    disabled={!offered}
                    aria-pressed={selected}
                    className={`h-11 w-11 rounded-full border text-sm font-medium transition-colors ${
                      selected
                        ? 'border-ink bg-ink text-paper'
                        : offered
                          ? 'border-line text-ink hover:border-ink'
                          : 'cursor-not-allowed border-line text-muted opacity-40 line-through'
                    }`}
                  >
                    {candidate}
                  </button>
                )
              })}
            </div>
            <p aria-live="polite" className="mt-2 text-sm text-muted">
              {variant
                ? variant.available
                  ? `En stock — talle ${size} en ${color.name}.`
                  : 'Este talle está agotado.'
                : `No ofrecemos el talle ${size} en ${color.name}.`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="mt-8 w-full rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto"
          >
            {canAdd ? 'Agregar al carrito' : variant ? 'Agotado' : 'Combinación no disponible'}
          </button>
        </div>
      </div>
    </div>
  )
}
