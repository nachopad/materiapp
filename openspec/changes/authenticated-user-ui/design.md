# Design: Authenticated User UI

## Technical Approach

Wire authenticated identity at the UI composition points that currently read mock/profile identity. `useAuthUser()` remains the session source of truth. Profile-domain data stays in `useUserStore`; only the visible identity passed to `ProfileHeader` is composed auth-first. No backend, route, or store contract changes are required.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Auth identity source | Read `AuthUser` through `useAuthUser()` in each affected page/layout composition point. | Add identity to profile store or fetch `/profile`. | Auth bootstrap already hydrates session state before authenticated routes render, avoiding stale profile mocks and extra requests. |
| Fallbacks | Normalize UI fallbacks locally: display name `auth.name.trim() || profile.fullName || 'Usuario'`; email `auth.email.trim() || profile.email || 'Sin email disponible'`; dashboard first name from the first token of display name. | Change `AuthUser` to optional fields globally. | Current types say `name`/`email` are strings, while specs require missing/blank safety. Local normalization handles runtime drift without widening app-wide contracts. |
| Avatar | Keep current avatar fallback behavior and do not invent an auth avatar. Sidebar can receive `avatar?: string`; profile keeps `avatarUrl` from profile/mock data. | Add avatar to auth payload. | Proposal excludes avatar support and auth has no avatar field. |
| Profile header contract | Continue passing a `UserProfile`-shaped object to `ProfileHeader`, replacing only `fullName` and `email` when auth values exist. | Refactor `ProfileHeader` to separate identity props. | Minimizes change size and preserves account providers, universities, career progress, and tests. |

## Data Flow

```text
AuthBootstrap -> useAuthStore.user
        ├─ AppSidebar -> SidebarFooterComponent(user identity)
        ├─ HomePage -> welcome first name
        └─ ProfilePage -> displayUser identity override -> ProfileHeader

useUserStore.user/MOCK_USER -> Profile sections remain unchanged
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `client/src/shared/layout/sidebar/app-sidebar/app-sidebar.tsx` | Modify | Remove hardcoded `data.user`; call `useAuthUser()` and pass normalized name/email/avatar fallback to footer. Keep static role versions. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.tsx` | Modify | Accept `avatar?: string`; render `AvatarImage` only when present or pass undefined; compute `AvatarFallback` initials from display name with `CN`/`U` fallback; keep `truncate` and add `min-w-0` to text containers if needed. |
| `client/src/modules/dashboard/pages/home.page.tsx` | Modify | Prefer `useAuthUser()` first name over `userName` prop and profile store; keep `userName` as test/override fallback if still useful. Replace `space-y-4` with `flex flex-col gap-4` when touching the file. |
| `client/src/modules/profile/pages/profile.page.tsx` | Modify | Read `useAuthUser()` and compose `displayUser = { ...profileOrMock, fullName, email }` for `ProfileHeader`; pass original `displayUser` sections to existing section components. Remove `useCallback` manual memoization while touching handlers per React 19 rules. |
| `client/src/shared/layout/sidebar/app-sidebar/sidebar-footer.test.tsx` | Modify | Add cases for auth name/email rendering, missing email fallback, and no avatar fallback. |
| `client/src/modules/dashboard/pages/tests/home-page.test.tsx` | Modify | Mock auth hook/store and cover auth first-name and fallback greeting. |
| `client/src/modules/profile/pages/profile.page.test.tsx` | Modify | Mock auth identity mismatch and assert header uses auth identity while existing sections remain. |

## Interfaces / Contracts

No API changes. UI-normalized identity shape for affected components:

```ts
interface DisplayIdentity {
    name: string;
    email: string;
    avatar?: string;
}
```

Fallback rules are deterministic: trim strings before use; never render hardcoded `shadcn`/`m@example.com`; use `Usuario` for missing names and `Sin email disponible` for missing email.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit/component | Sidebar identity, avatar fallback, logout remains functional | Extend existing RTL tests with auth-like inputs and missing email/avatar cases. |
| Unit/component | Dashboard welcome | Mock `useAuthUser()` and assert first-name extraction plus generic fallback. |
| Unit/component | Profile auth-first identity | Mock auth/profile mismatch and assert header identity changes while providers/universities/progress still render. |
| Responsive | 390px long strings | Component-level class assertions for `truncate`/`min-w-0`; manual viewport verification during apply. |

## Migration / Rollout

No migration required. Rollback is a client-only revert of the affected files and tests.

## Open Questions

- [ ] Should the missing-email fallback copy be exactly `Sin email disponible`, or should product define different Spanish UI copy before apply?
