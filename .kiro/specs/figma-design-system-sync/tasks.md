# Implementation Plan: Figma Design System Sync

## Overview

This plan implements a 9-phase pipeline to build a complete design system in Figma via MCP tool calls. Each task corresponds to one or more `use_figma` / MCP tool invocations, keeping each call under the 20KB output limit by creating one component per call. All work targets Figma file `uDSGcEd2obHYrbp2DfcNxO`.

## Tasks

- [x] 1. Create Figma page structure and token swatches
  - [x] 1.1 Create the 4 top-level pages: Tokens, Atoms, Molecules, Pages
    - Single `use_figma` call to create/verify all 4 pages exist with correct names
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.2 Create Light mode token swatches on the Tokens page
    - `use_figma` call to render labeled color swatches for all 19 design tokens in a Light mode frame
    - Each swatch: colored rectangle bound to the variable + text label with token name
    - _Requirements: 1.1, 9.1_

  - [x] 1.3 Create Dark mode token swatches on the Tokens page
    - `use_figma` call to render the same 19 swatches in a Dark mode frame using the Dark variable mode
    - _Requirements: 1.1, 9.1_

- [x] 2. Checkpoint — Verify page structure and token swatches
  - Use `get_design_context` to confirm 4 pages exist with correct names
  - Use `get_screenshot` on the Tokens page to visually verify 19 swatches in Light + Dark
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Create atom components on the Atoms page
  - [x] 3.1 Create Button component set — variant axis (6 variants at default size)
    - `use_figma` call creating a component set with variants: default, outline, secondary, ghost, destructive, link
    - All fills bound to design token variables (primary, secondary, destructive, etc.)
    - Auto layout with spacing matching Tailwind: h-8, gap-1.5, px-2.5, rounded-lg (10px)
    - _Requirements: 2.1, 9.1_

  - [x] 3.2 Create Button component set — size axis (default variant at all 8 sizes)
    - `use_figma` call adding size variants: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
    - Heights: xs=24, sm=28, default=32, lg=36; icon sizes: 32, 24, 28, 36
    - _Requirements: 2.2, 9.1_

  - [x] 3.3 Create Button component set — key cross-combinations
    - `use_figma` call adding representative cross-variants (e.g., destructive+sm, outline+lg, ghost+icon)
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Create Badge component set (6 variants)
    - `use_figma` call creating component set with variants: default, secondary, destructive, outline, ghost, link
    - h-5, rounded-full (9999), px-2, text-xs, token-bound fills
    - _Requirements: 2.3, 9.1_

  - [x] 3.5 Create Input component set (4 states)
    - `use_figma` call creating component set with states: default, focus, disabled, invalid
    - h-8, rounded-lg (10px), border bound to input/ring/destructive tokens
    - _Requirements: 2.5, 9.1_

  - [x] 3.6 Create Avatar component set (3 sizes + sub-components)
    - `use_figma` call creating component set with sizes: default (32px), sm (24px), lg (40px)
    - Include AvatarImage, AvatarFallback, AvatarBadge sub-components
    - rounded-full, muted fill for fallback, token-bound colors
    - _Requirements: 2.4, 9.1_

  - [x] 3.7 Create Separator component set (2 orientations)
    - `use_figma` call creating component set with horizontal and vertical variants
    - 1px thickness, fill bound to border token
    - _Requirements: 2.6, 9.1_

  - [x] 3.8 Create Skeleton component set (3 shapes)
    - `use_figma` call creating component set with line, circle, and block shape variants
    - Fill bound to muted design token
    - _Requirements: 3.1, 3.2, 9.1_

  - [x] 3.9 Create Tooltip component set (4 placements)
    - `use_figma` call creating component set with placements: top, bottom, left, right
    - Include arrow indicator, bg-foreground fill, text-background text color
    - _Requirements: 3.3, 3.4, 3.5, 9.1_

- [x] 4. Checkpoint — Verify atom components
  - Use `get_screenshot` and `get_design_context` on the Atoms page for each component
  - Verify correct variant counts, token-bound colors, auto layout spacing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create molecule components on the Molecules page
  - [x] 5.1 Create Card component set (2 sizes + sub-components)
    - `use_figma` call creating component set with default and sm size variants
    - Include sub-components: CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
    - rounded-xl (14px), py-4, px-4, gap-4, ring-1 ring-foreground/10, token-bound fills
    - _Requirements: 4.1, 9.1_

  - [x] 5.2 Create StatCard component set (3 trend variants)
    - `use_figma` call creating component set with trend variants: up, down, neutral
    - Compose from Card + Badge instances, text label for Lucide icon (TrendingUp/Down/Minus)
    - _Requirements: 4.2, 9.1_

  - [x] 5.3 Create Table component set — structure and sub-components
    - `use_figma` call creating TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption
    - _Requirements: 4.3, 9.1_

  - [x] 5.4 Create Table component set — example data (3 columns × 3 rows)
    - `use_figma` call populating the Table with representative data matching the transactions table
    - _Requirements: 4.3_

  - [x] 5.5 Create Tabs component set (2 list variants × 2 orientations)
    - `use_figma` call creating component set with default (pill) and line (underline) list variants
    - Include horizontal and vertical orientation variants
    - Include TabsList, TabsTrigger, TabsContent sub-components
    - _Requirements: 4.4, 9.1_

  - [x] 5.6 Create RecentActivity component set
    - `use_figma` call creating a component showing 3+ activity items
    - Each item: Avatar (sm instance), user name text, action text, timestamp text
    - gap-4 between items, gap-3 within each item, token-bound text colors
    - _Requirements: 5.1, 5.2, 5.3, 9.1_

