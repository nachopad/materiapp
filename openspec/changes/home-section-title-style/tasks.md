# Tasks: Home Section Title Style

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~100-150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

**Decision needed before apply**: No
**Chained PRs recommended**: No
**Chain strategy**: pending
**400-line budget risk**: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Create DashboardSectionHeader component and update all 3 sections | PR 1 | Tests included |

## Phase 1: Component Creation

- [x] 1.1 Create `client/src/modules/dashboard/components/dashboard-section-header.tsx` with `DashboardSectionHeader` component accepting `title: string` and `icon: LucideIcon` props; use `h2` with `text-2xl font-bold tracking-normal`; icon wrapper uses `flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary [&_svg:not([class*='size-'])]:size-6` classes

## Phase 2: Section Updates

- [x] 2.1 Update `academic-summary-section.tsx`: replace inline header markup with `<DashboardSectionHeader title="Resumen académico" icon={ChartLine} />`
- [x] 2.2 Update `current-subjects-section.tsx`: replace inline header with `<DashboardSectionHeader title="Materias cursando actualmente" icon={BookOpen} />`
- [x] 2.3 Update `active-careers-section.tsx`: replace inline header with `<DashboardSectionHeader title="Carreras activas" icon={GraduationCap} />`

## Phase 3: Testing

- [x] 3.1 Update `home-page.test.tsx`: change all `Resumen Académico` queries to `Resumen académico`
- [x] 3.2 Update `home-route.test.tsx`: update casing expectations for academic summary title
- [x] 3.3 Run tests: `cd client && pnpm test -- --run`

## Phase 4: Verification

- [x] 4.1 Build check: `cd client && pnpm build`
- [x] 4.2 Verify at 390px mobile width in dev mode

## Phase 5: Verification Fixes (Strict TDD Compliance)

- [x] 5.1 Add mandatory TDD Cycle Evidence table to apply-progress
- [x] 5.2 Add focused runtime tests for 4 uncovered spec scenarios:
  - [x] 5.2.1 Typography parity with Profile section titles
  - [x] 5.2.2 Icon wrapper parity with EmptySearch/EmptyMedia variant icon using primary color
  - [x] 5.2.3 Responsive preservation / overflow-safe classes
  - [x] 5.2.4 Heading semantics preservation
