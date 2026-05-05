# Design System POC — shadcn/ui Rules
---
description: Review UI code for Vercel Web Interface Guidelines compliance
argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

## Interactions

### Keyboard

- MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- MUST: Manage focus (trap, move, return) per APG patterns
- NEVER: `outline: none` without visible focus replacement

### Targets & Input

- MUST: Hit target ≥24px (mobile ≥44px); if visual <24px, expand hit area
- MUST: Mobile `<input>` font-size ≥16px to prevent iOS zoom
- NEVER: Disable browser zoom (`user-scalable=no`, `maximum-scale=1`)
- MUST: `touch-action: manipulation` to prevent double-tap zoom
- SHOULD: Set `-webkit-tap-highlight-color` to match design

### Forms

- MUST: Hydration-safe inputs (no lost focus/value)
- NEVER: Block paste in `<input>`/`<textarea>`
- MUST: Loading buttons show spinner and keep original label
- MUST: Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits
- MUST: Keep submit enabled until request starts; then disable with spinner
- MUST: Accept free text, validate after—don't block typing
- MUST: Allow incomplete form submission to surface validation
- MUST: Errors inline next to fields; on submit, focus first error
- MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- SHOULD: Disable spellcheck for emails/codes/usernames
- SHOULD: Placeholders end with `…` and show example pattern
- MUST: Warn on unsaved changes before navigation
- MUST: Compatible with password managers & 2FA; allow pasting codes
- MUST: Trim values to handle text expansion trailing spaces
- MUST: No dead zones on checkboxes/radios; label+control share one hit target

### State & Navigation

- MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels)
- MUST: Back/Forward restores scroll position
- MUST: Links use `<a>`/`<Link>` for navigation (support Cmd/Ctrl/middle-click)
- NEVER: Use `<div onClick>` for navigation

### Feedback

- SHOULD: Optimistic UI; reconcile on response; on failure rollback or offer Undo
- MUST: Confirm destructive actions or provide Undo window
- MUST: Use polite `aria-live` for toasts/inline validation
- SHOULD: Ellipsis (`…`) for options opening follow-ups ("Rename…") and loading states ("Loading…")

### Touch & Drag

- MUST: Generous targets, clear affordances; avoid finicky interactions
- MUST: Delay first tooltip; subsequent peers instant
- MUST: `overscroll-behavior: contain` in modals/drawers
- MUST: During drag, disable text selection and set `inert` on dragged elements
- MUST: If it looks clickable, it must be clickable

### Autofocus

- SHOULD: Autofocus on desktop with single primary input; rarely on mobile

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant or disable)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`) only
- NEVER: Animate layout props (`top`, `left`, `width`, `height`)
- NEVER: `transition: all`—list properties explicitly
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations interruptible and input-driven (no autoplay)
- MUST: Correct `transform-origin` (motion starts where it "physically" should)
- MUST: SVG transforms on `<g>` wrapper with `transform-box: fill-box`

## Layout

- SHOULD: Optical alignment; adjust ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges—no accidental placement
- SHOULD: Balance icon/text lockups (weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (`env(safe-area-inset-*)`)
- MUST: Avoid unwanted scrollbars; fix overflows
- SHOULD: Flex/grid over JS measurement for layout

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (" "); avoid widows/orphans (`text-wrap: balance`)
- MUST: `font-variant-numeric: tabular-nums` for number comparisons
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Accessible names exist even when visuals omit labels
- MUST: Use `…` character (not `...`)
- MUST: `scroll-margin-top` on headings; "Skip to content" link; hierarchical `<h1>`–`<h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- SHOULD: `translate="no"` on brand names, code tokens, & identifiers to prevent garbled auto-translation
- MUST: Accurate `aria-label`; decorative elements `aria-hidden`
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- MUST: Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names

## Content Handling

