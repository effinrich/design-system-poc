# Implementation Plan: Bidirectional Sync Tooling

## Overview

This plan implements bidirectional synchronization tooling between the React codebase and Figma design system. The implementation is structured in layers: first the data models and core extraction logic, then the comparison/sync engines, then the CLI and hook interfaces. Each task builds incrementally so that nothing is orphaned — every module is wired into the system by the end.

## Tasks

- [x] 1. Set up test infrastructure and core data models
  - [x] 1.1 Add Vitest, fast-check, and ts-morph dependencies
    - Install `vitest`, `@fast-check/vitest`, `fast-check`, `ts-morph`, and `culori` as dev/production dependencies
    - Add `"test": "vitest --run"` script to `package.json`
    - Create `vitest.config.ts` extending the existing `vite.config.ts`
    - Verify the test runner works with a trivial test
    - _Requirements: 2.4, 7.3_

  - [x] 1.2 Create core TypeScript interfaces and data models
    - Create `src/sync/types.ts` with all interfaces: `ComponentManifest`, `PropDefinition`, `FigmaSnapshot`, `ColorBinding`, `SpacingValues`, `LayerSummary`, `DriftReport`, `DriftEntry`, `Difference`, `TokenDrift`, `ComponentMap`, `ComponentMapEntry`, `DesignToken`, `SyncResult`
    - Create `src/sync/constants.ts` with `SPACING_MAP`, `RADIUS_MAP`, and `TOKEN_PATTERN` regex
    - _Requirements: 1.3, 2.1, 3.1, 4.2_

  - [x] 1.3 Write property tests for data model serialization round-trips
    - **Property 1: ComponentManifest serialization round-trip**
    - **Validates: Requirements 2.5, 2.6, 2.7**
    - **Property 2: FigmaSnapshot serialization round-trip**
    - **Validates: Requirements 3.4, 3.5, 3.6**
    - **Property 3: DriftReport serialization round-trip**
    - **Validates: Requirements 4.6**
    - Create `src/sync/__tests__/serialization.test.ts` with fast-check arbitraries for each data model
    - Each property test runs minimum 100 iterations

