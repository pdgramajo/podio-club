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
      className="product-card"
      style={{ animationDelay: `${index * 70}ms` } as CSSProperties}
    >
      <div className="product-card__media">
        <img src={photo} alt={`Remera ${product.name} en ${color.name}`} loading="lazy" />
        <span className="product-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__meta">
          {product.colors.length} colores · {product.variants.length} variantes
        </p>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatARS(product.price)}</span>
          <span className="product-card__arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
