import { useContext } from 'react'
import { ToastContext } from './ToastContext'
import type { ToastContextValue } from './ToastContext'

/**
 * Facade for the UI: exposes transient feedback via context.
 */
export function useToast(): Pick<ToastContextValue, 'show'> {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return { show: context.show }
}
