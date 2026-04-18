# Requirements Document

## Introduction

This feature covers the Figma-side work required to establish a complete, well-organized design system in Figma that mirrors the codebase's component library. The project uses Vite + React + TypeScript with shadcn/ui components built on Base UI primitives. A Figma file (key: `uDSGcEd2obHYrbp2DfcNxO`) already exists with an initial set of components and 19 design token color variables in Light/Dark modes.

The scope is strictly Figma-side: pushing components from code to Figma canvas, organizing them into a coherent page structure, establishing Code Connect mappings between Figma components and their React source, and authoring design system rules. No changes to the React codebase are in scope.

The end state is a Figma file that a designer can open and immediately use as a living design system — with accurate component representations, correct token usage, and Code Connect wiring so that Figma's "Dev Mode" surfaces the right React code for every component.

## Glossary

- **Figma_MCP**: The Figma MCP server connected to the IDE, exposing tools: `use_figma`, `get_design_context`, `get_screenshot`, `get_code_connect_suggestions`, `send_code_connect_mappings`, `add_code_connect_map`, `create_design_system_rules`, `generate_figma_design`, `search_design_system`.
- **Figma_File**: The target Figma file with key `uDSGcEd2obHYrbp2DfcNxO`.
- **Component_Set**: A Figma component set grouping all variants of a single component (e.g., all Button variants in one set).
- **Design_Token**: A named color variable already defined in the Figma file under Light/Dark mode collections (19 tokens currently exist).
- **Code_Connect**: Figma's feature that maps a Figma component node to its React source file and props, surfaced in Dev Mode.
- **Code_Connect_Map**: A single mapping entry linking one Figma component variant to one React component import + prop configuration.
- **Design_System_Rules**: A structured document authored via `create_design_system_rules` that encodes spacing, typography, color usage, and component composition guidelines for AI-assisted design generation.
- **Atom**: A primitive UI component with no composed children (Button, Badge, Input, Avatar, Separator, Skeleton, Tooltip).
- **Molecule**: A component composed from atoms (Card, StatCard, Table, Tabs, RecentActivity).
- **Page_Composition**: A full-page or panel-level layout composed from molecules and atoms (StatsPanel, DataPanel, DashboardPage).
- **Figma_Page**: A top-level page inside the Figma file used to organize content (e.g., "Atoms", "Molecules", "Pages", "Tokens").

---

## Requirements

### Requirement 1: Figma File Page Structure

**User Story:** As a designer, I want the Figma file organized into clearly named pages, so that I can navigate the design system without hunting for components.

#### Acceptance Criteria

1. THE Figma_File SHALL contain a page named "Tokens" that displays all 19 design token color variables as labeled swatches in both Light and Dark mode.
2. THE Figma_File SHALL contain a page named "Atoms" that holds all primitive component sets: Button, Badge, Input, Avatar, Separator, Skeleton, Tooltip.
3. THE Figma_File SHALL contain a page named "Molecules" that holds all composed component sets: Card, StatCard, Table, Tabs, RecentActivity.
4. THE Figma_File SHALL contain a page named "Pages" that holds full-page composition frames: StatsPanel, DataPanel, DashboardPage.
5. WHEN a new component is added to the Figma file, THE Figma_MCP SHALL place it on the page that matches its classification (Atom, Molecule, or Page_Composition).

---

### Requirement 2: Atom Components — Existing Components Improved

**User Story:** As a designer, I want the existing atom components in Figma to accurately reflect all code variants and sizes, so that I can pick the right component without guessing.

#### Acceptance Criteria

1. THE Button Component_Set SHALL contain all 6 variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
2. THE Button Component_Set SHALL contain all 8 sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
3. THE Badge Component_Set SHALL contain all 6 variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.
4. THE Avatar Component_Set SHALL contain all 3 sizes: `default`, `sm`, `lg`, and SHALL include sub-components: AvatarImage, AvatarFallback, AvatarBadge.
5. THE Input Component_Set SHALL represent the default, focus, disabled, and invalid states as separate variants.
6. THE Separator Component_Set SHALL contain both `horizontal` and `vertical` orientation variants.
7. WHEN a component variant in code is added or changed, THE Figma_MCP SHALL update the corresponding Component_Set to reflect the change.

---

### Requirement 3: Atom Components — New Components Added

