import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type {
  ComponentManifest,
  PropDefinition,
  FigmaSnapshot,
  ColorBinding,
  SpacingValues,
  LayerSummary,
  DriftReport,
  DriftEntry,
  Difference,
  TokenDrift
} from '../types'

// --- Helpers ---

const hexChars = '0123456789abcdef'
const arbHexColor = fc
  .stringOf(fc.constantFrom(...hexChars.split('')), {
    minLength: 6,
    maxLength: 6
  })
  .map(s => `#${s}`)

// --- Arbitraries ---

const arbPropDefinition: fc.Arbitrary<PropDefinition> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 20 }),
  type: fc.oneof(
    fc.constant('string'),
    fc.constant('number'),
    fc.constant('boolean'),
    fc.constant('React.ReactNode'),
    fc.constant('() => void')
  ),
  required: fc.boolean(),
  defaultValue: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
    nil: undefined
  })
})

const arbComponentManifest: fc.Arbitrary<ComponentManifest> = fc.record({
  componentName: fc
    .string({ minLength: 1, maxLength: 30 })
    .filter(s => /^[A-Z]/.test(s)),
  filePath: fc.constant('src/components/ui/').chain(prefix =>
    fc
      .string({ minLength: 1, maxLength: 20 })
      .filter(s => /^[a-z]/.test(s))
      .map(name => `${prefix}${name}.tsx`)
  ),
  props: fc.array(arbPropDefinition, { minLength: 0, maxLength: 5 }),
  variants: fc.dictionary(
    fc.string({ minLength: 1, maxLength: 15 }).filter(s => /^[a-z]/.test(s)),
    fc.array(fc.string({ minLength: 1, maxLength: 15 }), {
      minLength: 1,
      maxLength: 8
    })
  ),
  defaultVariants: fc.dictionary(
    fc.string({ minLength: 1, maxLength: 15 }).filter(s => /^[a-z]/.test(s)),
    fc.string({ minLength: 1, maxLength: 15 })
  ),
  tokenReferences: fc.array(
    fc.oneof(
      fc.constant('primary'),
      fc.constant('secondary'),
      fc.constant('muted-foreground'),
      fc.constant('destructive'),
      fc.constant('accent'),
      fc.constant('background'),
      fc.constant('border'),
      fc.constant('ring')
    ),
    { minLength: 0, maxLength: 6 }
  ),
  spacingClasses: fc.array(
    fc.oneof(
      fc.constant('gap-1'),
      fc.constant('gap-2'),
      fc.constant('gap-4'),
      fc.constant('p-4'),
      fc.constant('px-6'),
      fc.constant('py-2'),
      fc.constant('px-3'),
      fc.constant('py-1')
    ),
    { minLength: 0, maxLength: 4 }
  ),
  radiusClasses: fc.array(
    fc.oneof(
      fc.constant('rounded-md'),
      fc.constant('rounded-lg'),
      fc.constant('rounded-xl'),
      fc.constant('rounded-full'),
      fc.constant('rounded-sm')
    ),
    { minLength: 0, maxLength: 3 }
  ),
  subComponents: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
    minLength: 0,
    maxLength: 4
  })
})

const arbColorBinding: fc.Arbitrary<ColorBinding> = fc.record({
  target: fc.oneof(
    fc.constant('fill' as const),
    fc.constant('stroke' as const),
    fc.constant('text' as const)
  ),
  layerPath: fc.string({ minLength: 1, maxLength: 40 }),
  tokenName: fc.option(fc.string({ minLength: 1, maxLength: 20 }), {
    nil: null
  }),
  hexValue: arbHexColor
})

const arbSpacingValues: fc.Arbitrary<SpacingValues> = fc.record({
  layoutMode: fc.oneof(
    fc.constant('horizontal' as const),
    fc.constant('vertical' as const),
    fc.constant('none' as const)
  ),
  itemSpacing: fc.nat({ max: 64 }),
  paddingTop: fc.nat({ max: 64 }),
  paddingRight: fc.nat({ max: 64 }),
  paddingBottom: fc.nat({ max: 64 }),
  paddingLeft: fc.nat({ max: 64 })
})

const arbLayerSummary: fc.Arbitrary<LayerSummary> = fc.letrec(tie => ({
  leaf: fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    type: fc.oneof(
      fc.constant('FRAME'),
      fc.constant('TEXT'),
      fc.constant('RECTANGLE'),
      fc.constant('INSTANCE')
    )
  }),
  node: fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    type: fc.oneof(
      fc.constant('FRAME'),
      fc.constant('GROUP'),
      fc.constant('COMPONENT')
    ),
    children: fc.array(tie('leaf'), { minLength: 0, maxLength: 3 })
  })
})).node as fc.Arbitrary<LayerSummary>