- MUST: Text containers handle long content (`truncate`, `line-clamp-*`, `break-words`)
- MUST: Flex children need `min-w-0` to allow truncation
- MUST: Handle empty states—no broken UI for empty strings/arrays

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid reflows/repaints
- MUST: Mutations (`POST`/`PATCH`/`DELETE`) target <500ms
- SHOULD: Prefer uncontrolled inputs; controlled inputs cheap per keystroke
- MUST: Virtualize large lists (>50 items)
- MUST: Preload above-fold images; lazy-load the rest
- MUST: Prevent CLS (explicit image dimensions)
- SHOULD: `<link rel="preconnect">` for CDN domains
- SHOULD: Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`

## Dark Mode & Theming

- MUST: `color-scheme: dark` on `<html>` for dark themes
- SHOULD: `<meta name="theme-color">` matches page background
- MUST: Native `<select>`: explicit `background-color` and `color` (Windows fix)

## Hydration

- MUST: Inputs with `value` need `onChange` (or use `defaultValue`)
- SHOULD: Guard date/time rendering against hydration mismatch

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover`/`:active`/`:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid dark color gradient banding (use background images when needed)

## Output Format

Group by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx

✓ pass
```

## Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this project and must be followed for every Figma-driven change.

### Required Flow (do not skip)

1. Run `get_design_context` first to fetch the structured representation for the exact node(s)
2. If the response is too large or truncated, run `get_metadata` to get the high-level node map, then re-fetch only the required node(s) with `get_design_context`
3. Run `get_screenshot` for a visual reference of the node variant being implemented
4. Only after you have both `get_design_context` and `get_screenshot`, download any assets needed and start implementation
5. Translate the output (usually React + Tailwind) into this project's conventions, styles, and framework
6. Validate against Figma for 1:1 look and behavior before marking complete

### Implementation Rules

- Treat the Figma MCP output (React + Tailwind) as a representation of design and behavior, not as final code style
- Reuse existing components from `src/components/ui/` instead of duplicating functionality
- Use the project's color system, typography scale, and spacing tokens consistently
- Respect existing routing, state management, and data-fetch patterns
- Strive for 1:1 visual parity with the Figma design
- Validate the final UI against the Figma screenshot for both look and behavior

## Project Structure

```
src/
├── components/
│   ├── ui/           ← shadcn/ui primitives (button, card, avatar, badge, etc.)
│   └── dashboard/    ← composed dashboard components (StatCard, StatsPanel, etc.)
├── stories/
│   ├── atoms/        ← Storybook stories for primitive components
│   ├── molecules/    ← Storybook stories for composed components
│   └── pages/        ← Storybook stories for page-level compositions
├── hooks/            ← Custom React hooks
├── lib/              ← Utility functions (cn, etc.)
└── index.css         ← Tailwind + design token definitions
```

## Token Definitions

Design tokens are defined as CSS custom properties in `src/index.css` using OKLCH color space. They support Light and Dark modes via the `.dark` class.

### Color Tokens

| Token | Usage |
|-------|-------|
| `--background` / `--foreground` | Page canvas and primary text |
| `--card` / `--card-foreground` | Card backgrounds and text |
| `--primary` / `--primary-foreground` | Primary actions (buttons, links) |
| `--secondary` / `--secondary-foreground` | Secondary actions |
| `--muted` / `--muted-foreground` | Muted backgrounds and metadata text |
| `--destructive` | Error/destructive actions |
| `--border` | Borders and dividers |
| `--input` | Input field borders |
| `--ring` | Focus ring color |
| `--chart-1` through `--chart-5` | Chart color palette |

IMPORTANT: All color values MUST reference design token variables. No hardcoded hex or OKLCH values in components.

### Spacing

Base unit: 4px. Uses Tailwind's default spacing scale.

| Tailwind | Value | Usage |
|----------|-------|-------|
| `gap-1` | 4px | Tight spacing |
| `gap-2` | 8px | Button internal gap |
| `gap-3` | 12px | Activity item gap |
| `gap-4` | 16px | Card gap, grid gap |
| `gap-6` | 24px | Section gap |
| `p-4` | 16px | Card content padding |
| `p-6` | 24px | Page padding |

### Border Radius

| Tailwind | Value | Usage |
|----------|-------|-------|
| `rounded-md` | 8px | Small elements |
| `rounded-lg` | 10px | Buttons, inputs |
| `rounded-xl` | 14px | Cards |
| `rounded-full` | 9999px | Badges, avatars |

Base radius: `--radius: 0.625rem` (10px)

### Typography

