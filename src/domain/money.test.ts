import { describe, expect, it } from 'vitest'
import { formatARS } from './money'

describe('formatARS', () => {
  it('formats integer amounts in ARS without decimals or spaces', () => {
    expect(formatARS(12000)).toBe('$12.000')
  })

  it('handles amounts below the thousands separator', () => {
    expect(formatARS(999)).toBe('$999')
  })

  it('handles zero', () => {
    expect(formatARS(0)).toBe('$0')
  })
})
