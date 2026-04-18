# Requirements Document

## Introduction

This feature covers bidirectional synchronization tooling between the React codebase and the Figma design system, plus automated Storybook story/test generation triggered by sync events. The project has a complete design system POC: Vite + React + TypeScript + shadcn/ui v4 + Tailwind CSS v4, with 14 UI primitives and 5 dashboard compositions, all mirrored in a Figma file (key: `uDSGcEd2obHYrbp2DfcNxO`) containing 19 design token color variables with Light/Dark modes.

Today, syncing between code and Figma is manual — a developer runs MCP tool calls by hand. This feature automates that workflow into reusable developer tooling: detect drift between code and Figma, sync changes in either direction, and auto-generate Storybook stories with interaction tests whenever a component changes.

The tooling is implemented as a combination of Kiro hooks (triggered on file events), CLI scripts (runnable on demand), and an orchestrator that ties drift detection, sync, and story generation into a single workflow. All Figma operations go through the Figma MCP server tools, subject to the 20KB output limit per `use_figma` call.

## Glossary

- **Sync_Engine**: The core module that coordinates reading component state from code and Figma, computing differences, and dispatching sync operations in either direction.
- **Figma_MCP**: The Figma MCP server connected to the IDE, exposing tools: `use_figma`, `get_design_context`, `get_screenshot`, `generate_figma_design`, `search_design_system`, `create_design_system_rules`, `get_variable_defs`, `get_metadata`.
- **Storybook_MCP**: The user's existing Storybook MCP server that can generate stories and interaction tests for React components.
- **Figma_File**: The target Figma file with key `uDSGcEd2obHYrbp2DfcNxO`.
- **Component_Manifest**: A JSON data structure that describes a React component's current state — file path, exported name, props/variants, design token usage, and Tailwind spacing/radius values — used as the canonical representation for comparison.
- **Figma_Snapshot**: A JSON data structure extracted from `get_design_context` that describes a Figma component's current state — variant properties, fill/stroke/text color bindings, auto-layout spacing, corner radius, and layer structure.
- **Drift_Report**: A structured comparison output listing all differences between a Component_Manifest and its corresponding Figma_Snapshot, categorized by property type (color, spacing, variant, prop).
- **Component_Map**: A registry that associates each React component file path with its corresponding Figma node ID and page location, stored as a JSON file in the project.
- **Design_Token**: A named color variable defined in the Figma file under Light/Dark mode collections (19 tokens currently exist), corresponding to CSS custom properties in `src/index.css`.
- **Kiro_Hook**: An automated action triggered by an IDE event (file edit, file create, manual trigger) that runs an agent prompt or shell command.
- **Sync_Direction**: Either `code-to-figma` (push code changes to Figma) or `figma-to-code` (pull Figma changes into code).
- **Story_Generator**: The module responsible for producing Storybook story files with interaction tests, either via the Storybook_MCP or via template-based generation.

---

## Requirements

### Requirement 1: Component Map Registry

**User Story:** As a developer, I want a persistent registry that maps each React component to its Figma counterpart, so that sync tooling knows which code file corresponds to which Figma node without manual lookup.

#### Acceptance Criteria

1. THE Sync_Engine SHALL maintain a Component_Map as a JSON file at `.kiro/sync/component-map.json` that maps each React component file path to a Figma node ID, Figma page name, and component display name.
2. WHEN a new component is added to `src/components/ui/` or `src/components/dashboard/`, THE Sync_Engine SHALL detect the addition and prompt the user to associate it with a Figma node ID or create a new Figma component.
3. THE Component_Map SHALL store the following fields for each entry: `filePath`, `figmaNodeId`, `figmaPageName`, `componentName`, `lastSyncedAt` (ISO 8601 timestamp), and `lastSyncDirection`.
4. WHEN the Component_Map file does not exist, THE Sync_Engine SHALL generate an initial Component_Map by scanning all component files in `src/components/ui/` and `src/components/dashboard/` and matching them to Figma components via `search_design_system` using component names.
5. IF a React component cannot be matched to a Figma component during initial generation, THEN THE Sync_Engine SHALL include the entry with a null `figmaNodeId` and flag it as unlinked in the Drift_Report.

---

### Requirement 2: Component Manifest Extraction

**User Story:** As a developer, I want the sync tool to automatically extract a structured description of each React component from its source code, so that it can be compared against the Figma representation.

#### Acceptance Criteria

