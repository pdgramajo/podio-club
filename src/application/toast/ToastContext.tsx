import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export const TOAST_DURATION_MS = 2400

export interface Toast {
  id: number
  message: string
}

export interface ToastContextValue {
  toasts: Toast[]
  show: (message: string) => void
}

// Context lives next to its provider by design; keep fast-refresh quiet here.
// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Minimal transient feedback: a message appears for a short time and removes
 * itself. Used for confirmation of actions (e.g. "added to cart").
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const show = useCallback((message: string) => {
    const id = nextId.current++
    setToasts((current) => [...current, { id, message }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, TOAST_DURATION_MS)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toasts, show }), [toasts, show])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
