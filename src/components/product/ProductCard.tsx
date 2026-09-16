import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { formatARS } from '../../domain/money'
import { primaryColor } from '../../domain/catalog'
import type { Product } from '../../domain/schemas'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const color = primaryColor(product)
  const photo = color.photos[0]

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block animate-reveal opacity-0 no-underline"
      style={{ animationDelay: `${index * 70}ms` } as CSSProperties}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-paper-2">
        <img
          src={photo}
          alt={`Remera ${product.name} en ${color.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className="absolute left-3 top-3 bg-paper px-2 py-0.5 text-[0.7rem] font-semibold tracking-[0.1em]"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-col gap-1 pt-3.5">
        <h3 className="font-display text-lg font-medium">{product.name}</h3>
        <p className="text-xs uppercase tracking-[0.06em] text-muted">
          {product.colors.length} colores · {product.variants.length} variantes
        </p>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide">{formatARS(product.price)}</span>
          <span
            className="-translate-x-1 text-[1.05rem] text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
