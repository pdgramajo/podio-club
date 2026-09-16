import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { loadCatalog } from '../../data/repository'
import { useFilters } from './useFilters'

const catalog = loadCatalog()

function renderFilters() {
  return renderHook(() => useFilters(catalog))
}

describe('useFilters', () => {
  it('starts with the full catalog', () => {
    const { result } = renderFilters()
    expect(result.current.filtered).toHaveLength(10)
    expect(result.current.query).toBe('')
    expect(result.current.size).toBe('all')
    expect(result.current.color).toBe('all')
  })

  it('filters by free-text query ignoring case and accents', () => {
    const { result } = renderFilters()
    act(() => result.current.setQuery('remera básica'))
    expect(result.current.filtered.map((product) => product.slug)).toEqual(['remera-basica'])
    act(() => result.current.setQuery('PODIO'))
    expect(result.current.filtered.map((product) => product.slug)).toEqual(['remera-podio'])
  })

  it('filters by size', () => {
    const { result } = renderFilters()
    act(() => result.current.setSize('S'))
    const slugs = result.current.filtered.map((product) => product.slug)
    expect(slugs).toEqual(['remera-monocromo', 'remera-basica', 'remera-street', 'remera-cielo'])
  })

  it('filters by color', () => {
    const { result } = renderFilters()
    act(() => result.current.setColor('celeste'))
    const slugs = result.current.filtered.map((product) => product.slug)
    expect(slugs).toEqual(['remera-street', 'remera-cielo'])
  })

  it('combines size and color filters', () => {
    const { result } = renderFilters()
    act(() => result.current.setColor('negro'))
    act(() => result.current.setSize('S'))
    const slugs = result.current.filtered.map((product) => product.slug)
    expect(slugs).toEqual(['remera-monocromo', 'remera-basica', 'remera-street'])
  })

  it('returns an empty list when nothing matches', () => {
    const { result } = renderFilters()
    act(() => result.current.setColor('mostaza'))
    act(() => result.current.setSize('XL'))
    expect(result.current.filtered).toEqual([])
  })

  it('resets to the full catalog when filters are cleared', () => {
    const { result } = renderFilters()
    act(() => result.current.setQuery('nada que exista'))
    act(() => result.current.setColor('azul'))
    act(() => result.current.setSize('XL'))
    act(() => result.current.setQuery(''))
    act(() => result.current.setColor('all'))
    act(() => result.current.setSize('all'))
    expect(result.current.filtered).toHaveLength(10)
  })
})
