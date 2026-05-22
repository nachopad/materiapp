# Tasks: Frontend Auth Integration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~660-700 (12 files) |
| 400-line budget risk | **High** |
| Chained PRs recommended | **Yes** |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: **Yes**
Chained PRs recommended: **Yes**
Chain strategy: **stacked-to-main** (recommended) or **feature-branch-chain**
400-line budget risk: **High**

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Core auth layer: types, store, service, API interceptor | PR 1 | Independent base; tests included |
| 2 | UI integration: bootstrap, route gates, login, router wiring | PR 2 | Depends on PR 1 |
| 3 | CSRF integration + tests (blocked until backend decision) | PR 3 | Depends on PR 2; CSRF backend question must resolve |

### CSRF Open Question Decision

**Decision needed**: First slice (PR 1–2) can implement read-only auth without protected mutation CSRF support. The CSRF helper (`ensureCsrfToken`) will be stubbed (returns `Promise.resolve()`) so login/logout/profile/refresh work immediately. Protected mutation CSRF injection goes in PR 3 after backend decision.

This is safe because:
- Login/logout/refresh/profile are **non-mutating or already-excluded** from CSRF in the backend design
- The interceptor skips auth endpoints in the refresh path
- PR 3 can be a pure backend or pure frontend task depending on whose decision it is

**Recommendation**: Accept first slice (PR 1–2) as auth-without-CSRF-protected-mutations. PR 3 adds CSRF when backend is ready.

---

## Phase 1: Core Auth Layer (PR 1)

- [x] 1.1 Create `client/src/core/api/types.ts` — Axios retry metadata (`_authRetry`, `_skipAuth`), API error shape (`UnauthorizedError`, `ApiError`).
- [x] 1.2 Create `client/src/modules/auth/types/auth.types.ts` — `AUTH_ROLE` const map, `AuthRole` type, `AuthUser` interface, `LoginCredentials`, `SessionStatus` discriminated union.
- [x] 1.3 Create `client/src/modules/auth/store/auth.store.ts` — Zustand store with `idle/loading/authenticated/anonymous` status, user field, `bootstrap/login/logout/clear` actions. No token persistence. Persist middleware with `name: 'auth-storage'`.
- [x] 1.4 Create `client/src/modules/auth/services/auth.service.ts` — `login()`, `logout()`, `profile()`, `refresh()`, `fetchCsrfToken()` functions calling `api`. Return typed responses. Throws on HTTP error.
- [x] 1.5 Create `client/src/modules/auth/hooks/use-auth.ts` — Selector helpers: `useAuthStore()`, `useIsAuthenticated()`, `useHasRole(role)`, `useAuthUser()` using Zustand `useShallow` where needed.
- [x] 1.6 Modify `client/src/core/api/index.ts` — Add `Accept-Version: 1` default header, one-shot 401 refresh queue (module-level `refreshPromise`), skip list for auth endpoints, retry with `_authRetry` marker, clear store on refresh failure, CSRF header injection stub (returns immediately for now).

## Phase 2: UI Integration (PR 2)

- [x] 2.1 Create `client/src/modules/auth/components/auth-bootstrap.tsx` — `"use client"` component. Calls `bootstrap()` once on mount. Renders loading boundary while status is `idle` or `loading`. Returns `null` once `anonymous` or `authenticated`.
- [x] 2.2 Create `client/src/modules/auth/components/route-gates.tsx` — `ProtectedRoute`, `PublicOnlyRoute`, `RoleRoute` components using `useAuthStore()`, `Navigate`, and `Outlet`. Redirect to `/login` for protected, `/` for public-only.
- [x] 2.3 Modify `client/src/modules/auth/components/login-form.tsx` — Replace `setTimeout` with `authService.login()`. Wire `setIsLoading` and form `onSubmit`. On success: store user, navigate to `/`. On error: show form error via `FormMessage`. Remove `console.log`.
- [x] 2.4 Modify `client/src/core/router/index.tsx` — Wrap `<Routes>` in `<AuthBootstrap>`. Use `<ProtectedRoute>` and `<RoleRoute>` instead of placeholder `isAuthenticated`/`role` booleans. Remove hardcoded placeholders.
- [x] 2.5 Modify `client/src/core/providers/query-client.provider.tsx` — Export `queryClient` reference or add `resetAuthQueries()` helper to clear auth-sensitive cached queries on logout.

## Phase 3: Testing (PR 2 or PR 3)

- [x] 3.1 Write `client/src/modules/auth/store/auth.store.test.ts` — Test all state transitions: idle→loading→authenticated, idle→loading→anonymous, logout clears user, clear resets to anonymous.
- [x] 3.2 Write `client/src/core/api/interceptors.test.ts` — Mock Axios adapter. Test: single refresh on 401, concurrent 401s share one refresh, skipped endpoints don't trigger refresh, retry fires once with `_authRetry`, refresh failure clears store.
- [x] 3.3 Write `client/src/modules/auth/components/login-form.test.tsx` — Render with mock `authService.login`. Test: submit calls service, loading state disables button, error shows `FormMessage`, success navigates.
- [x] 3.4 Write `client/src/modules/auth/components/route-gates.test.tsx` — Test `<ProtectedRoute>` redirects to `/login` when anonymous, renders children when authenticated. Test `<RoleRoute>` allows admin for `admin` role, redirects for non-admin.