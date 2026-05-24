# Apply Progress: Frontend Auth Integration — PR 1 Core Auth Layer + PR 2 UI Integration + Remaining Tests

## Completed Tasks

### Phase 1: Core Auth Layer (PR 1)
- [x] 1.1 Create `client/src/core/api/types.ts` — Axios retry metadata (`_authRetry`, `_skipAuth`), API error shape (`UnauthorizedError`, `ApiError`).
- [x] 1.2 Create `client/src/modules/auth/types/auth.types.ts` — `AUTH_ROLE` const map, `AuthRole` type, `AuthUser` interface, `LoginCredentials`, `SessionStatus` discriminated union.
- [x] 1.3 Create `client/src/modules/auth/store/auth.store.ts` — Zustand store with `idle/loading/authenticated/anonymous` status, user field, `bootstrap/login/logout/clear` actions. No token persistence. Persist middleware with `name: 'auth-storage'`.
- [x] 1.4 Create `client/src/modules/auth/services/auth.service.ts` — `login()`, `logout()`, `profile()`, `refresh()`, `fetchCsrfToken()` functions calling `api`. Return typed responses. Throws on HTTP error.
- [x] 1.5 Create `client/src/modules/auth/hooks/use-auth.ts` — Selector helpers: `useAuthStore()`, `useIsAuthenticated()`, `useHasRole(role)`, `useAuthUser()` using Zustand `useShallow` where needed.
- [x] 1.6 Modify `client/src/core/api/index.ts` — Add `Accept-Version: 1` default header, one-shot 401 refresh queue (module-level `refreshPromise`), skip list for auth endpoints, retry with `_authRetry` marker, clear store on refresh failure, CSRF header injection stub (returns immediately for now).

### Phase 2: UI Integration (PR 2)
- [x] 2.1 Create `client/src/modules/auth/components/auth-bootstrap.tsx` — `"use client"` component. Calls `bootstrap()` once on mount. Renders loading boundary while status is `idle` or `loading`. Renders children once `anonymous` or `authenticated`.
- [x] 2.2 Create `client/src/modules/auth/components/route-gates.tsx` — `ProtectedRoute`, `PublicOnlyRoute`, `RoleRoute` components using `useAuthStore()`, `Navigate`, and `Outlet`. Redirect to `/login` for protected, `/` for public-only.
- [x] 2.3 Modify `client/src/modules/auth/components/login-form.tsx` — Replaced `setTimeout` with store `login()` action. Wired `isLoading` from store status. On success: navigates to `/`. On error: shows form error via `FormMessage` root field. Removed `console.log`.
- [x] 2.4 Modify `client/src/core/router/index.tsx` — Wrapped `<Routes>` in `<AuthBootstrap>`. Replaced placeholder `isAuthenticated`/`role` booleans with `useIsAuthenticated()` and `useHasRole()` hooks. Used `<ProtectedRoute>` and `<RoleRoute>` gate components. Preserved conditional layout structure to avoid breaking existing route tests.
- [x] 2.5 Modify `client/src/core/providers/query-client.provider.tsx` — Extracted `queryClient` to dedicated `query-client.ts` to satisfy fast-refresh lint rules and enable imports from auth store. Wired `queryClient.clear()` into store `logout` and `clear` actions.

### Phase 3: Testing (PR 2 / Remaining Verification Coverage)
- [x] 3.1 Write `client/src/modules/auth/store/auth.store.test.ts` — Already created in PR 1; passes.
- [x] 3.2 Write `client/src/core/api/interceptors.test.ts` — Mock Axios adapter. Tests: single refresh on 401, concurrent 401s share one refresh, skipped endpoints don't trigger refresh, retry fires once with `_authRetry`, refresh failure clears store.
- [x] 3.3 Write `client/src/modules/auth/components/login-form.test.tsx` — Render with mock auth store. Tests: submit calls login and navigates on success, loading state disables button, error shows `FormMessage`.
- [x] 3.4 Write `client/src/modules/auth/components/route-gates.test.tsx` — Test ProtectedRoute and RoleRoute redirect behavior. Created and passing.
- [x] 3.5 Write `client/src/modules/auth/components/auth-bootstrap.test.tsx` — Tests: loading spinner for idle/loading, children render for authenticated/anonymous, bootstrap called once on mount.

## Files Changed

