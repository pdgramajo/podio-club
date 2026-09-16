import { Link } from 'react-router-dom'
import { useCart } from '../application/cart/useCart'
import { selectCart } from '../application/selectors'
import { useCatalog } from '../application/catalog/useCatalog'
import { buildWhatsAppUrl } from '../application/whatsapp'
import { formatARS } from '../domain/money'
import type { ResolvedCartLine } from '../domain/cart'

export default function CartPage() {
  const { products, config } = useCatalog()
  const { state, increment, decrement, remove, clear } = useCart()
  const { lines, total, hasUnavailableLines, itemCount } = selectCart(products, state)

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-start gap-4 pb-24 pt-20">
        <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']">
          Carrito
        </p>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Tu carrito está vacío</h1>
        <p className="text-muted">Sumá tus modelos favoritos y pedilos por WhatsApp.</p>
        <Link
          to="/catalogo"
          className="mt-4 inline-flex items-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  const whatsAppUrl = buildWhatsAppUrl(config.whatsAppPhone, { lines, total })

  return (
    <div className="pb-24 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink md:text-5xl">Carrito</h1>
          <p className="mt-2 text-sm text-muted">
            {itemCount} {itemCount === 1 ? 'modelo' : 'modelos'} en tu pedido
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
        >
          Vaciar carrito
        </button>
      </div>

      {hasUnavailableLines && (
        <p className="mt-6 rounded border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-deep">
          Algunos artículos ya no están disponibles y quedan fuera de tu pedido hasta que los
          quites.
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
        <ul className="border-y border-line">
          {lines.map((line) => (
            <CartLineRow
              key={line.variantId}
              line={line}
              increment={increment}
              decrement={decrement}
              remove={remove}
            />
          ))}
        </ul>

        <aside className="h-fit rounded bg-paper-2 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Modelos</dt>
              <dd>{itemCount}</dd>
            </div>
            <div className="flex items-center justify-between font-display text-lg text-ink">
              <dt>Total</dt>
              <dd>{formatARS(total)}</dd>
            </div>
          </dl>

          {hasUnavailableLines ? (
            <div className="mt-6">
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-full bg-line px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Finalizar pedido por WhatsApp
              </button>
              <p className="mt-3 text-xs text-muted">
                Retirá los productos no disponibles para poder finalizar.
              </p>
            </div>
          ) : (
            <>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
              >
                Finalizar pedido por WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-muted">
                Te redirigimos a WhatsApp con el detalle de tu pedido.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

interface CartLineRowProps {
  line: ResolvedCartLine
  increment: (variantId: string) => void
  decrement: (variantId: string) => void
  remove: (variantId: string) => void
}

function CartLineRow({ line, increment, decrement, remove }: CartLineRowProps) {
  const { variantId, quantity, product, color, variant, subtotal } = line
  const unavailable = line.status !== 'available'

  return (
    <li className="flex gap-4 border-b border-line py-6 last:border-b-0">
      {product && color ? (
        <img
          src={color.photos[0]}
          alt=""
          className="aspect-4/5 w-24 shrink-0 bg-paper-2 object-cover sm:w-28"
        />
      ) : (
        <div className="aspect-4/5 w-24 shrink-0 bg-paper-2 sm:w-28" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            {product ? (
              <Link
                to={`/producto/${product.slug}`}
                className="font-display text-lg text-ink transition-colors hover:text-accent"
              >
                {product.name}
              </Link>
            ) : (
              <p className="font-display text-lg text-ink">Producto no disponible</p>
            )}
            {color && variant && (
              <p className="mt-0.5 text-sm text-muted">
                {color.name} / {variant.size}
              </p>
            )}
          </div>

          {unavailable ? (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-deep">
              Producto no disponible
            </span>
          ) : (
            <p className="font-display text-lg text-ink">{formatARS(subtotal!)}</p>
          )}
        </div>

        {product && !unavailable && (
          <p className="text-sm text-muted">{formatARS(product.price)} c/u</p>
        )}

        <div className="flex items-center gap-4">
          {!unavailable && (
            <span className="inline-flex items-center rounded-full border border-line">
              <button
                type="button"
                onClick={() => decrement(variantId)}
                disabled={quantity <= 1}
                aria-label="Quitar uno"
                className="h-8 w-8 rounded-full text-ink transition-colors hover:bg-paper hover:text-accent disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent"
              >
                −
              </button>
              <span aria-live="polite" className="w-8 text-center text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(variantId)}
                aria-label="Agregar uno"
                className="h-8 w-8 rounded-full text-ink transition-colors hover:bg-paper hover:text-accent"
              >
                +
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => remove(variantId)}
            className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
          >
            Quitar
          </button>
        </div>

        {unavailable && (
          <p className="text-sm text-muted">
            {line.status === 'soldOut'
              ? 'Esta combinación se agotó y ya no puede ir en el pedido.'
              : 'Este modelo ya no está en el catálogo.'}{' '}
            Retiralo del carrito para continuar.
          </p>
        )}
      </div>
    </li>
  )
}