const arbFigmaSnapshot: fc.Arbitrary<FigmaSnapshot> = fc.record({
  nodeId: fc
    .string({ minLength: 3, maxLength: 15 })
    .map(
      s => `${s.replace(/[^0-9]/g, '1')}:${Math.floor(Math.random() * 999)}`
    ),
  componentName: fc
    .string({ minLength: 1, maxLength: 30 })
    .filter(s => /^[A-Z]/.test(s)),
  variants: fc.dictionary(
    fc.string({ minLength: 1, maxLength: 15 }).filter(s => /^[a-z]/.test(s)),
    fc.array(fc.string({ minLength: 1, maxLength: 15 }), {
      minLength: 1,
      maxLength: 8
    })
  ),
  colors: fc.array(arbColorBinding, { minLength: 0, maxLength: 5 }),
  spacing: arbSpacingValues,
  cornerRadius: fc.oneof(
    fc.nat({ max: 100 }),
    fc.array(fc.nat({ max: 100 }), { minLength: 4, maxLength: 4 })
  ),
  layers: fc.array(arbLayerSummary, { minLength: 0, maxLength: 4 })
})

const arbDifference: fc.Arbitrary<Difference> = fc
  .record({
    type: fc.oneof(
      fc.constant('color' as const),
      fc.constant('spacing' as const),
      fc.constant('radius' as const),
      fc.constant('variant' as const),
      fc.constant('prop' as const)
    ),
    propertyPath: fc.string({ minLength: 1, maxLength: 40 }),
    codeValue: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
      nil: null
    }),
    figmaValue: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
      nil: null
    }),
    description: fc.string({ minLength: 1, maxLength: 80 })
  })
  .filter(d => d.codeValue !== null || d.figmaValue !== null)

const arbDriftEntry: fc.Arbitrary<DriftEntry> = fc.record({
  componentName: fc.string({ minLength: 1, maxLength: 30 }),
  filePath: fc.string({ minLength: 5, maxLength: 50 }),
  figmaNodeId: fc.option(fc.string({ minLength: 3, maxLength: 15 }), {
    nil: null
  }),
  status: fc.oneof(
    fc.constant('in-sync' as const),
    fc.constant('drifted' as const),
    fc.constant('unlinked' as const)
  ),
  differences: fc.array(arbDifference, { minLength: 0, maxLength: 5 })
})

const arbTokenDrift: fc.Arbitrary<TokenDrift> = fc.record({
  tokenName: fc.string({ minLength: 1, maxLength: 20 }),
  cssValue: fc.string({ minLength: 5, maxLength: 40 }),
  figmaValue: fc.string({ minLength: 5, maxLength: 40 }),
  cssHex: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
  figmaHex: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
  mode: fc.oneof(fc.constant('light' as const), fc.constant('dark' as const))
})

const arbDriftReport: fc.Arbitrary<DriftReport> = fc
  .tuple(
    fc.array(arbDriftEntry, { minLength: 0, maxLength: 6 }),
    fc.array(arbTokenDrift, { minLength: 0, maxLength: 4 })
  )
  .map(([components, tokens]) => {
    const inSync = components.filter(c => c.status === 'in-sync').length
    const drifted = components.filter(c => c.status === 'drifted').length
    const unlinked = components.filter(c => c.status === 'unlinked').length
    const totalDifferences = components.reduce(
      (sum, c) => sum + c.differences.length,
      0
    )
    return {
      generatedAt: new Date().toISOString(),
      components,
      tokens,
      summary: {
        totalComponents: components.length,
        inSync,
        drifted,
        unlinked,
        totalDifferences
      }
    }
  })

// --- Property Tests ---

describe('serialization round-trips', () => {
  // Feature: bidirectional-sync-tooling, Property 1: ComponentManifest serialization round-trip
  it('Property 1: ComponentManifest serializes and deserializes to a deeply equal object', () => {
    // Validates: Requirements 2.5, 2.6, 2.7
    fc.assert(
      fc.property(arbComponentManifest, manifest => {
        const json = JSON.stringify(manifest)
        const deserialized = JSON.parse(json) as ComponentManifest
        expect(deserialized).toStrictEqual(manifest)
      }),
      { numRuns: 100 }
    )
  })

  // Feature: bidirectional-sync-tooling, Property 2: FigmaSnapshot serialization round-trip
  it('Property 2: FigmaSnapshot serializes and deserializes to a deeply equal object', () => {
    // Validates: Requirements 3.4, 3.5, 3.6
    fc.assert(
      fc.property(arbFigmaSnapshot, snapshot => {
        const json = JSON.stringify(snapshot)
        const deserialized = JSON.parse(json) as FigmaSnapshot
        expect(deserialized).toStrictEqual(snapshot)
      }),
      { numRuns: 100 }
    )
  })

  // Feature: bidirectional-sync-tooling, Property 3: DriftReport serialization round-trip
  it('Property 3: DriftReport serializes and deserializes to a deeply equal object', () => {
    // Validates: Requirements 4.6
    fc.assert(
      fc.property(arbDriftReport, report => {
        const json = JSON.stringify(report)
        const deserialized = JSON.parse(json) as DriftReport
        expect(deserialized).toStrictEqual(report)
      }),
      { numRuns: 100 }
    )
  })
})
