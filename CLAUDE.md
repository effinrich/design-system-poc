# Design System POC — shadcn/ui Rules

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

## Figma File Reference

- **File key**: `uDSGcEd2obHYrbp2DfcNxO`
- **URL**: https://www.figma.com/design/uDSGcEd2obHYrbp2DfcNxO
- **Pages**: Tokens, Atoms, Molecules, Pages
- **Design tokens**: 19 color variables with Light/Dark modes
- **Components**: Button (19 variants), Badge (6), Input (4), Avatar (3), Separator (2), Skeleton (3), Tooltip (4), Card (2), StatCard (3), Tabs (4), Table, RecentActivity