- [x] 6. Checkpoint — Verify molecule components
  - Use `get_screenshot` and `get_design_context` on the Molecules page for each component
  - Verify sub-component structure, variant counts, token-bound colors, spacing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create page-level compositions on the Pages page
  - [x] 7.1 Create StatsPanel frame
    - `use_figma` call creating a frame with 4×StatCard grid (auto layout, gap-4) + Overview Card with chart placeholder rectangle
    - _Requirements: 6.1, 6.4_

  - [x] 7.2 Create DataPanel frame
    - `use_figma` call creating a frame with 7-column grid: 4-col transactions table card + 3-col recent activity card
    - gap-4 between cards
    - _Requirements: 6.2, 6.4_

  - [x] 7.3 Create DashboardPage frame (Light mode) — header section
    - `use_figma` call creating the top nav bar at 1440px width: logo text, nav buttons (ghost), search input, avatar
    - h-14 header, border-b, px-6, gap-4 between nav items
    - _Requirements: 6.3, 6.4_

  - [x] 7.4 Create DashboardPage frame (Light mode) — main content
    - `use_figma` call adding the page title row (h1 "Dashboard" + Download button), Tabs (Overview/Analytics/Reports), and nested StatsPanel + DataPanel within Overview tab content
    - p-6 main padding, gap-4 between sections
    - _Requirements: 6.3, 6.4_

  - [x] 7.5 Create DashboardPage frame (Dark mode)
    - `use_figma` call duplicating the Light mode DashboardPage and switching to Dark mode token collection
    - Verify all fills/text update to dark mode values
    - _Requirements: 6.5, 9.3_

- [x] 8. Checkpoint — Verify page compositions and token coverage
  - Use `get_screenshot` on each page composition to verify layout matches React implementation
  - Use `get_design_context` to scan ALL components for hardcoded hex values — flag any that have a matching design token
  - Fix any unresolved token bindings found during the scan
  - Verify Dark mode DashboardPage colors update correctly
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 9. Publish library and create Code Connect mappings
  - [x] 9.1 Prompt user to publish components to team library
    - Library must be published before Code Connect mappings can be sent
    - Ask user to confirm publication is complete before proceeding
    - _Requirements: 7.12_

  - [x] 9.2 Create Code Connect mappings for atom components
    - Use `get_code_connect_suggestions` then `send_code_connect_mappings` / `add_code_connect_map` for:
      - Button → `src/components/ui/button.tsx` (variant + size props)
      - Badge → `src/components/ui/badge.tsx` (variant prop)
      - Avatar → `src/components/ui/avatar.tsx` (size prop)
      - Input → `src/components/ui/input.tsx`
      - Separator → `src/components/ui/separator.tsx`
      - Skeleton → `src/components/ui/skeleton.tsx`
      - Tooltip → `src/components/ui/tooltip.tsx` (side prop)
    - _Requirements: 7.1, 7.2, 7.3, 7.8, 7.9, 7.10_

  - [x] 9.3 Create Code Connect mappings for molecule components
    - Use `get_code_connect_suggestions` then `send_code_connect_mappings` / `add_code_connect_map` for:
      - Card → `src/components/ui/card.tsx` (size prop)
      - StatCard → `src/components/dashboard/StatCard.tsx` (trend prop)
      - Table → `src/components/ui/table.tsx`
      - Tabs → `src/components/ui/tabs.tsx` (variant + orientation props)
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

  - [x] 9.4 Create Code Connect mappings for page compositions
    - Use `get_code_connect_suggestions` then `send_code_connect_mappings` / `add_code_connect_map` for:
      - StatsPanel → `src/components/dashboard/StatsPanel.tsx`
      - DataPanel → `src/components/dashboard/DataPanel.tsx`
      - DashboardPage → `src/components/dashboard/DashboardPage.tsx`
    - _Requirements: 7.11_

  - [x] 9.5 Verify all Code Connect mappings accepted
    - Confirm `send_code_connect_mappings` responses show all mappings accepted without errors
    - _Requirements: 7.12_

- [x] 10. Create design system rules
  - [x] 10.1 Author and push design system rules document
    - Single `create_design_system_rules` call with the full rules document covering:
      - Spacing: 4px base unit, Tailwind scale (gap-1=4, gap-2=8, gap-4=16, gap-6=24, p-4=16, p-6=24)
      - Typography: Inter font, text-sm (14px) base, font-heading at 16px for card titles, 30px for page titles
      - Color: all values must reference design token variables, no hardcoded hex
      - Composition hierarchy: Atoms → Molecules → Page_Compositions
      - Border radius: buttons/inputs rounded-lg (10px), cards rounded-xl (14px), badges rounded-full
      - Elevation: cards ring-1 ring-foreground/10, popovers shadow-md ring-1 ring-foreground/10
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 10.2 Verify design system rules saved
    - Confirm `create_design_system_rules` response indicates rules were saved successfully
    - _Requirements: 8.7_

- [x] 11. Final checkpoint — Full verification
  - Verify all 4 pages exist with correct component placement
  - Verify all Code Connect mappings are active
  - Verify design system rules are saved
  - Verify zero hardcoded hex colors with matching tokens across all components
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each `use_figma` call creates one component to stay under the 20KB output limit
- All color fills must be bound to design token variables, never hardcoded hex
- Button is split across 3 calls due to its 6×8 variant matrix
- Table is split across 2 calls (structure + example data)
- DashboardPage is split across 3 calls (header + content + dark mode)
- Library must be published by the user before Code Connect mappings can be sent (task 9.1)
- Checkpoints use `get_design_context` and `get_screenshot` for structural and visual verification