- [x] 2. Implement Manifest Extractor
  - [x] 2.1 Implement the Manifest Extractor module
    - Create `src/sync/manifest-extractor.ts` implementing the `ManifestExtractor` interface
    - Use ts-morph to parse component files: find `cva()` call expressions, extract `variants` object keys/values, extract `defaultVariants`
    - Extract prop definitions from the component function's parameter type
    - Scan all string literals and template expressions for Tailwind token references using `TOKEN_PATTERN`
    - Extract spacing classes (`gap-*`, `p-*`, `px-*`, `py-*`) and radius classes (`rounded-*`)
    - Detect sub-components exported from the same file
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [-] 2.2 Write property test for Manifest Extractor
    - **Property 4: Manifest extraction captures all component metadata**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Create `src/sync/__tests__/manifest-extractor.test.ts`
    - Generate synthetic React component source strings with `cva()` calls and verify extraction completeness

  - [x] 2.3 Write unit tests for Manifest Extractor with real components
    - Test extraction against `src/components/ui/button.tsx` (6 variants, 8 sizes)
    - Test extraction against `src/components/ui/badge.tsx` (6 variants, no size)
    - Test extraction against `src/components/dashboard/StatCard.tsx` (no cva, props-only)
    - Tests exist in `src/sync/__tests__/manifest-extractor.test.ts` (all passing)
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Implement color normalization and value mapping
  - [x] 3.1 Implement color normalization pipeline
    - Create `src/sync/color-utils.ts` with functions: `parseOKLCH(oklchString) → hex`, `figmaRGBToHex({r, g, b}) → hex`, `colorsMatch(hex1, hex2, tolerance?) → boolean`
    - Use `culori` for OKLCH parsing and sRGB conversion
    - Normalize Figma RGB floats (0-1) to 0-255 integers then to 6-digit hex
    - _Requirements: 3.3, 6.3_

  - [~] 3.2 Write property test for color normalization
    - **Property 5: Color normalization consistency**
    - **Validates: Requirements 3.3**
    - Create `src/sync/__tests__/color-normalization.test.ts`
    - Generate OKLCH strings and their mathematically equivalent RGB, verify hex output matches within ±1 per channel

  - [x] 3.3 Implement Tailwind-to-Figma value mapping utilities
    - Create `src/sync/value-mapping.ts` with functions: `tailwindToPx(className) → number`, `pxToTailwind(value, type) → string`, using `SPACING_MAP` and `RADIUS_MAP` from constants
    - _Requirements: 6.3, 6.4_

  - [~] 3.4 Write property test for value mapping round-trip
    - **Property 9: Figma-to-Tailwind value mapping round-trip**
    - **Validates: Requirements 6.3, 6.4**
    - Create `src/sync/__tests__/value-mapping.test.ts`
    - For every key in SPACING_MAP and RADIUS_MAP, verify class → px → class round-trip

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Figma Snapshot Extractor and MCP Adapter
  - [x] 5.1 Implement the Figma MCP Adapter
    - Create `src/sync/adapters/figma-mcp.ts` implementing the `FigmaMCPAdapter` interface
    - Wrap each MCP tool call (`get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs`, `search_design_system`, `use_figma`) with error handling and 10-second timeout detection
    - Implement retry logic for transient failures
    - Handle 20KB output limit: detect truncation and fall back to `get_metadata` + sub-node re-fetch
    - _Requirements: 3.2, 12.1, 12.3_

  - [x] 5.2 Implement the Snapshot Extractor module
    - Create `src/sync/snapshot-extractor.ts` implementing the `SnapshotExtractor` interface
    - Parse `get_design_context` response to extract variant properties, color bindings (token name or hex), auto-layout spacing, corner radius, and layer structure
    - Call `get_variable_defs` for token name resolution when colors are variable-bound
    - _Requirements: 3.1, 3.2, 3.3_

  - [~] 5.3 Write unit tests for Snapshot Extractor with mock MCP responses
    - Create `src/sync/__tests__/snapshot-extractor.test.ts` with pre-recorded MCP responses
    - Test extraction of variant properties, color bindings, spacing, and radius
    - Test 20KB fallback path with truncated response mock
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Implement Drift Detector
  - [x] 6.1 Implement the Drift Detector module
    - Create `src/sync/drift-detector.ts` implementing the `DriftDetector` interface
    - Compare variants: same names and option values between manifest and snapshot
    - Compare colors: token-name equality when variable-bound, hex equality (via color-utils) when hardcoded
    - Compare spacing: convert Tailwind classes to px via value-mapping, compare against Figma auto-layout values
    - Compare radius: convert Tailwind rounded-* classes to px, compare against Figma cornerRadius
    - Mark components as "in-sync", "drifted", or "unlinked" (null figmaNodeId)
    - Produce summary counts: totalComponents, inSync, drifted, unlinked, totalDifferences
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [~] 6.2 Write property tests for Drift Detector
    - **Property 6: Drift detection completeness**
    - **Validates: Requirements 4.1, 4.4**
    - **Property 7: Drift differences are well-formed**
    - **Validates: Requirements 4.2, 4.3**
    - **Property 8: Drift detection idempotence**
    - **Validates: Requirements 4.7**
    - Create `src/sync/__tests__/drift-detector.test.ts`
    - Generate random manifest/snapshot pairs and verify completeness, well-formedness, and idempotence

  - [~] 6.3 Write unit tests for Drift Detector edge cases
    - Test identical manifest and snapshot → "in-sync" with empty differences
    - Test null figmaNodeId → "unlinked" status
    - Test hardcoded hex color with no matching token → flagged difference
    - Test variant present in code but not Figma, and vice versa
    - _Requirements: 4.1, 4.4, 4.5_

