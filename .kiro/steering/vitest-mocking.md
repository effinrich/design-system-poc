---
inclusion: fileMatch
fileMatchPattern: "**/*.test.{ts,tsx}"
---

# Vitest Spy Mocking Rules

When writing or modifying Vitest tests, follow these rules for consistent, type-safe mocking.

## Mocking Approach

1. Use `vi.mock()` with the `spy: true` option for all package and file mocks
2. Place all mocks at the top of the test file before any test cases
3. Use `vi.mocked()` to type and access the mocked functions
4. Implement mock behaviors in `beforeEach` blocks
5. Mock all required dependencies that the test subject uses

## Mock Implementation Rules

1. Mock implementations should be placed in `beforeEach` blocks
2. Each mock implementation should return a Promise for async functions
3. Mock implementations should match the expected return type of the original function
4. Use `vi.mocked()` to access and implement mock behaviors
5. Mock all required properties and methods that the test subject uses

## Avoided Patterns

Do NOT use these patterns:

1. Direct function mocking without `vi.mocked()`
2. Mock implementations outside of `beforeEach` blocks
3. Mocking without the `spy: true` option
4. Inline mock implementations within test cases
5. Mocking only a subset of required dependencies

## Best Practices

1. Mock at the highest level of abstraction needed
2. Keep mock implementations simple and focused
3. Use type-safe mocking with `vi.mocked()`
4. Document complex mock behaviors
5. Group related mocks together

## Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks at the top
vi.mock('./my-module', { spy: true })

import { myFunction } from './my-module'

describe('MyComponent', () => {
  beforeEach(() => {
    // Implement mock behaviors here
    vi.mocked(myFunction).mockResolvedValue({ data: 'test' })
  })

  it('calls myFunction', async () => {
    // Test code
    await expect(vi.mocked(myFunction)).toHaveBeenCalled()
  })
})
```