- **Font family**: Geist Variable (sans-serif fallback: Inter)
- **Heading font**: Same as body (`--font-heading: var(--font-sans)`)

| Scale | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Badges, timestamps, captions |
| `text-sm` | 14px | Body text, descriptions, table cells |
| `text-base` | 16px | Card titles |
| `text-lg` | 18px | Logo text |
| `text-2xl` | 24px | Stat values |
| `text-3xl` | 30px | Page titles |

### Elevation

- Cards: `ring-1 ring-foreground/10` (subtle border ring)
- Popovers/dropdowns: `shadow-md ring-1 ring-foreground/10`
- Focus states: `ring-3 ring-ring/50`

## Component Library

All UI components are in `src/components/ui/` and come from shadcn/ui v4 (Base UI primitives + Tailwind CSS v4).

### Available Components

| Component | File | Variants/Props |
|-----------|------|---------------|
| Button | `button.tsx` | variant: default, outline, secondary, ghost, destructive, link; size: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg |
| Badge | `badge.tsx` | variant: default, secondary, destructive, outline, ghost, link |
| Card | `card.tsx` | size: default, sm; sub-components: CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter |
| Input | `input.tsx` | type: text, email, password, etc.; states: default, disabled |
| Avatar | `avatar.tsx` | size: default, sm, lg; sub-components: AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup |
| Table | `table.tsx` | sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption |
| Tabs | `tabs.tsx` | variant: default, line; orientation: horizontal, vertical |
| Separator | `separator.tsx` | orientation: horizontal, vertical |
| Skeleton | `skeleton.tsx` | Shape via className |
| Tooltip | `tooltip.tsx` | side: top, bottom, left, right |

### Dashboard Components

| Component | File | Props |
|-----------|------|-------|
| StatCard | `dashboard/StatCard.tsx` | title, value, change, trend: up/down/neutral |
| RecentActivity | `dashboard/RecentActivity.tsx` | items: ActivityItem[] |
| StatsPanel | `dashboard/StatsPanel.tsx` | stats, chartData |
| DataPanel | `dashboard/DataPanel.tsx` | transactions, activityItems |
| DashboardPage | `dashboard/DashboardPage.tsx` | user, statsPanel, dataPanel |

## Composition Hierarchy

Atoms → Molecules → Page Compositions. Never skip levels.

- **Atoms**: Button, Badge, Input, Avatar, Separator, Skeleton, Tooltip
- **Molecules**: Card, StatCard, Table, Tabs, RecentActivity
- **Pages**: StatsPanel, DataPanel, DashboardPage

## Styling Approach

- **Framework**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Utility**: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- **Variants**: `class-variance-authority` (cva) for component variant definitions
- **Dark mode**: `.dark` class on ancestor element
- **Global styles**: `src/index.css` with `@layer base` for defaults

IMPORTANT: Use Tailwind utility classes for styling. Do not use inline styles unless truly necessary for dynamic values.

## Icon System

- **Library**: Lucide React (`lucide-react`)
- **Usage**: Import individual icons: `import { Search } from "lucide-react"`
- **Sizing**: Default 16px via `[&_svg:not([class*='size-'])]:size-4` on parent
- IMPORTANT: DO NOT import new icon packages. All icons come from Lucide.

## Asset Handling

- IMPORTANT: If the Figma MCP server returns a localhost source for an image or SVG, use that source directly
- IMPORTANT: DO NOT import/add new icon packages — all assets should be in the Figma payload
- IMPORTANT: DO NOT use or create placeholders if a localhost source is provided
- Store downloaded assets in `public/assets/`

## Storybook

- **Version**: Storybook 10 with `@storybook/react-vite`
- **Stories location**: `src/stories/` organized by atomic design level
- **Interaction tests**: All stories include `play` functions using `storybook/test` (expect, userEvent, within, fn)
- **Addons**: `@storybook/addon-docs`, `@storybook/addon-a11y`
- **Tags**: All stories use `tags: ["autodocs"]` for automatic documentation

## Component Architecture Patterns

### shadcn/ui Primitives (src/components/ui/)

All UI primitives follow these conventions:

- **Base UI integration**: Components wrap `@base-ui/react` primitives (e.g., `Button` wraps `@base-ui/react/button`)
- **Variant system**: Use `class-variance-authority` (cva) to define variant maps with `variants` and `defaultVariants`
- **className merging**: Every component accepts a `className` prop and merges it using `cn()` from `@/lib/utils`
- **data-slot attributes**: Every component root element includes `data-slot="component-name"` for styling hooks and testing selectors
- **Named exports**: Components use named exports, not default exports (e.g., `export { Button, buttonVariants }`)
- **Sub-components**: Compound components (Card, Table, Tabs) export each sub-component separately from the same file

### Dashboard Components (src/components/dashboard/)

Composed components that combine UI primitives:

- Import primitives from `@/components/ui/` — never recreate them
- Define a typed props interface (e.g., `StatCardProps`) exported alongside the component
- Use Lucide icons imported individually
- Follow the Atoms → Molecules → Pages hierarchy

### Creating New Components

When adding a new component from Figma:

1. Check if an existing UI primitive or dashboard component already covers the need
2. For new primitives: add to `src/components/ui/` following the cva + data-slot pattern
3. For new composed components: add to `src/components/dashboard/` importing from `@/components/ui/`
4. IMPORTANT: Always create a matching Storybook story in the appropriate `src/stories/` subdirectory

## Import Conventions

- **Path aliases**: Use `@/` prefix for all project imports (maps to `src/`)
  - `@/components/ui/button` — UI primitives
  - `@/components/dashboard/StatCard` — dashboard components
  - `@/lib/utils` — utility functions
  - `@/hooks/use-mobile` — custom hooks
- **Import order**: React/third-party → project imports (`@/`) → types
- **Icon imports**: Individual named imports from `lucide-react` (e.g., `import { Search, ChevronRight } from "lucide-react"`)
- IMPORTANT: Never use relative imports that go beyond the parent directory. Use `@/` aliases instead.

## Testing & Quality

### Storybook Interaction Tests

Every story must include a `play` function for interaction testing:

```tsx
play: async ({ canvasElement, args }) => {
  const canvas = within(canvasElement)
  const element = canvas.getByRole('button', { name: 'Label' })
  await expect(element).toBeVisible()
  await userEvent.click(element)
  await expect(args.onClick).toHaveBeenCalledOnce()
}
```

- Use `storybook/test` imports: `expect`, `fn`, `userEvent`, `within`
- Query by role/label (accessible queries), not by class or test-id
- Test visibility, interaction, and callback invocation
- For composed components, verify all child elements render

### Unit Tests

- **Runner**: Vitest with `vitest --run` (no watch mode)
- **Property-based testing**: `fast-check` via `@fast-check/vitest` available for invariant testing
- **Test location**: `src/sync/__tests__/` for sync module tests

### Story File Conventions

| Atomic Level | Story Location | Meta Title Pattern |
|-------------|----------------|-------------------|
| Atoms | `src/stories/atoms/` | `'Atoms/ComponentName'` |
| Molecules | `src/stories/molecules/` | `'Molecules/ComponentName'` |
| Pages | `src/stories/pages/` | `'Pages/ComponentName'` |

All story files must include:
- `tags: ['autodocs']` for automatic documentation
- `parameters: { layout: 'centered' }` (or `'fullscreen'` for pages)
- `argTypes` with controls for all variant props
- At minimum: one story per variant + an `AllVariants` story showing all options together

## Dark Mode

- Toggled via `.dark` class on an ancestor element
- All color tokens have light and dark values defined in `src/index.css`
- IMPORTANT: When implementing from Figma, ensure components work in both light and dark modes
- Use semantic token names (e.g., `bg-card`, `text-muted-foreground`) — they automatically adapt to the active mode

## Figma File Reference

- **File key**: `uDSGcEd2obHYrbp2DfcNxO`
- **URL**: https://www.figma.com/design/uDSGcEd2obHYrbp2DfcNxO
- **Pages**: Tokens, Atoms, Molecules, Pages
- **Design tokens**: 19 color variables with Light/Dark modes
- **Components**: Button (19 variants), Badge (6), Input (4), Avatar (3), Separator (2), Skeleton (3), Tooltip (4), Card (2), StatCard (3), Tabs (4), Table, RecentActivity

