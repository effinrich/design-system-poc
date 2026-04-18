// Core data models for bidirectional sync tooling
// All types use the `type` keyword for verbatimModuleSyntax compatibility

// --- ComponentManifest ---

export type PropDefinition = {
  name: string
  type: string
  required: boolean
  defaultValue?: string
}

export type ComponentManifest = {
  /** Component display name, e.g. "Button" */
  componentName: string
  /** File path relative to project root */
  filePath: string
  /** Exported props with TypeScript types */
  props: PropDefinition[]
  /** Variant definitions from cva() */
  variants: Record<string, string[]>
  /** Default variant values */
  defaultVariants: Record<string, string>
  /** Design token names referenced in Tailwind classes */
  tokenReferences: string[]
  /** Tailwind spacing classes used (gap-*, p-*, px-*, py-*) */
  spacingClasses: string[]
  /** Tailwind radius classes used (rounded-*) */
  radiusClasses: string[]
  /** Sub-components exported from the same file */
  subComponents: string[]
}

// --- FigmaSnapshot ---

export type ColorBinding = {
  /** Where the color is applied: fill, stroke, or text */
  target: 'fill' | 'stroke' | 'text'
  /** Layer path within the component */
  layerPath: string
  /** Token name if bound to a variable, null if hardcoded */
  tokenName: string | null
  /** Hex color value (always present, resolved from variable or hardcoded) */
  hexValue: string
}

export type SpacingValues = {
  layoutMode: 'horizontal' | 'vertical' | 'none'
  itemSpacing: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
}

export type LayerSummary = {
  name: string
  type: string
  children?: LayerSummary[]
}

export type FigmaSnapshot = {
  /** Figma node ID */
  nodeId: string
  /** Component name in Figma */
  componentName: string
  /** Variant properties and their values */
  variants: Record<string, string[]>
  /** Color bindings: token name when variable-bound, hex when hardcoded */
  colors: ColorBinding[]
  /** Auto-layout spacing values in px */
  spacing: SpacingValues
  /** Corner radius in px */
  cornerRadius: number | number[]
  /** Layer structure summary */
  layers: LayerSummary[]
}

// --- DriftReport ---

export type Difference = {
  type: 'color' | 'spacing' | 'radius' | 'variant' | 'prop'
  propertyPath: string
  codeValue: string | null
  figmaValue: string | null
  description: string
}

export type DriftEntry = {
  componentName: string
  filePath: string
  figmaNodeId: string | null
  status: 'in-sync' | 'drifted' | 'unlinked'
  differences: Difference[]
}

export type TokenDrift = {
  tokenName: string
  cssValue: string
  figmaValue: string
  cssHex: string
  figmaHex: string
  mode: 'light' | 'dark'
}

export type DriftReport = {
  /** ISO 8601 timestamp of when the report was generated */
  generatedAt: string
  /** Per-component drift entries */
  components: DriftEntry[]
  /** Token-level drift (src/index.css vs Figma variables) */
  tokens: TokenDrift[]
  /** Summary counts */
  summary: {
    totalComponents: number
    inSync: number
    drifted: number
    unlinked: number
    totalDifferences: number
  }
}

// --- ComponentMap ---

export type ComponentMapEntry = {
  filePath: string
  figmaNodeId: string | null
  figmaPageName: string | null
  componentName: string
  lastSyncedAt: string | null
  lastSyncDirection: 'code-to-figma' | 'figma-to-code' | null
}

export type ComponentMap = {
  version: 1
  figmaFileKey: string
  entries: ComponentMapEntry[]
}

// --- DesignToken ---

export type DesignToken = {
  name: string
  lightValue: string // OKLCH string from CSS or hex from Figma
  darkValue: string // OKLCH string from CSS or hex from Figma
  lightHex: string // Normalized hex for comparison
  darkHex: string // Normalized hex for comparison
  source: 'css' | 'figma'
}

// --- SyncResult ---

export type SyncResult = {
  /** Whether the sync operation succeeded */
  success: boolean
  /** Component that was synced */
  componentName: string
  /** Direction of the sync */
  direction: 'code-to-figma' | 'figma-to-code'
  /** Number of changes applied */
  changesApplied: number
  /** Error details if the sync failed */
  errors: string[]
}
