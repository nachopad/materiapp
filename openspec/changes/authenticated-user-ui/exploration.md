## Exploration: authenticated-user-ui

### Current State
Authenticated user data already exists in `useAuthStore` (`AuthUser` with `name` and `email`) and is hydrated through `AuthBootstrap` calling `/auth/profile`. However, the sidebar footer is still fed by hardcoded mock data from `app-sidebar.tsx` (`shadcn`, `m@example.com`).

Profile page currently renders user identity from `useUserStore`, but it still falls back to `MOCK_USER` and does not call `fetchProfile()` yet. Dashboard home (`modules/dashboard/pages/home.page.tsx`) currently reads `useUserStore` and falls back to `Usuario`, so greeting may not reflect authenticated identity unless profile data has been loaded.

### Affected Areas
- `client/src/shared/layout/sidebar/app-sidebar/app-sidebar.tsx` — currently injects static `data.user` into sidebar footer.
- `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` — presentation for name/email in footer trigger and menu label.
- `client/src/modules/auth/store/auth.store.ts` — source of truth for authenticated `name`/`email`.
- `client/src/modules/auth/hooks/use-auth.ts` — exposes `useAuthUser()` selector for easy UI consumption.
- `client/src/modules/profile/pages/profile.page.tsx` — still uses `MOCK_USER`; needs authenticated user-backed display strategy.
- `client/src/modules/dashboard/pages/home.page.tsx` — greeting string `¡Bienvenido, {displayName}!` currently based on profile store.

### Approaches
1. **Auth-first identity wiring (recommended)** — use `useAuthUser()` for sidebar and dashboard greeting; keep profile module data for profile-specific sections.
   - Pros: Uses existing authenticated source immediately after bootstrap; removes hardcoded sidebar identity; minimal coupling.
   - Cons: Profile page still needs decision on merging auth identity with profile details if `/profile` is not ready.
   - Effort: Medium.

2. **Profile-first identity wiring** — load/normalize identity exclusively from `useUserStore` and ensure profile fetch runs globally.
   - Pros: Single source for all profile-related UI.
   - Cons: Higher risk and scope creep (global fetch timing, fallback states, dependency on profile endpoint readiness).
   - Effort: High.

### Recommendation
Adopt **Auth-first identity wiring** now: sidebar footer and dashboard welcome should consume `useAuthUser()` (`name`, `email`) because auth bootstrap already guarantees this data on authenticated routes. In profile page, keep existing profile sections but stop hard dependency on `MOCK_USER` for identity header by prioritizing auth identity as fallback until real profile fetch is fully enabled.

### Risks
- Inconsistent naming fields (`AuthUser.name` vs `UserProfile.fullName`) can produce different display names across pages if not normalized.
- Profile endpoint readiness is still uncertain; forcing profile-first could regress UX with empty or loading states.
- Sidebar avatar currently expects `avatar`; auth user type has no avatar field, so UI must keep safe fallback behavior.

### Ready for Proposal
Yes — scope is clear and bounded to identity source wiring for sidebar footer, profile identity display, and dashboard greeting.
