# Design: Frontend Auth Integration

## Technical Approach

Replace router/login placeholders with a cookie-backed session layer. `api` remains the single Axios instance, always sends cookies and `Accept-Version: 1`, and owns refresh retry behavior. Auth state keeps only user/session metadata in Zustand; JWTs stay in `httpOnly` cookies. Router gates render after bootstrap to avoid redirect flicker.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Axios interceptor in `core/api` vs per-service retry | Centralizes auth/version/CSRF behavior but requires careful endpoint skipping. | Use central request/response interceptors with a one-retry marker and skipped auth endpoints. |
| Zustand store vs React context only | Store can be used outside React by interceptors; context is simpler but component-bound. | Create `modules/auth/store/auth.store.ts` for status/user/actions; optional provider only triggers bootstrap. |
| Store profile from login vs always fetch profile | Login already returns user, but profile is source of truth after reload. | Set user from login response, then use `/auth/profile` for bootstrap and post-refresh verification. |
| Role strings vs enum union | Backend returns strings; frontend needs safe checks. | Define const `AUTH_ROLE` and `AuthRole` from const values (`admin`, `user`, `student`). Unknown roles are ignored for gates. |
| CSRF cookie read vs token endpoint response | Current backend sets an `httpOnly` CSRF cookie and returns only a message, so JS cannot read the cookie. | Design client `ensureCsrfToken()` around `GET /security/csrf-token`; leave `X-CSRF-Token` injection as blocked until backend exposes a readable token or non-httpOnly companion. |

## Data Flow

```text
LoginForm -> auth.service.login -> api POST /auth/login -> cookies set
         -> auth.store.user -> navigate protected route

App bootstrap -> /auth/profile --401--> refresh queue -> /auth/refresh
                                └─success retry profile / failure clear store

Protected mutation -> ensureCsrfToken -> api mutation with cookies/version
```

Refresh uses one module-level `refreshPromise`. Concurrent 401s await it, retry once with `_authRetry = true`, and never refresh for `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/register`, or `/security/csrf-token`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `client/src/core/api/index.ts` | Modify | Add `Accept-Version`, `withCredentials`, CSRF helper hooks, refresh queue, retry/clear-session integration. |
| `client/src/core/api/types.ts` | Create | Typed Axios retry metadata and API error shape. |
| `client/src/modules/auth/types/auth.types.ts` | Create | `AuthUser`, `AuthRole`, credentials, session status, const role map. |
| `client/src/modules/auth/services/auth.service.ts` | Create | Login, logout, profile, refresh, CSRF endpoint calls. |
| `client/src/modules/auth/store/auth.store.ts` | Create | Zustand store: `idle/loading/authenticated/anonymous`, user, `bootstrap/login/logout/clear`. No token persistence. |
| `client/src/modules/auth/hooks/use-auth.ts` | Create | Selector helpers (`useIsAuthenticated`, `useHasRole`) using Zustand selectors. |
| `client/src/modules/auth/components/auth-bootstrap.tsx` | Create | Calls bootstrap once and renders loading boundary during unknown state. |
| `client/src/modules/auth/components/route-gates.tsx` | Create | `ProtectedRoute`, `PublicOnlyRoute`, `RoleRoute` using `<Navigate />`. |
| `client/src/modules/auth/components/login-form.tsx` | Modify | Replace timeout with auth login action, pending/error UI, redirect on success. |
| `client/src/core/router/index.tsx` | Modify | Wrap routes in bootstrap and gate public/user/admin branches. |
| `client/src/core/providers/query-client.provider.tsx` | Modify | Export query client or clear auth-sensitive queries on logout. |
| `client/src/modules/auth/**/*.test.ts(x)` | Create | Store, interceptor, login, and route gate tests. |

## Interfaces / Contracts

```ts
const AUTH_ROLE = { ADMIN: 'admin', USER: 'user', STUDENT: 'student' } as const;
type AuthRole = (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE];

interface AuthUser { id: string; email: string; name: string; roles: AuthRole[]; isGoogleUser: boolean; }
interface AuthState { status: 'idle' | 'loading' | 'authenticated' | 'anonymous'; user: AuthUser | null; }
```

Backend endpoints are versioned by `Accept-Version: 1`: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/profile`, `GET /security/csrf-token`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Role helpers, user mapper, store transitions | Vitest against pure functions/store state. |
| Integration | 401 refresh queue, one retry, skipped endpoints, logout on refresh failure | Mock Axios adapter or mocked service promises; assert single refresh for concurrent 401s. |
| Component | Login submit, route gates, bootstrap loading/no flicker | Testing Library with `MemoryRouter`; mock auth service/store. |
| Manual | Real cookie login, reload hydration, cross-origin cookies, CSRF mutation | Browser against backend; inspect cookies/network headers. |

## Migration / Rollout

No data migration required. Roll out behind normal frontend deployment; rollback restores placeholder auth/router. Before protected mutations, backend must expose a usable CSRF token because the current CSRF cookie is `httpOnly`.

## Open Questions

- [ ] Should backend change `/security/csrf-token` to return the token body value or set a readable companion cookie for `X-CSRF-Token`?
