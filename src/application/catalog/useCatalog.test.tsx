import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCatalog } from './useCatalog'

describe('useCatalog', () => {
  it('loads the full catalog through the repository', () => {
    const { result } = renderHook(() => useCatalog())
    expect(result.current.products).toHaveLength(10)
  })

  it('exposes the featured products configured for the home page', () => {
    const { result } = renderHook(() => useCatalog())
    expect(result.current.featured).toHaveLength(6)
    expect(result.current.featured.map((product) => product.slug)).toEqual([
      'remera-monocromo',
      'remera-podio',
      'remera-basica',
      'remera-edicion',
      'remera-street',
      'remera-clasica',
    ])
  })

  it('looks up a product by slug', () => {
    const { result } = renderHook(() => useCatalog())
    expect(result.current.product('remera-podio')?.name).toBe('Remera Podio')
  })

  it('returns undefined for an unknown slug', () => {
    const { result } = renderHook(() => useCatalog())
    expect(result.current.product('remera-que-no-existe')).toBeUndefined()
  })

  it('loads the site config', () => {
    const { result } = renderHook(() => useCatalog())
    expect(result.current.config.storeName).toBe('Podio Club')
    expect(result.current.config.defaultSize).toBe('M')
    expect(result.current.config.currency).toBe('ARS')
  })
})
