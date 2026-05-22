# Proposal: Home Section Title Style

## Intent

Align the authenticated dashboard home section headers with Profile section title typography and the `EmptySearch` icon-wrapper visual language, while fixing the academic summary title casing.

## Scope

### In Scope
- Update the three dashboard home section titles to use Profile-equivalent typography: `text-2xl font-bold tracking-normal`.
- Rename `Resumen Académico` to `Resumen académico`.
- Standardize the three title icon wrappers to match `EmptyMedia variant="icon"` proportions/shape while keeping icons in primary color.
- Update affected dashboard home tests for the new title casing and stable assertions.

### Out of Scope
- Public marketing home page changes.
- Refactoring Profile sections into a shared cross-module header.
- Changing dashboard cards, mock data, routes, or empty-state content.

## Capabilities

### New Capabilities
- `dashboard-home-ui`: Covers authenticated dashboard home section heading text, typography, and icon presentation.

### Modified Capabilities
- None.

## Approach

Use a dashboard-local `DashboardSectionHeader` component so the three section headers share one implementation point. Preserve current heading semantics unless a later spec explicitly changes levels; only align visual typography with Profile titles. Reuse `EmptyMedia variant="icon"` if practical, or mirror its classes locally with primary icon color.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `client/src/modules/dashboard/components/*section.tsx` | Modified | Replace inline header markup and update academic title casing. |
| `client/src/modules/dashboard/components/dashboard-section-header.tsx` | New | Local shared header for dashboard sections. |
| `client/src/shared/components/ui/empty.tsx` | Reference | Source for icon-wrapper style; no change expected. |
| `client/src/modules/dashboard/pages/tests/*.tsx` | Modified | Update text assertions from `Resumen Académico` to `Resumen académico`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Exact text assertions fail | High | Update all dashboard route/page tests. |
| Icon wrapper visually drifts from `EmptyMedia` | Medium | Prefer reuse or copy classes from `empty.tsx` into one component only. |
| Heading semantics change accidentally | Low | Keep existing `h2` unless specs require otherwise. |

## Rollback Plan

Revert the new header component and restore the previous inline header markup/title casing in the three dashboard section components and tests.

## Dependencies

- Existing `EmptyMedia` styles in `client/src/shared/components/ui/empty.tsx`.
- Existing Profile title typography reference.

## Success Criteria

- [ ] The three dashboard home section titles visually match Profile section titles.
- [ ] Header icons use an `EmptyMedia variant="icon"`-equivalent wrapper with primary-colored icons.
- [ ] `Resumen académico` appears everywhere instead of `Resumen Académico`.
- [ ] Dashboard home tests pass with updated assertions.