1. THE Sync_Engine SHALL parse each React component file and produce a Component_Manifest containing: component name, exported props with their TypeScript types, variant definitions (extracted from `cva` calls), size definitions, design token CSS variable references, and Tailwind spacing/radius class values.
2. WHEN a component uses `class-variance-authority` (cva), THE Sync_Engine SHALL extract all variant names and their option values from the `variants` object.
3. WHEN a component references design token CSS variables (e.g., `bg-primary`, `text-muted-foreground`), THE Sync_Engine SHALL list all referenced token names in the Component_Manifest.
4. THE Manifest_Extractor SHALL produce a Component_Manifest by parsing the component's TypeScript AST or by pattern-matching against known shadcn/ui conventions (cva variant objects, Tailwind class strings, React prop type definitions).
5. THE Component_Manifest SHALL be serializable to JSON and deserializable back to an equivalent object (round-trip property).
6. THE Manifest_Printer SHALL format Component_Manifest objects back into valid JSON strings.
7. FOR ALL valid Component_Manifest objects, serializing then deserializing SHALL produce an equivalent object.

---

### Requirement 3: Figma Snapshot Extraction

**User Story:** As a developer, I want the sync tool to extract a structured snapshot of each Figma component, so that it can be compared against the code representation.

#### Acceptance Criteria

1. THE Sync_Engine SHALL call `get_design_context` for each Figma node ID in the Component_Map and produce a Figma_Snapshot containing: variant property names and values, fill color bindings (token name or hex), stroke color bindings, text color bindings, auto-layout direction, item spacing, padding values, and corner radius.
2. WHEN the `get_design_context` response exceeds the 20KB output limit, THE Sync_Engine SHALL fall back to calling `get_metadata` first to obtain the node map, then re-fetch only the specific sub-nodes needed.
3. THE Figma_Snapshot SHALL normalize color values to a common format (Design_Token name when bound to a variable, hex string when hardcoded) so that comparisons with Component_Manifest token references are consistent.
4. THE Figma_Snapshot SHALL be serializable to JSON and deserializable back to an equivalent object (round-trip property).
5. THE Snapshot_Printer SHALL format Figma_Snapshot objects back into valid JSON strings.
6. FOR ALL valid Figma_Snapshot objects, serializing then deserializing SHALL produce an equivalent object.

---

### Requirement 4: Drift Detection

**User Story:** As a developer, I want to run a single command that compares all code components against their Figma counterparts and tells me exactly what's out of sync, so that I can decide what to update.

#### Acceptance Criteria

1. THE Sync_Engine SHALL compare each Component_Manifest against its corresponding Figma_Snapshot and produce a Drift_Report listing all differences.
2. THE Drift_Report SHALL categorize each difference by type: `color` (token mismatch or hardcoded vs token-bound), `spacing` (gap, padding, or item-spacing mismatch), `radius` (corner radius mismatch), `variant` (variant exists in code but not Figma, or vice versa), and `prop` (prop exists in code but not mapped in Figma).
3. THE Drift_Report SHALL include for each difference: the component name, the property path, the code value, the Figma value, and the difference type.
4. WHEN no differences are found for a component, THE Drift_Report SHALL mark that component as "in sync".
5. WHEN a component in the Component_Map has a null `figmaNodeId`, THE Drift_Report SHALL list it as "unlinked" with a recommendation to create the Figma component or update the Component_Map.
6. THE Drift_Report SHALL be serializable to JSON and printable as a human-readable summary to the console.
7. THE Drift_Detector SHALL produce identical Drift_Reports when run twice against the same unchanged code and Figma state (idempotence property).

---

### Requirement 5: Code-to-Figma Sync

**User Story:** As a developer, I want to push code component changes to Figma automatically when I edit a component file, so that the Figma design system stays current without manual intervention.

#### Acceptance Criteria

1. WHEN a file in `src/components/ui/` or `src/components/dashboard/` is saved, THE Sync_Engine SHALL extract a fresh Component_Manifest and compare it against the stored Figma_Snapshot for that component.
2. WHEN differences are detected, THE Sync_Engine SHALL generate `use_figma` Plugin API JavaScript that updates the Figma component to match the code changes — including variant additions/removals, color token rebinding, spacing adjustments, and corner radius changes.
3. THE Sync_Engine SHALL split large `use_figma` operations into multiple calls so that no single call produces output exceeding 20KB.
4. WHEN a new variant is added in code that does not exist in Figma, THE Sync_Engine SHALL create the new variant in the Figma Component_Set with the correct properties and token bindings.
5. WHEN a variant is removed in code, THE Sync_Engine SHALL flag the orphaned Figma variant in the Drift_Report and prompt the user for confirmation before deleting it from Figma.
6. AFTER a successful code-to-figma sync, THE Sync_Engine SHALL update the `lastSyncedAt` and `lastSyncDirection` fields in the Component_Map for the affected component.
7. IF a `use_figma` call fails, THEN THE Sync_Engine SHALL log the error, report which properties could not be synced, and leave the Component_Map `lastSyncedAt` unchanged.

