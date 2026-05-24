# Apply Progress: logout-ui-integration

## Mode

**Standard Mode** — no `strict_tdd` cache was found in Engram or OpenSpec during this session, so Standard Mode was used. The previous apply-progress also did not include TDD Cycle Evidence; this is consistent with Standard Mode execution.

## Task Completion

All original tasks from `tasks.md` were completed in a prior apply batch. This session addressed **verification blockers only**:

1. **Fixed `sidebar-breadcrumb.test.tsx` QueryClientProvider regression** — Added `QueryClientProvider` wrapper to existing sidebar breadcrumb tests because `SidebarFooterComponent` now uses `useLogoutMutation()`. Minimal change, no production behavior modified.
2. **Implemented recoverable logout error feedback** — Changed `auth.store.ts` `logout()` to throw on service error (preserving authenticated state), updated `useLogoutMutation` consumers (`profile.page.tsx`, `sidebar-footer.tsx`) to surface `isError` via accessible non-blocking error messages, and added focused UI-level tests.
3. **Updated auth store test** — Changed `logout: resets to anonymous even if service fails` to `logout: throws and preserves authenticated state on service failure` to match the new recoverable-error semantics.

### Completed Tasks (cumulative)
- [x] 1.1 Create use-logout-mutation.ts hook
- [x] 1.2 Create auth/hooks/index.ts barrel export
- [x] 2.1 Modify profile.page.tsx logout button wiring
- [x] 2.2 Modify sidebar-footer.tsx logout menu item wiring
- [x] 3.1 Create use-logout-mutation.test.tsx
- [x] 3.2 Create profile.page.test.tsx
- [x] 3.3 Create sidebar-footer.test.tsx
- [x] 4.1 Type check passed (changed files only; pre-existing unrelated errors remain)
- [x] 4.2 Lint passed (changed files only; pre-existing unrelated errors remain)
- [x] 4.3 Responsive verification (pending state labels accessible)

### Verification Blockers Fixed
- [x] Full client test regression: `sidebar-breadcrumb.test.tsx` now wrapped with `QueryClientProvider`
- [x] Spec-required recoverable logout error feedback implemented and tested in profile/sidebar
- [x] Strict TDD apply-progress note resolved: Standard Mode confirmed

## Files Changed (this session)

| File | Action | What Was Done |
|------|--------|---------------|
| `client/src/modules/auth/store/auth.store.ts` | Modified | `logout()` now throws on service error without clearing state, enabling recoverable error semantics |
| `client/src/modules/auth/store/auth.store.test.ts` | Modified | Updated failing-service test to assert throw + preserved state; added `AUTH_ROLE` import |
| `client/src/modules/profile/pages/profile.page.tsx` | Modified | `LogoutButton` surfaces `isError` with accessible error alert below button |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` | Modified | Dropdown logout surfaces `isError` with accessible error alert in menu content |
| `client/src/modules/profile/pages/profile.page.test.tsx` | Modified | Refactored mock to object pattern; added error feedback assertion |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx` | Modified | Refactored mock to object pattern; added error feedback assertion |
| `client/src/shared/layout/sidebar/tests/sidebar-breadcrumb.test.tsx` | Modified | Added `QueryClientProvider` wrapper to fix regression from `useLogoutMutation` usage in sidebar footer |

## Verification Results (this session)

- **Focused logout + regression tests**: `pnpm vitest run src/modules/auth/ src/modules/profile/pages/profile.page.test.tsx src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx src/shared/layout/sidebar/tests/sidebar-breadcrumb.test.tsx` — 22 passed / 0 failed
- **Full auth module tests**: `pnpm vitest run src/modules/auth/` — 37 passed / 0 failed
- **Full client test suite**: `pnpm vitest run` — 280 passed / 5 failed (all pre-existing unrelated failures in progress/dashboard; change-related regression FIXED)
- **Lint (changed files)**: Passed (no errors)
- **Type check (changed files)**: Passed (no new errors; pre-existing unrelated errors remain)

## Deviations from Design

- The original design deferred error UX policy. This session implemented it because the spec requires recoverable error feedback. The implementation preserves the design principle that the mutation calls store logout (not service/cache directly), but changes the store contract so that transport/server errors propagate rather than being swallowed.

## Issues Found

None new. Pre-existing project-wide typecheck and lint errors in unrelated files remain.

## Status

10/10 tasks complete. Verification blockers resolved. Ready for re-verify.
