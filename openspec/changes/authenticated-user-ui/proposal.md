# Proposal: Authenticated User UI

## Intent

Replace mock or stale identity display with authenticated user data already hydrated by auth bootstrap, so authenticated routes show the real user's name/email in the sidebar footer, profile identity header, and dashboard welcome.

## Scope

### In Scope
- Sidebar footer identity reads from auth user instead of hardcoded `shadcn` data.
- Dashboard home welcome uses authenticated first name with safe fallback.
- Profile identity header prioritizes auth user identity while keeping existing profile sections.
- Tests cover authenticated, missing-name, and missing-email fallback behavior.

### Out of Scope
- Backend or `/profile` endpoint changes.
- Avatar upload/profile photo support.
- Reworking account providers, universities, or career progress data.
- Application code changes in this proposal phase.

## Capabilities

### New Capabilities
- `authenticated-user-identity`: Authenticated client UI MUST render identity from the auth session source of truth across shell, profile header, and dashboard welcome.

### Modified Capabilities
- None; no existing OpenSpec specs were found.

## Approach

Use the exploration-recommended auth-first wiring. Treat `useAuthUser()` / `AuthUser` as the source for `name` and `email` on authenticated routes. Keep `useUserStore` for profile-specific domain sections, but compose the profile header identity from auth data first, then profile/mock-safe fallbacks. Preserve existing shadcn `AvatarFallback` behavior because auth has no avatar field.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `client/src/shared/layout/sidebar/app-sidebar/app-sidebar.tsx` | Modified | Remove hardcoded footer user and pass auth identity. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` | Modified | Accept optional avatar/email-safe identity and render fallbacks. |
| `client/src/modules/dashboard/pages/home.page.tsx` | Modified | Prefer auth first name for welcome. |
| `client/src/modules/profile/pages/profile.page.tsx` | Modified | Prioritize auth identity for `ProfileHeader`. |
| `client/src/modules/auth/hooks/use-auth.ts` | Reused | Existing `useAuthUser()` selector remains the auth UI entrypoint. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Name mismatch between `AuthUser.name` and `UserProfile.fullName` | Med | Normalize display name selection in UI tests. |
| Missing avatar in auth user | High | Keep `AvatarFallback`; do not require avatar. |
| Empty auth user during bootstrap | Low | Authenticated layout already bootstraps; keep safe fallback text. |

## Rollback Plan

Revert the affected client files to previous mock/profile-store behavior and restore prior tests. No data migration or server rollback is needed.

## Dependencies

- Existing auth bootstrap and `useAuthUser()` selector.
- Existing shadcn sidebar/avatar components.

## Success Criteria

- [ ] Sidebar footer displays authenticated name/email instead of `shadcn` / `m@example.com`.
- [ ] Dashboard welcome uses authenticated first name when present.
- [ ] Profile header shows authenticated identity without breaking profile sections.
- [ ] Responsive layout remains safe at 390px with truncation/fallbacks.
