# Design: Logout UI Integration

## Technical Approach

Use the existing cookie-backed auth flow as the source of truth and add a shared TanStack Query mutation for UI orchestration. No proposal/spec artifact was found in Engram or OpenSpec, so this design depends on the existing exploration and the launch goal. The mutation will call the existing `useAuthStore().logout()` action, then navigate to `/login` with `replace: true`; cleanup remains inside the store to avoid duplicated cache/session reset.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Logout ownership | Mutation calls `useAuthStore.getState().logout()` | Mutation calls `authService.logout()` and clears store/query itself | Keeps one cleanup owner: `auth.store.ts` already swallows backend errors, clears `queryClient`, and resets anonymous state. |
| Shared UI API | Create `client/src/modules/auth/hooks/use-logout-mutation.ts` | Inline handlers in profile/sidebar | One hook provides identical pending, error, and navigation behavior for both controls. |
| Navigation | `useNavigate()` inside hook, `navigate('/login', { replace: true })` after mutation success/settle | Rely only on route-gates | Deterministic UX; `replace` prevents returning to protected pages after logout. Route gates remain fallback protection. |
| Pending state | Disable both logout controls and expose pending copy/ARIA | No pending UI | Prevents double-click duplicate logout calls and communicates progress. |

## Data Flow

```text
Profile Button / Sidebar Item
        │ click
        ▼
useLogoutMutation.mutate()
        │ mutationFn
        ▼
useAuthStore.getState().logout()
        │
        ├─ authService.logout() → POST /auth/logout
        └─ finally: queryClient.clear() + anonymous state
        ▼
navigate('/login', { replace: true })
```

## File Changes

| File | Action | Description |
|---|---|---|
| `client/src/modules/auth/hooks/use-logout-mutation.ts` | Create | Shared TanStack Query mutation hook wrapping store logout and navigation. |
| `client/src/modules/auth/hooks/index.ts` | Create/modify if needed | Barrel export for auth hooks if current imports need it. |
| `client/src/modules/profile/pages/profile.page.tsx` | Modify | Replace inert logout button with mutation handler, disabled pending state, and pending label. Also remove manual `useCallback` patterns while touching imports. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` | Modify | Wire dropdown logout item to the shared hook; disable while pending and keep menu behavior. |
| `client/src/modules/auth/hooks/use-logout-mutation.test.tsx` | Create | Tests mutation calls store logout and navigates with replace. |
| `client/src/modules/profile/pages/profile.page.test.tsx` | Create | Tests profile logout button calls mutation and disables during pending. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx` | Create | Tests dropdown logout item calls mutation and disables during pending. |

## Interfaces / Contracts

```ts
export function useLogoutMutation() {
    return useMutation({
        mutationFn: () => useAuthStore.getState().logout(),
        onSuccess: () => navigate('/login', { replace: true }),
    });
}
```

The hook returns TanStack Query's mutation object; components use `mutate`, `isPending`, and optionally `isError` if later UI copy is added.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Hook delegates to store logout once and navigates after completion | Vitest + Testing Library hook/component harness with mocked `useNavigate` and store. |
| Component | Profile button and sidebar dropdown trigger same mutation and respect `isPending` | Mock `useLogoutMutation`; assert click behavior, disabled state, labels. |
| Regression | Existing store logout still clears anonymous state even on service failure | Keep existing `auth.store.test.ts`; add/adjust if cleanup ownership changes. |

## Migration / Rollout

No migration required. This is client-only wiring over existing auth endpoints and store behavior.

## Open Questions

- [ ] Missing proposal/spec artifacts: downstream phases should create/validate requirements before apply if strict SDD gating is required.
- [ ] Error UX policy for logout failures is intentionally deferred because the current store treats logout as always-finally reset.
