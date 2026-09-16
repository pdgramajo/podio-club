import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Moves the keyboard/screen-reader position to the top of the page on every
 * route change so navigation is announced from a predictable landmark.
 *
 * On the initial render it does nothing (the browser is already at the top and
 * the skip link is available); only on subsequent navigation it scrolls to the
 * top and focuses the given container.
 */
export function useRouteFocus(selector: string): void {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true })
  }, [pathname, selector])
}