- [x] 7. Implement Token Syncer
  - [x] 7.1 Implement the Token Syncer module
    - Create `src/sync/token-syncer.ts` implementing the `TokenSyncer` interface
    - Parse `src/index.css` to extract `:root` and `.dark` blocks with `--token-name: oklch(...)` declarations
    - Extract Figma tokens via `get_variable_defs` through the MCP adapter
    - Compare CSS tokens against Figma tokens using normalized hex values
    - Implement `syncTokenToFigma` (generate `use_figma` script to update variable) and `syncTokenToCSS` (modify CSS custom property in file)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [~] 7.2 Write property test for CSS token extraction
    - **Property 12: CSS token extraction completeness**
    - **Validates: Requirements 11.1, 11.2**
    - Create `src/sync/__tests__/token-syncer.test.ts`
    - Generate synthetic CSS files with `:root` and `.dark` blocks, verify all tokens are extracted with both light and dark values

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Code-to-Figma Syncer
  - [x] 9.1 Implement the Code-to-Figma Syncer module
    - Create `src/sync/code-to-figma.ts` implementing the `CodeToFigmaSyncer` interface
    - Generate `use_figma` Plugin API JavaScript for: variant additions/removals, color token rebinding, spacing adjustments, corner radius changes
    - Implement chunking strategy: each `use_figma` call handles one change type, batch up to 5 variant additions per call, estimate output size and split at ~15KB
    - Handle orphaned variant detection (variant removed in code but exists in Figma) — flag for user confirmation
    - Update `lastSyncedAt` and `lastSyncDirection` in Component_Map on success
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [~] 9.2 Write unit tests for Code-to-Figma Syncer
    - Test `use_figma` script generation for adding a new variant
    - Test chunking when operations exceed 15KB estimate
    - Test error handling when `use_figma` call fails (Component_Map not updated)
    - _Requirements: 5.2, 5.3, 5.7_

- [x] 10. Implement Figma-to-Code Syncer
  - [x] 10.1 Implement the Figma-to-Code Syncer module
    - Create `src/sync/figma-to-code.ts` implementing the `FigmaToCodeSyncer` interface
    - Use ts-morph to modify component AST: update `cva` variants object, replace Tailwind class strings for color/spacing/radius changes
    - Add new variant definitions when variant exists in Figma but not code
    - Flag hardcoded hex colors with no matching token — prompt user before applying
    - Update `lastSyncedAt` and `lastSyncDirection` in Component_Map on success
    - Write modified file back using ts-morph `saveSync()`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [~] 10.2 Write unit tests for Figma-to-Code Syncer
    - Test Tailwind class replacement for color token changes
    - Test cva variant object modification for new variant addition
    - Test file write failure handling (original file unchanged)
    - _Requirements: 6.3, 6.5, 12.2_

- [x] 11. Implement Story Generator
  - [x] 11.1 Implement the Story Generator module
    - Create `src/sync/story-generator.ts` implementing the `StoryGenerator` interface
    - Implement template-based generation: create `Meta` object with `title` (based on atomic design level from file path), `component`, `parameters`, `tags: ["autodocs"]`, `argTypes` from manifest variants
    - Generate one story per variant option with a `play` function using `expect`, `within`, `userEvent`, `fn` from `storybook/test`
    - Implement Storybook MCP path: pass component file path, manifest JSON, and project conventions when MCP is available
    - Implement merge strategy: parse existing story file for exported story names, only add stories for new variants, preserve manually written stories
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [~] 11.2 Write property test for story generation variant coverage
    - **Property 10: Story generation covers all variants**
    - **Validates: Requirements 7.2, 7.3**
    - Create `src/sync/__tests__/story-generator.test.ts`
    - Generate random manifests with variants, verify output contains Meta with autodocs tag, one story per variant option, and play functions

  - [~] 11.3 Write property test for story merge preservation
    - **Property 11: Story merge preserves manual stories**
    - **Validates: Requirements 7.4**
    - Generate existing story files with manual stories, merge with new auto-generated stories, verify manual stories are preserved

  - [~] 11.4 Write unit tests for Story Generator
    - Test template-based generation output structure for Button component
    - Test merge with existing `src/stories/atoms/Button.stories.tsx`
    - Test Storybook MCP fallback when MCP is unavailable
    - _Requirements: 7.1, 7.4, 7.5_

