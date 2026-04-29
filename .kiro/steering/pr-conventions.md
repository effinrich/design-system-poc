---
inclusion: manual
---

# Pull Request Conventions

When creating PRs for this project, follow these conventions.

## Title Format

`[Area]: [Description]`

- Area is capitalized, dashes allowed
- Examples:
  - `Components: Add Tooltip component`
  - `Tokens: Update dark mode colors`
  - `Sync: Fix drift detection for spacing`
  - `Stories: Add interaction tests for Card`
  - `Figma: Push updated Button variants`
  - `CLI: Add --verbose flag to drift command`
  - `Docs: Update README with Chromatic setup`

## Areas

| Area | When to use |
|------|-------------|
| `Components` | Changes to `src/components/ui/` or `src/components/dashboard/` |
| `Tokens` | Changes to design tokens in `src/index.css` or Figma variables |
| `Sync` | Changes to `src/sync/` modules (figma-drift tooling) |
| `Stories` | Changes to `src/stories/` (Storybook stories and tests) |
| `Figma` | Changes pushed to the Figma file via MCP |
| `CLI` | Changes to the figma-drift CLI |
| `Docs` | Documentation-only changes |
| `Build` | Build, CI, or dependency changes |

## Labels

**Category (pick one):**
- `bug` — fixes incorrect behavior
- `feature` — new functionality
- `maintenance` — refactoring, cleanup, deps
- `docs` — documentation only
- `breaking` — breaks compatibility

**Severity (for bugs):**
- `sev:S1` — critical, blocks usage
- `sev:S2` — major, significant impact
- `sev:S3` — minor, workaround exists
- `sev:S4` — trivial, cosmetic

## Command

Always create PRs in draft mode:

```bash
gh pr create --draft --title "[Area]: [Description]" --label "category"
```
