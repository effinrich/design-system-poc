import { describe, it, expect, afterEach } from 'vitest'
import fc from 'fast-check'
import fs from 'fs'
import os from 'os'
import { extractManifest } from '../manifest-extractor'
import { SPACING_MAP, RADIUS_MAP } from '../constants'
import path from 'path'

// Resolve paths relative to project root
const resolve = (p: string) => path.resolve(process.cwd(), p)

describe('ManifestExtractor', () => {
  describe('button.tsx — cva with variants and sizes', () => {
    it('extracts component name', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      expect(manifest.componentName).toBe('Button')
    })

    it('extracts variant names and options', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      expect(manifest.variants).toHaveProperty('variant')
      expect(manifest.variants).toHaveProperty('size')
      expect(manifest.variants.variant).toEqual(
        expect.arrayContaining([
          'default',
          'outline',
          'secondary',
          'ghost',
          'destructive',
          'link'
        ])
      )
      expect(manifest.variants.variant).toHaveLength(6)
      expect(manifest.variants.size).toEqual(
        expect.arrayContaining([
          'default',
          'xs',
          'sm',
          'lg',
          'icon',
          'icon-xs',
          'icon-sm',
          'icon-lg'
        ])
      )
      expect(manifest.variants.size).toHaveLength(8)
    })

    it('extracts defaultVariants', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      expect(manifest.defaultVariants).toEqual({
        variant: 'default',
        size: 'default'
      })
    })

    it('extracts token references', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      // button.tsx references tokens like primary, primary-foreground, etc.
      expect(manifest.tokenReferences).toEqual(
        expect.arrayContaining(['primary', 'primary-foreground'])
      )
      expect(manifest.tokenReferences.length).toBeGreaterThan(0)
    })

    it('extracts spacing classes', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      // button.tsx uses gap-1.5, px-2.5, etc.
      expect(manifest.spacingClasses.length).toBeGreaterThan(0)
    })

    it('extracts radius classes', () => {
      const manifest = extractManifest(resolve('src/components/ui/button.tsx'))
      expect(manifest.radiusClasses).toEqual(
        expect.arrayContaining(['rounded-lg'])
      )
    })

    it('sets filePath correctly', () => {
      const filePath = resolve('src/components/ui/button.tsx')
      const manifest = extractManifest(filePath)
      expect(manifest.filePath).toBe(filePath)
    })
  })

  describe('badge.tsx — cva with variants only, no size', () => {
    it('extracts component name', () => {
      const manifest = extractManifest(resolve('src/components/ui/badge.tsx'))
      expect(manifest.componentName).toBe('Badge')
    })

    it('extracts variants without size', () => {
      const manifest = extractManifest(resolve('src/components/ui/badge.tsx'))
      expect(manifest.variants).toHaveProperty('variant')
      expect(manifest.variants).not.toHaveProperty('size')
      expect(manifest.variants.variant).toEqual(
        expect.arrayContaining([
          'default',
          'secondary',
          'destructive',
          'outline',
          'ghost',
          'link'
        ])
      )
      expect(manifest.variants.variant).toHaveLength(6)
    })

    it('extracts defaultVariants', () => {
      const manifest = extractManifest(resolve('src/components/ui/badge.tsx'))
      expect(manifest.defaultVariants).toEqual({
        variant: 'default'
      })
    })

    it('extracts radius classes including rounded-4xl', () => {
      const manifest = extractManifest(resolve('src/components/ui/badge.tsx'))
      expect(manifest.radiusClasses).toEqual(
        expect.arrayContaining(['rounded-4xl'])
      )
    })
  })

  describe('card.tsx — no cva, multiple sub-components', () => {
    it('extracts primary component name as Card', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      expect(manifest.componentName).toBe('Card')
    })

    it('has empty variants when no cva is present', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      expect(manifest.variants).toEqual({})
      expect(manifest.defaultVariants).toEqual({})
    })

    it('detects sub-components', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      expect(manifest.subComponents).toEqual(
        expect.arrayContaining([
          'CardHeader',
          'CardFooter',
          'CardTitle',
          'CardAction',
          'CardDescription',
          'CardContent'
        ])
      )
    })

    it('extracts props from React.ComponentProps intersection', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      // Card has { size?: "default" | "sm" } in its type
      const sizeProp = manifest.props.find(p => p.name === 'size')
      expect(sizeProp).toBeDefined()
      expect(sizeProp!.required).toBe(false)
    })

    it('extracts token references from class strings', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      // card.tsx references bg-card, text-card-foreground, etc.
      expect(manifest.tokenReferences).toEqual(
        expect.arrayContaining(['card', 'card-foreground'])
      )
    })

    it('extracts spacing classes', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      // card.tsx uses gap-4, py-4, px-4, p-4, etc.
      expect(manifest.spacingClasses.length).toBeGreaterThan(0)
    })

    it('extracts radius classes', () => {
      const manifest = extractManifest(resolve('src/components/ui/card.tsx'))
      expect(manifest.radiusClasses).toEqual(
        expect.arrayContaining(['rounded-xl'])
      )
    })
  })

  describe('StatCard.tsx — no cva, custom interface', () => {
    it('extracts component name', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      expect(manifest.componentName).toBe('StatCard')
    })

    it('has empty variants', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      expect(manifest.variants).toEqual({})
      expect(manifest.defaultVariants).toEqual({})
    })

    it('extracts props from StatCardProps interface', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      const propNames = manifest.props.map(p => p.name)
      expect(propNames).toEqual(
        expect.arrayContaining(['title', 'value', 'change', 'trend'])
      )
    })

    it('marks required and optional props correctly', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      const titleProp = manifest.props.find(p => p.name === 'title')
      const changeProp = manifest.props.find(p => p.name === 'change')
      const trendProp = manifest.props.find(p => p.name === 'trend')

      expect(titleProp!.required).toBe(true)
      expect(changeProp!.required).toBe(false)
      expect(trendProp!.required).toBe(false)
    })

    it('extracts token references', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      // StatCard references text-muted-foreground, text-emerald-600, text-red-600
      expect(manifest.tokenReferences).toEqual(
        expect.arrayContaining(['muted-foreground'])
      )
    })

    it('has no sub-components', () => {
      const manifest = extractManifest(
        resolve('src/components/dashboard/StatCard.tsx')
      )
      expect(manifest.subComponents).toEqual([])
    })
  })
})