---

### Requirement 6: Figma-to-Code Sync

**User Story:** As a developer, I want to pull Figma design changes into my React components, so that design decisions made in Figma are reflected in code without manual translation.

#### Acceptance Criteria

1. WHEN the user triggers a figma-to-code sync for a component, THE Sync_Engine SHALL call `get_design_context` and `get_screenshot` for the target Figma node to obtain the current Figma_Snapshot and a visual reference.
2. THE Sync_Engine SHALL compare the Figma_Snapshot against the current Component_Manifest and identify all differences where the Figma value should take precedence.
3. WHEN a color token binding in Figma differs from the code's Tailwind class, THE Sync_Engine SHALL update the component's Tailwind classes to reference the correct design token (e.g., changing `bg-primary` to `bg-secondary`).
4. WHEN spacing values in Figma differ from the code's Tailwind spacing classes, THE Sync_Engine SHALL update the component's Tailwind gap/padding classes to match the Figma auto-layout values using the project's Tailwind-to-Figma spacing map (gap-1=4px, gap-2=8px, gap-4=16px, gap-6=24px).
5. WHEN a new variant exists in Figma that does not exist in code, THE Sync_Engine SHALL generate the variant definition in the component's `cva` configuration and add the corresponding prop option to the TypeScript type.
6. AFTER a successful figma-to-code sync, THE Sync_Engine SHALL update the `lastSyncedAt` and `lastSyncDirection` fields in the Component_Map for the affected component.
7. IF the Figma_Snapshot contains a hardcoded hex color that does not map to any Design_Token, THEN THE Sync_Engine SHALL flag the color in the Drift_Report and prompt the user to resolve it before applying the change to code.

---

### Requirement 7: Storybook Auto-Generation

**User Story:** As a developer, I want Storybook stories with interaction tests to be automatically generated or updated whenever a component is synced, so that every component change is immediately testable and documented.

#### Acceptance Criteria

1. WHEN a component is synced in either direction (code-to-figma or figma-to-code), THE Story_Generator SHALL generate or update a Storybook story file for that component in the appropriate `src/stories/` subdirectory (`atoms/`, `molecules/`, or `pages/`).
2. THE generated story file SHALL follow the project's existing Storybook conventions: `Meta` with `title`, `component`, `parameters`, `tags: ["autodocs"]`, and `argTypes` matching the component's variant props.
3. THE generated story file SHALL include at least one story per variant defined in the component's `cva` configuration, each with a `play` function containing interaction tests using `expect`, `within`, `userEvent`, and `fn` from `storybook/test`.
4. WHEN a component has existing stories in `src/stories/`, THE Story_Generator SHALL merge new variant stories into the existing file rather than overwriting it, preserving any manually written stories.
5. THE Story_Generator SHALL use the Storybook_MCP when available to generate stories, falling back to template-based generation when the Storybook_MCP is not connected.
6. WHEN the Storybook_MCP is used, THE Story_Generator SHALL pass the component's file path, Component_Manifest, and the project's Storybook conventions (from `.storybook/main.ts` and `.storybook/preview.ts`) as context.
7. THE generated interaction tests SHALL verify that each variant renders visibly and that interactive elements (buttons, inputs) respond to user events.

---

### Requirement 8: Kiro Hook Integration

**User Story:** As a developer, I want sync operations to trigger automatically via Kiro hooks when I edit component files, so that I don't have to remember to run sync commands manually.

#### Acceptance Criteria

1. THE Sync_Engine SHALL provide a Kiro_Hook with `eventType: "fileEdited"` and `filePatterns` matching `src/components/ui/*.tsx, src/components/dashboard/*.tsx` that triggers drift detection for the edited component.
2. WHEN the Kiro_Hook detects drift after a file edit, THE hook's agent prompt SHALL present the Drift_Report to the user and offer to sync code-to-figma.
3. THE Sync_Engine SHALL provide a Kiro_Hook with `eventType: "userTriggered"` that runs the full drift detection across all components in the Component_Map.
4. THE Sync_Engine SHALL provide a Kiro_Hook with `eventType: "userTriggered"` that runs figma-to-code sync for a user-specified component or all components with detected drift.
5. WHEN a sync operation completes via a Kiro_Hook, THE hook SHALL trigger the Story_Generator for the affected component.

---

### Requirement 9: CLI Script Interface

**User Story:** As a developer, I want CLI commands for all sync operations, so that I can run them in CI pipelines, scripts, or when I prefer the terminal over IDE hooks.

#### Acceptance Criteria

