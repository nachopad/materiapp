## Exploration: logout-ui-integration

### Current State
Logout backend flow is already cookie-backed and safe: client calls `POST /auth/logout`, server clears access/refresh cookies, and client auth store resets local session state. On the frontend, both target UIs already render a logout control label (`Cerrar sesión`), but neither is wired to the existing auth integration (`useAuthStore().logout`) and no explicit post-logout navigation is attached.

TanStack Query is globally configured (`QueryClientProvider` in `main.tsx`) and the auth store currently performs `queryClient.clear()` during logout/clear, which protects session cleanup and cache isolation.

### Affected Areas
- `client/src/modules/auth/store/auth.store.ts` — canonical client logout behavior (`authService.logout()` + `queryClient.clear()` + anonymous reset).
- `client/src/modules/auth/services/auth.service.ts` — logout API contract (`POST /auth/logout`).
- `client/src/core/api/index.ts` — axios cookie session transport (`withCredentials: true`) and auth endpoint handling.
- `server/src/module/auth/controllers/auth.controller.ts` — backend logout cookie clearing (`clearCookie` on access/refresh cookies).
- `client/src/modules/profile/pages/profile.page.tsx` — profile page contains logout button UI without handler.
- `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` — sidebar dropdown contains logout item without handler.
- `client/src/core/router/index.tsx` — auth-gated route switching based on store status; logout should fall back to public routes.
- `client/src/modules/auth/components/route-gates.tsx` — redirect behavior on anonymous state (`/login`).
- `client/src/core/providers/query-client.ts` — query defaults that influence post-logout cache/refetch behavior.
- `client/src/core/providers/query-client.provider.tsx` + `client/src/main.tsx` — confirms TanStack Query provider is already mounted app-wide.
- `client/src/shared/components/ui/dropdown-menu.tsx` — sidebar logout action can use `DropdownMenuItem` click behavior.

### Approaches
1. **Direct store logout handlers in both UIs** — call `useAuthStore().logout()` directly from profile button and sidebar dropdown.
   - Pros: Minimal change, reuses existing cookie/session cleanup logic, low regression surface.
   - Cons: No mutation lifecycle (pending/error) and duplicated async handling in components.
   - Effort: Low

2. **TanStack Query mutation wrapper for logout** — create a shared `useLogoutMutation` hook that calls `authService.logout`, then centralizes cache clear + auth reset + navigation.
   - Pros: Aligns with user preference for TanStack Query, provides `isPending/isError`, single reusable flow for profile/sidebar/mobile.
   - Cons: Requires clear ownership boundary with Zustand store to avoid double-clearing and racey state transitions.
   - Effort: Medium

### Recommendation
Use **Approach 2** with a thin TanStack Query mutation as the UI integration layer, while preserving the existing auth store/session contract.

Practical shape:
- Keep `auth.store.ts` as source of truth for final anonymous state and query cleanup semantics.
- Expose a single logout action path to avoid divergence (either mutation calls `store.logout()` or store delegates to a shared logout executor, but not both independently).
- Wire both profile button and sidebar dropdown to the same hook so behavior is identical.
- After successful logout/reset, navigate to `/login` (or let route-gates do it by state change, but pick one deterministic strategy).

This keeps cookie-backed server logout and client cache/session cleanup intact while adopting TanStack Query where user interaction occurs.

### Risks
- **Double reset risk**: calling both mutation-level cleanup and store-level cleanup can produce redundant clear/reset calls.
- **Navigation timing risk**: manual navigate plus auth-route redirect can create flicker if both trigger.
- **Error UX risk**: backend logout failures are currently swallowed in store; UI may need explicit user feedback policy.
- **Coverage gap risk**: existing tests validate store/service behavior, but not profile/sidebar click wiring.

### Ready for Proposal
Yes — enough code-level context exists to define proposal/spec/tasks for unified logout wiring in profile + sidebar with TanStack Query-first UI integration and preserved cookie-session cleanup.
