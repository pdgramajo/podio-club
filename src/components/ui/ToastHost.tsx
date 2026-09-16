import { useContext } from 'react'
import { ToastContext } from '../../application/toast/ToastContext'

/**
 * Renders the transient feedback stack. It is mounted once at the root, inside
 * the ToastProvider (hence the non-null assertion).
 */
export default function ToastHost() {
  const { toasts } = useContext(ToastContext)!

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-reveal pointer-events-auto rounded-full border border-line bg-ink px-5 py-2.5 text-sm text-paper shadow-lg"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
