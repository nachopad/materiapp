# Design: Home Section Title Style

## Technical Approach

Implement the change only inside the dashboard client module. Add a dashboard-local `DashboardSectionHeader` component and replace the three duplicated inline headers in the authenticated dashboard home sections. The component will keep current section semantics (`h2`) while applying Profile-equivalent title typography: `text-2xl font-bold tracking-normal`. It will mirror `EmptyMedia variant="icon"` wrapper proportions locally, with `text-primary` applied to the wrapper/icon path so icons remain primary-colored.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Header reuse scope | Create `client/src/modules/dashboard/components/dashboard-section-header.tsx` | Cross-module shared Profile/header abstraction | Proposal explicitly excludes Profile refactor; local reuse removes three copies without expanding API surface. |
| Icon wrapper | Copy the relevant `EmptyMedia variant="icon"` classes into the local header wrapper and override color to primary | Import and compose `EmptyMedia`; create global icon wrapper | `EmptyMedia` includes empty-state-specific `mb-2` and `data-slot="empty-icon"`; local copy avoids semantic leakage while staying visually aligned. |
| Heading element | Keep `h2` in dashboard sections | Switch to Profile-style `h1` | Existing page has one `h1` welcome title; preserving `h2` avoids accidental document-outline changes. |
| Styling method | Tailwind utility classes inline in the new component | CSS module or theme utility | Project already uses inline Tailwind utilities for small module components; no new design-system layer is needed. |

## Data Flow

No data flow changes. Home page still passes dashboard data into section components; only each section's static header rendering changes.

```text
HomePage
  ├─ AcademicSummarySection ── DashboardSectionHeader(title="Resumen académico", icon=ChartLine)
  ├─ CurrentSubjectsSection ── DashboardSectionHeader(title="Materias cursando actualmente", icon=BookOpen)
  └─ ActiveCareersSection ─── DashboardSectionHeader(title="Carreras activas", icon=GraduationCap)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `client/src/modules/dashboard/components/dashboard-section-header.tsx` | Create | Local reusable section header accepting `title` and an icon component. Uses `h2` plus `text-2xl font-bold tracking-normal`; wrapper mirrors `EmptyMedia variant="icon"` sizing/shape with primary color. |
| `client/src/modules/dashboard/components/academic-summary-section.tsx` | Modify | Replace inline header markup with `DashboardSectionHeader`; change copy to `Resumen académico`. Keep KPI cards untouched. |
| `client/src/modules/dashboard/components/current-subjects-section.tsx` | Modify | Replace inline header markup with `DashboardSectionHeader`; keep subjects list and empty state untouched. |
| `client/src/modules/dashboard/components/active-careers-section.tsx` | Modify | Replace inline header markup with `DashboardSectionHeader`; keep careers list/progress untouched. |
| `client/src/modules/dashboard/components/index.ts` | Modify | Export `DashboardSectionHeader` only if tests or future module-local use need barrel access; section files can use relative imports without requiring export. |
| `client/src/modules/dashboard/pages/tests/home-page.test.tsx` | Modify | Update all `Resumen Académico` queries to `Resumen académico`; add targeted assertions for header typography/wrapper classes if not brittle. |
| `client/src/modules/dashboard/pages/tests/home-route.test.tsx` | Modify | Update route-level title casing assertions. |

## Interfaces / Contracts

```tsx
import type { LucideIcon } from 'lucide-react';

interface DashboardSectionHeaderProps {
    title: string;
    icon: LucideIcon;
}
```

Implementation note: render `const Icon = icon;` then `<Icon data-icon="inline-start" aria-hidden="true" />`. Suggested wrapper classes: `flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6`. Header row should use `flex min-w-0 items-center gap-2`; title can use `min-w-0 text-2xl font-bold tracking-normal`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Component/page | New title casing and unchanged section presence | Update Testing Library text queries in `home-page.test.tsx`. |
| Component/page | Header typography and icon wrapper | Prefer one focused DOM assertion on the academic heading/header wrapper classes to avoid repeating implementation checks three times. |
| Route integration | Authenticated `/` still renders dashboard home | Update `home-route.test.tsx` casing expectations only. |
| E2E | Not required | This is a presentational client-only change covered by Vitest/jsdom. |

## Migration / Rollout

No migration required. The change is static UI markup and class updates only.

## Open Questions

None.