**User Story:** As a designer, I want Skeleton and Tooltip components in Figma, so that I can design loading states and contextual hints without switching to code.

#### Acceptance Criteria

1. THE Figma_File SHALL contain a Skeleton Component_Set on the "Atoms" page with at least 3 representative shape variants: line, circle, and block.
2. THE Skeleton Component_Set SHALL use the `bg-muted` Design_Token for its fill color.
3. THE Figma_File SHALL contain a Tooltip Component_Set on the "Atoms" page with 4 placement variants: `top`, `bottom`, `left`, `right`.
4. THE Tooltip Component_Set SHALL include the arrow indicator and use the `bg-foreground` / `text-background` Design_Token pair for its color.
5. WHEN a Skeleton or Tooltip component is placed in a composition, THE Figma_MCP SHALL resolve its fill and text colors from the existing Design_Token variables rather than hardcoded hex values.

---

### Requirement 4: Molecule Components — Existing Components Improved

**User Story:** As a designer, I want the Card, StatCard, Table, and Tabs molecules in Figma to match their code implementations, so that designs I hand off are buildable without rework.

#### Acceptance Criteria

1. THE Card Component_Set SHALL contain 2 size variants: `default` and `sm`, and SHALL include sub-components: CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter.
2. THE StatCard Component_Set SHALL contain 3 trend variants: `up`, `down`, `neutral`, each showing the correct Badge variant and Lucide icon.
3. THE Table Component_Set SHALL include sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption, and SHALL show a representative 3-column, 3-row example.
4. THE Tabs Component_Set SHALL contain 2 list variants: `default` (pill style) and `line` (underline style), and SHALL include both `horizontal` and `vertical` orientation variants.
5. WHEN a molecule component's sub-components are updated in code, THE Figma_MCP SHALL update the corresponding nested layers in the Figma Component_Set.

---

### Requirement 5: Molecule Components — New Components Added

**User Story:** As a designer, I want a RecentActivity molecule in Figma, so that I can compose dashboard panels without manually recreating the activity feed layout.

#### Acceptance Criteria

1. THE Figma_File SHALL contain a RecentActivity Component_Set on the "Molecules" page.
2. THE RecentActivity Component_Set SHALL show a list of at least 3 activity items, each containing an Avatar (sm), a user name, an action string, and a timestamp.
3. THE RecentActivity Component_Set SHALL use the Avatar and Typography Design_Tokens already defined in the Figma file.

---

### Requirement 6: Page-Level Compositions

**User Story:** As a designer, I want full-page composition frames in Figma for StatsPanel, DataPanel, and DashboardPage, so that I can review and iterate on the complete dashboard layout without assembling it from scratch.

#### Acceptance Criteria

1. THE Figma_File SHALL contain a StatsPanel frame on the "Pages" page showing a 2×2 (mobile) and 4×1 (desktop) grid of StatCard components plus the Overview Card with a bar chart placeholder.
2. THE Figma_File SHALL contain a DataPanel frame on the "Pages" page showing the 4-column transactions table card alongside the 3-column recent activity card.
3. THE Figma_File SHALL contain a DashboardPage frame on the "Pages" page at 1440px width, including: the top navigation bar (logo, nav links, search input, avatar), the page title row with a Download button, the Tabs component (Overview / Analytics / Reports), and the StatsPanel and DataPanel compositions nested within the Overview tab content.
4. WHEN a page composition frame is generated, THE Figma_MCP SHALL use auto-layout with gap and padding values that match the Tailwind spacing scale used in the React source (4px base unit, gap-4 = 16px, p-6 = 24px).
5. THE DashboardPage frame SHALL include both a Light mode and a Dark mode artboard, each using the corresponding Design_Token variable collection.

---

### Requirement 7: Code Connect Mappings

**User Story:** As a developer, I want every Figma component variant mapped to its React source via Code Connect, so that Dev Mode shows the correct import and props for any component I inspect.

#### Acceptance Criteria

