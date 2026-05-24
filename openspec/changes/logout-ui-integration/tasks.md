# Tasks: logout-ui-integration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250–350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Shared logout mutation hook + tests | PR 1 | Base = main; hook + unit tests included |
| 2 | Profile page logout wiring + tests | PR 1 | Same PR; profile button mutation, pending state |
| 3 | Sidebar logout wiring + tests | PR 1 | Same PR; dropdown item mutation, pending state |

## Phase 1: Foundation — Shared Mutation Hook

- [x] 1.1 Create `client/src/modules/auth/hooks/use-logout-mutation.ts` — TanStack Query `useMutation` wrapping `useAuthStore.getState().logout()`; `onSuccess` navigates to `/login` with `replace: true`; `onError` resets error state (no navigation). No pending copy needed in hook — components handle UI labels.
- [x] 1.2 Create `client/src/modules/auth/hooks/index.ts` barrel export if one doesn't already exist; add `useLogoutMutation` export.

## Phase 2: Core Implementation — Component Wiring

- [x] 2.1 Modify `client/src/modules/profile/pages/profile.page.tsx` — replace inert `<Button>` logout with mutation handler: import `useLogoutMutation`, call `mutate()` on click, pass `isPending` to `disabled`, show `"Cerrando sesión..."` label during pending. Remove `useCallback` for logout handler (React 19 Compiler handles it).
- [x] 2.2 Modify `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` — wire the existing `<DropdownMenuItem>` (LogOut icon, "Cerrar sesión") to `useLogoutMutation`: import hook, call `mutate()` on item `onSelect`, pass `disabled={isPending}` for `aria-disabled`; no onClick prop on item needed — `onSelect` triggers on keyboard/mouse activation.

## Phase 3: Testing

- [x] 3.1 Create `client/src/modules/auth/hooks/use-logout-mutation.test.tsx` — Vitest + Testing Library. Mock `useAuthStore.getState()` and `useNavigate`. Assert: mutation calls store logout once, navigates to `/login` with `{ replace: true }` on success.
- [x] 3.2 Create `client/src/modules/profile/pages/profile.page.test.tsx` — Mock `useLogoutMutation` to return `{ mutate, isPending: false }`. Assert: button click calls `mutate()` once. Mock `isPending: true` in second test; assert button is disabled.
- [x] 3.3 Create `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx` — Mock `useLogoutMutation`. Render dropdown, open menu, click logout item. Assert: `mutate()` called once. Assert `disabled` applied when `isPending: true`.

## Phase 4: Cleanup

- [x] 4.1 Run `cd client && pnpm typecheck` — fix any type errors.
- [x] 4.2 Run `cd client && pnpm lint` — fix any lint warnings.
- [x] 4.3 Verify at 390px viewport — profile logout button and sidebar dropdown remain accessible with pending state labels.