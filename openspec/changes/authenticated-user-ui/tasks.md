# Tasks: Authenticated User UI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~220–280 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Auth-first identity wiring across sidebar, dashboard, profile | PR 1 | Tests included; single self-contained PR |

## Phase 1: Foundation — Sidebar Footer Contract Update

- [x] 1.1 `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` — Update `SidebarFooterProps` to make `avatar` optional (`avatar?: string`); render `AvatarImage` only when `user.avatar` is truthy; compute `AvatarFallback` initials from display name with `CN`/`U` fallback; add `min-w-0` to text containers for truncation safety.
- [x] 1.2 `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx` — Add test cases for: auth name/email rendering, missing email fallback (`Sin email disponible`), no avatar fallback renders initials, and avatar present renders image.
- [x] 1.3 `client/src/shared/layout/sidebar/app-sidebar/app-sidebar.tsx` — Remove hardcoded `data.user` object; import `useAuthUser()` from `@/modules/auth/hooks/use-auth`; pass normalized auth identity to `SidebarFooterComponent` with fallback: name `auth.name?.trim() || 'Usuario'`, email `auth.email?.trim() || 'Sin email disponible'`, avatar `auth.avatar` (undefined if absent).

## Phase 2: Core Implementation — Auth-First Wiring

- [x] 2.1 `client/src/modules/dashboard/pages/home.page.tsx` — Import `useAuthUser()` from `@/modules/auth/hooks/use-auth`; compute `displayName` as `authUser?.name?.split(' ')[0] || userName || user?.fullName?.split(' ')[0] || 'Usuario'`; replace `space-y-4` with `flex flex-col gap-4` for Tailwind v4.
- [x] 2.2 `client/src/modules/dashboard/pages/tests/home-page.test.tsx` — Add `vi.mock('@/modules/auth/hooks/use-auth')` with mocked `useAuthUser` returning a user with first name; assert welcome text uses auth first name. Add case for undefined auth user asserting `'Usuario'` fallback.
- [x] 2.3 `client/src/modules/profile/pages/profile.page.tsx` — Import `useAuthUser()`; before the `displayUser` assignment, read `authUser` and compute `displayName = authUser?.name?.trim() || profileOrMock?.fullName`, `displayEmail = authUser?.email?.trim() || profileOrMock?.email`; compose `displayUser = { ...profileOrMock, fullName: displayName, email: displayEmail }`; remove `useCallback` from `handleChangePassword` and `handleLinkGoogle` (React 19 rules). Pass original `displayUser` to existing section components.
- [x] 2.4 `client/src/modules/profile/pages/profile.page.test.tsx` — Add `vi.mock('@/modules/auth/hooks/use-auth')` with mocked `useAuthUser` returning identity that differs from mock profile; assert `ProfileHeader` shows auth name/email while `UniversitiesSection` and `ProgressSection` render from mock data unchanged.

## Phase 3: Verification

- [x] 3.1 Run `pnpm test -- --run` and confirm all existing + new tests pass.
- [x] 3.2 Verify responsive layout: check `sidebar-footer.tsx` and `profile.page.tsx` at 390px viewport for truncation and no horizontal overflow.
- [x] 3.3 Confirm no hardcoded `shadcn`/`m@example.com` strings remain in affected files (grep pass).
