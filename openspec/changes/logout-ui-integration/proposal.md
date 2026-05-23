# Proposal: Logout UI Integration

## Intent

Make logout functional from the profile page and sidebar while preserving the existing cookie-backed server logout and auth store cache/session cleanup.

## Scope

### In Scope
- Add a shared TanStack Query logout mutation for client UI triggers.
- Wire profile and sidebar logout controls to the shared flow.
- Preserve `auth.store.ts` as the single cleanup path for cookie logout, query cache clearing, and anonymous auth state.
- Use one deterministic post-logout navigation behavior.

### Out of Scope
- Changing backend logout cookie semantics.
- Reworking the full auth store architecture.
- Adding broad auth/session redesign beyond logout UI wiring.

## Capabilities

### New Capabilities
- `logout-ui-session`: Covers user-triggered logout from authenticated UI surfaces and resulting client session cleanup.

### Modified Capabilities
- None — no existing `openspec/specs/` capabilities are present.

## Approach

Create a thin reusable logout mutation hook in the auth client module. The mutation should call the existing store logout action rather than duplicating `authService.logout()`, `queryClient.clear()`, or state reset logic. Profile and sidebar components consume the same hook, use mutation `isPending` to prevent duplicate clicks, and rely on a single chosen redirect path to `/login` after anonymous state is established.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `client/src/modules/auth/store/auth.store.ts` | Modified | Preserve/logout cleanup contract; expose or reuse the canonical action. |
| `client/src/modules/auth/hooks/` | New | Shared TanStack Query logout mutation hook. |
| `client/src/modules/profile/pages/profile.page.tsx` | Modified | Wire profile logout button. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` | Modified | Wire sidebar dropdown logout item. |
| `client/src/core/router/index.tsx` | Modified | Confirm deterministic post-logout route behavior if needed. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Double cleanup/reset | Medium | Mutation delegates to store logout only; no duplicate service/cache calls. |
| Redirect flicker | Medium | Choose one redirect mechanism and test route-gate behavior. |
| Silent logout failure UX | Low | Keep current store behavior unless specs require visible errors. |

## Rollback Plan

Remove the shared logout hook and component handlers, returning both logout UI controls to inert display-only behavior. No backend rollback required.

## Dependencies

- Existing TanStack Query provider and auth store logout implementation.

## Success Criteria

- [ ] Profile logout calls the existing logout cleanup path and reaches `/login`.
- [ ] Sidebar logout behaves identically and prevents duplicate submissions while pending.
- [ ] Query cache and auth state are cleared exactly once per logout attempt.