| File | Action | Notes |
|------|--------|-------|
| `client/src/core/api/types.ts` | Created | `ApiRequestConfig`, `ApiError`, `UnauthorizedError` |
| `client/src/core/api/index.ts` | Modified | Added interceptors, refresh queue, version header, CSRF stub |
| `client/src/core/api/interceptors.test.ts` | Created | 5 deterministic tests for 401 refresh/retry behavior |
| `client/src/core/providers/query-client.ts` | Created | Shared `QueryClient` instance (extracted from provider to avoid fast-refresh lint) |
| `client/src/core/providers/query-client.provider.tsx` | Modified | Imports `queryClient` from new `query-client.ts` file |
| `client/src/core/router/index.tsx` | Modified | AuthBootstrap wrapper, real hooks, ProtectedRoute/RoleRoute gates |
| `client/src/modules/auth/types/auth.types.ts` | Created | `AUTH_ROLE`, `AuthRole`, `AuthUser`, `LoginCredentials`, `SessionStatus` |
| `client/src/modules/auth/store/auth.store.ts` | Created | Zustand store with persist, async actions; clears queries on logout |
| `client/src/modules/auth/store/auth.store.test.ts` | Created | 8 tests for state transitions |
| `client/src/modules/auth/services/auth.service.ts` | Modified | Added `mapToAuthUser` to normalize backend `_id` → frontend `id` |
| `client/src/modules/auth/services/auth.service.test.ts` | Modified | Updated tests to assert `_id` → `id` mapping |
| `client/src/modules/auth/hooks/use-auth.ts` | Created | Selector hooks (`useIsAuthenticated`, `useHasRole`, etc.) |
| `client/src/modules/auth/hooks/use-auth.test.ts` | Created | 6 tests for hook selectors |
| `client/src/modules/auth/components/auth-bootstrap.tsx` | Created | Bootstrap on mount with loading spinner boundary |
| `client/src/modules/auth/components/auth-bootstrap.test.tsx` | Created | 5 tests for loading/bootstrap behavior |
| `client/src/modules/auth/components/route-gates.tsx` | Created | `ProtectedRoute`, `PublicOnlyRoute`, `RoleRoute` |
| `client/src/modules/auth/components/route-gates.test.tsx` | Created | 7 tests for ProtectedRoute, PublicOnlyRoute, and RoleRoute behavior |
| `client/src/modules/auth/components/login-form.tsx` | Modified | Wired store login, navigation, root error via FormMessage |
| `client/src/modules/auth/components/login-form.test.tsx` | Created | 3 tests for submit/loading/error behavior |
| `client/src/modules/auth/schemas/login-form.schema.ts` | Modified | Added optional `root` field for server-error binding |

## Verification Results
- **TypeScript**: 0 new errors in auth/API/router/provider files (pre-existing errors in progress module unchanged)
- **ESLint**: 0 new warnings/errors in auth/API/router/provider files (pre-existing errors in tabs/mobile/sidebar/progress unchanged)
- **Tests**: 39/39 passed in focused auth/API test suites (7 test files)

## Critical Fixes Applied (Post-Verification)

### Fix 1: Backend `_id` → Frontend `id` mapping
**Problem**: `AuthUser.id` was undefined at runtime because backend `UserResponseDTO` exposes `_id` while frontend `AuthUser` expects `id`. Login and profile stored raw response data without mapping.
**Solution**: Added `mapToAuthUser()` in `auth.service.ts` that transforms backend `_id` into frontend `id`, preserving all other fields. `login()` and `profile()` now return normalized `AuthUser` objects.
**Test coverage**: Updated `auth.service.test.ts` to mock backend `_id` and assert mapped `id` on both `login` and `profile`.

### Fix 2: Admin route fallback reliability
**Problem**: `Router` conditionally omitted admin routes when `isAdmin` was false. A non-admin visiting `/admin` fell through to "no matched route" instead of entering `RoleRoute` and being redirected to the authorized fallback.
**Solution**: Removed the `{isAdmin && ...}` guard from `Router`. Admin routes are now always mounted inside `RoleRoute`, which handles the redirect for non-admin users. Removed now-unused `useHasRole` import from `Router`.
**Test coverage**: Created `route-gates.test.tsx` with 7 tests covering `ProtectedRoute` redirect/render, `PublicOnlyRoute` redirect/render, and `RoleRoute` allow admin / redirect non-admin / redirect anonymous behaviors.

## Deviations from Design
- **auth-bootstrap.tsx renders children, not `null`**: The task description said "Returns null once anonymous or authenticated", but returning `null` would prevent child routes from rendering. The component renders `children` once bootstrap resolves, which is the only viable behavior for a wrapper component.
- **Router preserves conditional layout branch**: Instead of pure declarative gates at the top level, the router keeps the conditional `isAuthenticated ? AuthLayout+UserRoutes : PublicRoutes` structure. This preserves the existing behavior where anonymous `/` renders without `AuthLayout` (marketing home) and authenticated `/` renders with it (dashboard home). It also avoids breaking `home-route.test.tsx` and other route tests that rely on `UserRoutes()` structure.
- **`queryClient` extracted to separate file**: Exported from `query-client.provider.tsx` directly triggered `react-refresh/only-export-components` ESLint error. Extracting to `query-client.ts` satisfies the rule and keeps the provider file component-only.
- **Login form uses store action, not `authService.login()` directly**: The form calls `useAuthStore.getState().login(data)`, which internally calls `authService.login()`. This reuses the existing store action that handles loading state transitions and error setting correctly.
- **Login schema extended with optional `root` field**: Required to render server-side login errors via the shared `FormMessage` primitive. The field is invisible and only carries error state.

## Remaining Tasks
- [x] 3.1 Write `client/src/modules/auth/store/auth.store.test.ts` — Already created in PR 1; passes.
- [x] 3.2 Write `client/src/core/api/interceptors.test.ts` — Completed: 5 focused tests for 401 refresh behavior.
- [x] 3.3 Write `client/src/modules/auth/components/login-form.test.tsx` — Completed: 3 tests for submit/loading/error.
- [x] 3.4 Write `client/src/modules/auth/components/route-gates.test.tsx` — Test ProtectedRoute and RoleRoute redirect behavior. Created and passing.
- [x] 3.5 Write `client/src/modules/auth/components/auth-bootstrap.test.tsx` — Completed: 5 tests for loading/bootstrap behavior.

## Boundary
This slice covers all planned tasks for the frontend-auth-integration change. CSRF backend/token work remains intentionally stubbed pending a backend decision; no additional frontend tasks are open.

## Status
15/15 tasks complete. All non-CSRF verification coverage is implemented and passing. Ready for verify/archival or CSRF backend follow-up.