- [x] 12. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement Component Map and sync logging
  - [x] 13.1 Implement Component Map operations
    - Create `src/sync/component-map.ts` with functions: `loadComponentMap()`, `saveComponentMap()`, `initComponentMap()` (scan `src/components/ui/` and `src/components/dashboard/`, match to Figma via `search_design_system`), `updateEntry()`
    - Handle missing `component-map.json` by triggering init flow
    - Mark unmatched components with null `figmaNodeId`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 13.2 Implement sync logging
    - Create `src/sync/sync-logger.ts` with functions to append structured log entries to `.kiro/sync/sync.log`
    - Log format: `[ISO8601] TYPE component=Name direction=dir result=status error="details"`
    - Support log types: SYNC, STORY, DRIFT, TOKEN, INIT
    - _Requirements: 12.6_

  - [~] 13.3 Write unit tests for Component Map operations
    - Test `loadComponentMap` with existing and missing file
    - Test `initComponentMap` scanning component directories
    - Test `updateEntry` modifying lastSyncedAt and lastSyncDirection
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [x] 14. Implement CLI interface
  - [x] 14.1 Implement CLI entry point and subcommand routing
    - Create `src/sync/cli.ts` as the CLI entry point, invoked via `npx tsx src/sync/cli.ts <subcommand>`
    - Parse `process.argv` directly (no CLI framework)
    - Route to subcommand handlers: `init`, `drift`, `push`, `pull`, `stories`, `all`
    - Handle `--json`, `--direction`, `--dry-run`, and `[component-name]` arguments
    - Print descriptive error messages to stderr and exit with non-zero code on errors
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 14.2 Implement the `sync all` orchestrator command
    - Wire the full pipeline: load Component_Map → extract manifests → extract snapshots → compute drift → present report → prompt for direction (or use `--direction` flag) → execute sync → generate stories → update Component_Map → print summary
    - Support `--dry-run` flag to print planned operations without executing
    - Print completion summary: components synced, directions, stories generated, errors
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [~] 14.3 Write unit tests for CLI argument parsing
    - Test each subcommand routes correctly
    - Test `--json`, `--direction`, `--dry-run` flag parsing
    - Test error output for unknown subcommands
    - _Requirements: 9.1, 9.7_

- [x] 15. Create Kiro hooks
  - [x] 15.1 Create all four Kiro hooks
    - Create `component-drift-check` hook: `eventType: "fileEdited"`, `filePatterns: "src/components/ui/*.tsx, src/components/dashboard/*.tsx"`, `hookAction: "askAgent"` — extracts manifest, runs drift detection, offers code-to-figma sync
    - Create `full-drift-scan` hook: `eventType: "userTriggered"`, `hookAction: "askAgent"` — runs drift detection across all components in Component_Map
    - Create `figma-pull` hook: `eventType: "userTriggered"`, `hookAction: "askAgent"` — runs figma-to-code sync for specified or all drifted components
    - Create `post-sync-stories` hook: `eventType: "postTaskExecution"`, `hookAction: "askAgent"` — generates stories for affected components after sync tasks
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 16. Integration wiring and error handling
  - [x] 16.1 Wire Sync Engine orchestration
    - Create `src/sync/engine.ts` as the main Sync_Engine entry point that coordinates all modules
    - Export functions: `runDriftDetection()`, `runCodeToFigmaSync()`, `runFigmaToCodeSync()`, `runTokenSync()`, `runStoryGeneration()`, `runFullPipeline()`
    - Inject adapters (FigmaMCPAdapter, file system) as dependencies for testability
    - Implement error recovery: log failures, skip failed components, continue remaining, don't update Component_Map for failed syncs
    - _Requirements: 5.7, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [~] 16.2 Write integration tests for Sync Engine
    - Test full pipeline with mock adapters (MockFigmaMCPAdapter, MockFileSystem)
    - Test error recovery: MCP failure skips component, file write failure leaves original unchanged
    - Test Storybook MCP fallback to template generation
    - _Requirements: 12.1, 12.2, 12.4, 12.5_

- [x] 17. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each major layer
- Property tests validate the 12 universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and error handling
- All Figma operations go through the MCP adapter — no direct REST API calls
- The implementation language is TypeScript throughout, matching the existing codebase
- Existing tests: 5 test files with 92 passing tests (setup, color-utils, manifest-extractor, value-mapping, figma-mcp)