1. THE Figma_MCP SHALL produce a Code_Connect_Map for every variant in the Button Component_Set, mapping each Figma variant property to the corresponding `variant` and `size` props in `src/components/ui/button.tsx`.
2. THE Figma_MCP SHALL produce a Code_Connect_Map for every variant in the Badge Component_Set, mapping each Figma variant property to the `variant` prop in `src/components/ui/badge.tsx`.
3. THE Figma_MCP SHALL produce a Code_Connect_Map for the Avatar Component_Set, mapping the `size` variant property to the `size` prop in `src/components/ui/avatar.tsx`.
4. THE Figma_MCP SHALL produce a Code_Connect_Map for the Card Component_Set, mapping the `size` variant property to the `size` prop in `src/components/ui/card.tsx`.
5. THE Figma_MCP SHALL produce a Code_Connect_Map for the StatCard Component_Set, mapping the `trend` variant property to the `trend` prop in `src/components/dashboard/StatCard.tsx`.
6. THE Figma_MCP SHALL produce a Code_Connect_Map for the Tabs Component_Set, mapping the `variant` and `orientation` variant properties to the corresponding props in `src/components/ui/tabs.tsx`.
7. THE Figma_MCP SHALL produce a Code_Connect_Map for the Table Component_Set, mapping it to `src/components/ui/table.tsx`.
8. THE Figma_MCP SHALL produce a Code_Connect_Map for the Skeleton Component_Set, mapping it to `src/components/ui/skeleton.tsx`.
9. THE Figma_MCP SHALL produce a Code_Connect_Map for the Tooltip Component_Set, mapping the `side` variant property to the `side` prop in `src/components/ui/tooltip.tsx`.
10. THE Figma_MCP SHALL produce Code_Connect_Maps for the Input and Separator Component_Sets, mapping them to `src/components/ui/input.tsx` and `src/components/ui/separator.tsx` respectively.
11. THE Figma_MCP SHALL produce Code_Connect_Maps for the StatsPanel, DataPanel, and DashboardPage frames, mapping them to their respective files in `src/components/dashboard/`.
12. WHEN `send_code_connect_mappings` is called, THE Figma_MCP SHALL confirm that all mappings were accepted without errors before the task is considered complete.

---

### Requirement 8: Design System Rules

**User Story:** As a designer using AI-assisted design generation, I want design system rules encoded in Figma, so that generated designs automatically follow the project's spacing, typography, color, and component composition conventions.

#### Acceptance Criteria

1. THE Figma_MCP SHALL call `create_design_system_rules` with a rules document that specifies the 4px base spacing unit and the Tailwind spacing scale values used in the project (gap-1=4px, gap-2=8px, gap-4=16px, gap-6=24px, p-4=16px, p-6=24px).
2. THE design system rules SHALL specify the typography scale: base text is 14px/`text-sm`, headings use `font-heading` at 16px (`text-base`) for card titles and 30px (`text-3xl`) for page titles.
3. THE design system rules SHALL specify that all color values MUST be resolved from the Design_Token variable collection and SHALL NOT use hardcoded hex values.
4. THE design system rules SHALL specify the component composition hierarchy: Atoms are composed into Molecules, Molecules are composed into Page_Compositions.
5. THE design system rules SHALL specify the border radius conventions: buttons and inputs use `rounded-lg` (8px), cards use `rounded-xl` (12px), badges use `rounded-full`.
6. THE design system rules SHALL specify the shadow/ring convention: cards use `ring-1 ring-foreground/10`, popovers and dropdowns use `shadow-md ring-1 ring-foreground/10`.
7. WHEN `create_design_system_rules` is called, THE Figma_MCP SHALL confirm the rules were saved to the Figma file before the task is considered complete.

---

### Requirement 9: Token Coverage Verification

**User Story:** As a designer, I want to verify that all Figma components use design tokens rather than hardcoded values, so that switching between Light and Dark mode works correctly for every component.

#### Acceptance Criteria

1. WHEN a component is pushed to Figma, THE Figma_MCP SHALL bind all fill, stroke, and text color properties to the corresponding Design_Token variable rather than a hardcoded hex value.
2. THE Figma_File SHALL contain no component with a hardcoded hex color that has a corresponding Design_Token variable defined.
3. WHEN the Figma file's mode is switched from Light to Dark, THE Figma_MCP SHALL verify via `get_design_context` that all component fills and text colors update to their Dark mode token values.
4. IF a component color cannot be resolved to an existing Design_Token, THEN THE Figma_MCP SHALL flag the unresolved color and prompt the user to either add a new token or map it to an existing one before completing the push.