// Feature: bidirectional-sync-tooling, Property 4: Manifest extraction captures all component metadata
describe('Property 4: Manifest extraction captures all component metadata', () => {
  // **Validates: Requirements 2.1, 2.2, 2.3**

  const tmpFiles: string[] = []

  afterEach(() => {
    for (const f of tmpFiles) {
      try {
        fs.unlinkSync(f)
      } catch {
        // ignore
      }
    }
    tmpFiles.length = 0
  })

  // Arbitrary for valid variant names (lowercase identifiers)
  const arbVariantName = fc
    .string({
      minLength: 1,
      maxLength: 12,
      unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split(''))
    })
    .filter(s => /^[a-z][a-z]*$/.test(s))

  // Arbitrary for valid variant option names (lowercase identifiers, may include hyphens)
  const arbOptionName = fc
    .string({
      minLength: 1,
      maxLength: 10,
      unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split(''))
    })
    .filter(s => /^[a-z][a-z]*$/.test(s))

  // Arbitrary for design token names that pass the isLikelyToken filter
  const arbTokenName = fc.constantFrom(
    'primary',
    'secondary',
    'muted-foreground',
    'destructive',
    'accent',
    'background',
    'card-foreground',
    'popover',
    'input',
    'ring'
  )

  // Arbitrary for token utility prefixes
  const arbTokenPrefix = fc.constantFrom(
    'bg',
    'text',
    'border',
    'ring',
    'fill',
    'stroke'
  )

  // Arbitrary for spacing classes (from SPACING_MAP keys)
  const spacingKeys = Object.keys(SPACING_MAP)
  const arbSpacingClass = fc.constantFrom(...spacingKeys)

  // Arbitrary for radius classes (from RADIUS_MAP keys)
  const radiusKeys = Object.keys(RADIUS_MAP)
  const arbRadiusClass = fc.constantFrom(...radiusKeys)

  // Generate a synthetic component source with cva() call
  function buildSyntheticSource(
    componentName: string,
    variants: Record<string, string[]>,
    tokenClasses: string[],
    spacingClasses: string[],
    radiusClasses: string[]
  ): string {
    // Build the variants object literal
    const variantEntries = Object.entries(variants)
      .map(([varName, options]) => {
        const optionEntries = options
          .map(opt => `      ${opt}: "some-class-${opt}"`)
          .join(',\n')
        return `    ${varName}: {\n${optionEntries}\n    }`
      })
      .join(',\n')

    // Build class strings that contain token references, spacing, and radius
    const allClasses = [
      ...tokenClasses,
      ...spacingClasses,
      ...radiusClasses
    ].join(' ')

    return `
import { cva } from "class-variance-authority"

const ${componentName.toLowerCase()}Variants = cva("${allClasses}", {
  variants: {
${variantEntries}
  },
  defaultVariants: {}
})

export function ${componentName}() {
  return null
}
`
  }

  it('extracts all variant names and options from synthetic cva() calls', () => {
    fc.assert(
      fc.property(
        // Generate 1-4 unique variant names, each with 1-5 unique options
        fc
          .uniqueArray(arbVariantName, { minLength: 1, maxLength: 4 })
          .chain(variantNames =>
            fc.tuple(
              fc.constant(variantNames),
              fc.tuple(
                ...variantNames.map(() =>
                  fc.uniqueArray(arbOptionName, { minLength: 1, maxLength: 5 })
                )
              )
            )
          ),
        ([variantNames, optionArrays]) => {
          const variants: Record<string, string[]> = {}
          variantNames.forEach((name, i) => {
            variants[name] = optionArrays[i]
          })

          const componentName = 'TestComp'
          const source = buildSyntheticSource(
            componentName,
            variants,
            [],
            [],
            []
          )

          // Write to temp file
          const tmpDir = os.tmpdir()
          const tmpFile = path.join(
            tmpDir,
            `test-comp-${Date.now()}-${Math.random().toString(36).slice(2)}.tsx`
          )
          fs.writeFileSync(tmpFile, source)
          tmpFiles.push(tmpFile)

          const manifest = extractManifest(tmpFile)

          // (a) Every variant name appears in manifest.variants
          for (const varName of variantNames) {
            expect(manifest.variants).toHaveProperty(varName)
          }

          // (b) Every option value for each variant appears in the corresponding array
          for (const [varName, options] of Object.entries(variants)) {
            for (const opt of options) {
              expect(manifest.variants[varName]).toContain(opt)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('extracts all design token references from synthetic Tailwind classes', () => {
    fc.assert(
      fc.property(
        // Generate 1-5 unique token class strings (prefix-tokenName)
        fc.uniqueArray(
          fc.tuple(arbTokenPrefix, arbTokenName).map(([prefix, token]) => ({
            className: `${prefix}-${token}`,
            tokenName: token
          })),
          {
            minLength: 1,
            maxLength: 5,
            comparator: (a, b) => a.className === b.className
          }
        ),
        tokenEntries => {
          const tokenClasses = tokenEntries.map(e => e.className)
          const expectedTokens = [
            ...new Set(tokenEntries.map(e => e.tokenName))
          ]

          const componentName = 'TokenComp'
          const source = buildSyntheticSource(
            componentName,
            { style: ['normal'] },
            tokenClasses,
            [],
            []
          )

          const tmpDir = os.tmpdir()
          const tmpFile = path.join(
            tmpDir,
            `token-comp-${Date.now()}-${Math.random().toString(36).slice(2)}.tsx`
          )
          fs.writeFileSync(tmpFile, source)
          tmpFiles.push(tmpFile)

          const manifest = extractManifest(tmpFile)

          // (c) Every design token referenced appears in manifest.tokenReferences
          for (const token of expectedTokens) {
            expect(manifest.tokenReferences).toContain(token)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('extracts all spacing and radius classes from synthetic source', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(arbSpacingClass, { minLength: 1, maxLength: 5 }),
        fc.uniqueArray(arbRadiusClass, { minLength: 1, maxLength: 3 }),
        (spacingClasses, radiusClasses) => {
          const componentName = 'LayoutComp'
          const source = buildSyntheticSource(
            componentName,
            { mode: ['default'] },
            [],
            spacingClasses,
            radiusClasses
          )

          const tmpDir = os.tmpdir()
          const tmpFile = path.join(
            tmpDir,
            `layout-comp-${Date.now()}-${Math.random().toString(36).slice(2)}.tsx`
          )
          fs.writeFileSync(tmpFile, source)
          tmpFiles.push(tmpFile)

          const manifest = extractManifest(tmpFile)

          // (d) Every spacing class appears in manifest.spacingClasses
          for (const cls of spacingClasses) {
            expect(manifest.spacingClasses).toContain(cls)
          }

          // (d) Every radius class appears in manifest.radiusClasses
          for (const cls of radiusClasses) {
            expect(manifest.radiusClasses).toContain(cls)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
