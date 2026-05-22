## Exploration: home-section-title-style

### Current State
The logged-in home/dashboard sections are not in `client/src/modules/home/home.page.tsx` (public landing), but in `client/src/modules/dashboard/pages/home.page.tsx` through three composed components:

- `AcademicSummarySection`
- `CurrentSubjectsSection`
- `ActiveCareersSection`

Current heading implementation in dashboard components uses:

- Title text classes: `text-xl font-semibold` on `<h2>`
- Icon wrapper classes: `aspect-square h-6 w-6 rounded-sm border border-border flex items-center justify-center shrink-0`
- Icon classes: `h-4 w-4 text-primary`

Profile section title style source is currently inline (not via a shared component) in:

- `client/src/modules/profile/components/account-section.tsx`
- `client/src/modules/profile/components/universities-section.tsx`
- `client/src/modules/profile/components/progress-section.tsx`

All three profile section titles use `<h1 className="text-2xl font-bold tracking-normal">...`.

Icon visual style reference requested by user maps to `client/src/shared/components/empty-search.tsx`, where icon wrapper is provided by `EmptyMedia variant="icon"` (from `@/shared/components/ui/empty`).

### Affected Areas
- `client/src/modules/dashboard/pages/home.page.tsx` — parent that composes the 3 target sections.
- `client/src/modules/dashboard/components/academic-summary-section.tsx` — title text `Resumen Académico` and icon wrapper.
- `client/src/modules/dashboard/components/current-subjects-section.tsx` — section title and icon wrapper.
- `client/src/modules/dashboard/components/active-careers-section.tsx` — section title and icon wrapper.
- `client/src/modules/profile/components/account-section.tsx` — source of desired title style (`text-2xl font-bold tracking-normal`).
- `client/src/modules/profile/components/universities-section.tsx` — source of desired title style.
- `client/src/modules/profile/components/progress-section.tsx` — source of desired title style.
- `client/src/shared/components/empty-search.tsx` — reference usage of `EmptyMedia variant="icon"`.
- `client/src/shared/components/ui/empty.tsx` — actual icon wrapper style implementation behind `EmptyMedia` (must be reused or mirrored).
- `client/src/modules/dashboard/pages/tests/home-page.test.tsx` and `client/src/modules/dashboard/pages/tests/home-route.test.tsx` — assertions currently expecting `Resumen Académico` exact casing.

### Approaches
1. **Direct class alignment in each dashboard section** — Update each section title class and icon wrapper markup inline.
   - Pros: Fastest change, minimal moving parts.
   - Cons: Duplicates style structure in 3 files; future drift likely.
   - Effort: Low

2. **Create shared DashboardSectionHeader component** — Encapsulate icon wrapper + heading typography and reuse across 3 sections.
   - Pros: Single source of truth for dashboard section headers; cleaner maintenance; easy future extension.
   - Cons: Slightly larger diff now (new component + imports + tests touch).
   - Effort: Medium

3. **Promote a cross-module shared SectionHeader (dashboard + profile ready)** — New shared component used by dashboard now, optionally adopt in profile later.
   - Pros: Real design-system alignment and de-duplication across modules.
   - Cons: Broader scope than request; higher review surface and regression risk.
   - Effort: Medium/High

### Recommendation
Use **Approach 2** (shared `DashboardSectionHeader` within dashboard module) for this change scope.

Why:
- Satisfies requested consistency across all 3 dashboard sections with one implementation point.
- Keeps scope tight to requested feature (no cross-module refactor now).
- Enables exact text change (`Resumen académico`) and icon style harmonization with minimal risk.

Implementation scope recommendation:
- Change `Resumen Académico` → `Resumen académico` in `academic-summary-section.tsx`.
- Replace current custom icon wrapper with `EmptyMedia`-equivalent visual style using primary color icon (either by reusing `EmptyMedia` directly or mirroring its classes in one local header component).
- Apply profile-equivalent title typography (`text-2xl font-bold tracking-normal`) to all 3 section titles.
- Update tests that assert title casing and potentially heading role/level queries.

### Risks
- Test breakage due to exact text assertion on `Resumen Académico`.
- Potential visual mismatch if `EmptyMedia` includes additional internal styles not replicated exactly.
- Semantic heading level differences (`h1` in profile vs `h2` in dashboard) may affect accessibility/testing if changed without intent.

### Ready for Proposal
Yes — scope is clear, files are identified, and implementation can be contained under dashboard components + tests.
