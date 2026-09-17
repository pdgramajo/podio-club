import { Link } from 'react-router-dom'

import { useDocumentTitle } from '../application/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada — Podio Club')
  return (
    <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-4 px-6 pb-24 pt-20">
      <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-accent before:content-['']">
        Error 404
      </p>
      <h1 className="font-display text-3xl text-ink md:text-4xl">Página no encontrada</h1>
      <p className="text-muted">La dirección que buscaste no existe en Podio Club.</p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