1. THE Sync_Engine SHALL provide a CLI command `sync drift` that runs drift detection across all components and prints the Drift_Report to stdout as a human-readable summary.
2. THE Sync_Engine SHALL provide a CLI command `sync drift --json` that outputs the Drift_Report as a JSON object for programmatic consumption.
3. THE Sync_Engine SHALL provide a CLI command `sync push [component-name]` that runs code-to-figma sync for the specified component, or all drifted components when no name is provided.
4. THE Sync_Engine SHALL provide a CLI command `sync pull [component-name]` that runs figma-to-code sync for the specified component, or all drifted components when no name is provided.
5. THE Sync_Engine SHALL provide a CLI command `sync stories [component-name]` that generates or updates Storybook stories for the specified component, or all components when no name is provided.
6. THE Sync_Engine SHALL provide a CLI command `sync init` that generates the initial Component_Map by scanning code components and matching them to Figma components via `search_design_system`.
7. WHEN a CLI command encounters an error, THE Sync_Engine SHALL print a descriptive error message to stderr and exit with a non-zero exit code.

---

### Requirement 10: Orchestrator Workflow

**User Story:** As a developer, I want a single command that detects drift, offers to sync in either direction, and auto-generates stories, so that I can keep code and Figma aligned in one step.

#### Acceptance Criteria

1. THE Sync_Engine SHALL provide an orchestrator command `sync all` that executes the following steps in order: (a) run drift detection, (b) present the Drift_Report, (c) prompt the user to choose sync direction per component or apply a bulk direction, (d) execute the chosen sync operations, (e) generate/update Storybook stories for all synced components.
2. WHEN the orchestrator is run with a `--direction code-to-figma` flag, THE Sync_Engine SHALL skip the direction prompt and push all drifted components to Figma.
3. WHEN the orchestrator is run with a `--direction figma-to-code` flag, THE Sync_Engine SHALL skip the direction prompt and pull all drifted Figma changes into code.
4. WHEN the orchestrator is run with a `--dry-run` flag, THE Sync_Engine SHALL print the Drift_Report and the planned sync operations without executing any changes.
5. AFTER the orchestrator completes all sync operations, THE Sync_Engine SHALL print a summary listing: number of components synced, sync direction for each, number of stories generated/updated, and any errors encountered.

---

### Requirement 11: Design Token Sync

**User Story:** As a developer, I want design token changes (colors in `src/index.css` or Figma variables) to be detected and synced, so that the color system stays consistent across code and Figma.

#### Acceptance Criteria

1. THE Sync_Engine SHALL extract all CSS custom property definitions from `src/index.css` (both light and dark mode values) and compare them against the Figma Design_Token variable values obtained via `get_variable_defs`.
2. THE Drift_Report SHALL include a "tokens" section listing any token value mismatches between `src/index.css` and the Figma variable collection, specifying the token name, the CSS value, and the Figma value.
3. WHEN a token value in `src/index.css` differs from the Figma variable value, THE Sync_Engine SHALL offer to update the Figma variable via `use_figma` (code-to-figma direction) or update the CSS custom property in `src/index.css` (figma-to-code direction).
4. WHEN a new CSS custom property is added to `src/index.css` that follows the project's token naming convention, THE Sync_Engine SHALL offer to create a corresponding Figma variable via `use_figma`.
5. WHEN a new Figma variable is added that does not have a corresponding CSS custom property, THE Sync_Engine SHALL flag it in the Drift_Report and offer to add the CSS custom property to `src/index.css`.

---

### Requirement 12: Error Handling and Recovery

**User Story:** As a developer, I want sync operations to handle failures gracefully and leave the system in a consistent state, so that a failed sync does not corrupt my code or Figma components.

#### Acceptance Criteria

1. IF a `use_figma` call fails during code-to-figma sync, THEN THE Sync_Engine SHALL log the error with the Figma node ID and operation details, skip the failed component, and continue syncing remaining components.
2. IF a file write fails during figma-to-code sync, THEN THE Sync_Engine SHALL log the error, leave the original file unchanged, and report the failure in the sync summary.
3. WHEN the Figma_MCP server is not connected or not responding, THE Sync_Engine SHALL detect the unavailability within 10 seconds and report a clear error message indicating that the Figma MCP connection is required.
4. WHEN the Storybook_MCP is not connected, THE Story_Generator SHALL fall back to template-based story generation and log a warning that Storybook_MCP was unavailable.
5. IF a sync operation is interrupted, THEN THE Sync_Engine SHALL not update the Component_Map `lastSyncedAt` for any component that was not fully synced, ensuring the next run re-attempts the incomplete sync.
6. THE Sync_Engine SHALL write a sync log to `.kiro/sync/sync.log` recording each sync operation's timestamp, component name, direction, result (success or error), and any error details.
