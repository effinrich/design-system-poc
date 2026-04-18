import { describe, it, expect } from 'vitest'

describe('test infrastructure', () => {
  it('vitest runs successfully', () => {
    expect(1 + 1).toBe(2)
  })

  it('path alias resolves', async () => {
    const utils = await import('@/lib/utils')
    expect(utils.cn).toBeDefined()
  })
})
