import { useEffect } from 'react'

/**
 * Keeps the browser tab title in sync with the page and restores the previous
 * title when the page unmounts.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    return () => {
      document.title = previousTitle
    }
  }, [title])
}
