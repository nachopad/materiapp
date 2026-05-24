# Proposal: Frontend Auth Integration

## Intent

Replace placeholder frontend auth with a cookie-session flow backed by `/api/auth/login`, `/api/auth/refresh`, profile hydration, and role-aware routing that survives reloads/browser restarts without storing JWTs in JavaScript.

## Scope

### In Scope
- Add client auth service/store for login, logout, profile bootstrap, roles, and hydrated/loading states.
- Configure axios for cookies, `Accept-Version`, one-shot 401 refresh/retry, and logout on refresh failure.
- Wire login form and router guards to real auth/role state.
- Define CSRF/versioning expectations for protected mutating requests.

### Out of Scope
- Backend token/cookie contract redesign.
- New registration, password reset, or Google OAuth UX.
- Fine-grained permissions beyond backend roles.

## Capabilities

### New Capabilities
- `frontend-auth-session`: Cookie-backed frontend session lifecycle, refresh retry, persistence across reloads, and role-based route access.

### Modified Capabilities
- None.

## Approach

Use backend as source of truth: login sets `httpOnly` cookies, then frontend fetches `/api/auth/profile` to hydrate user/roles. Zustand stores only serializable session metadata, not tokens. Axios keeps `withCredentials: true`, sends `Accept-Version: 1`, refreshes once through `/api/auth/refresh` on eligible 401 responses, queues/guards concurrent refreshes, retries the original request, and clears auth on refresh failure. Router renders public/protected/admin branches from hydrated auth state; unknown session state shows a loading boundary instead of redirect flicker.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `client/src/core/api/index.ts` | Modified | Axios defaults, version header, refresh interceptor. |
| `client/src/modules/auth/` | New/Modified | Auth service/store/hooks and real login submit. |
| `client/src/core/router/index.tsx` | Modified | Session bootstrap and role gates. |
| `client/src/core/providers/query-client.provider.tsx` | Modified | Coordinate session/profile query behavior if used. |
| `server/src/main.ts` | Verify | CORS credentials compatibility for cookie auth. |
| `server/src/core/middleware/csrf.middleware.ts` | Verify | CSRF header strategy for protected mutations. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSRF header gap | Med | Spec and test header retrieval/injection before protected mutations. |
| Refresh loop/concurrency bugs | Med | Retry once, skip auth endpoints, share one refresh promise. |
| Cross-origin cookies blocked | Med | Verify CORS credentials/origin and SameSite/Secure settings. |
| Role mapping drift | Low | Use backend role array; admin route requires `admin`. |

## Rollback Plan

Revert client auth store/service/interceptor/router changes and restore placeholder router/login behavior; no data migration or cookie schema rollback required.

## Dependencies

- Existing backend `/api/auth/login`, `/api/auth/refresh`, `/api/auth/profile`, `/api/auth/logout` cookie contract.
- Confirmed CORS/CSRF/versioning behavior in current deployment topology.

## Success Criteria

- [ ] Login creates cookie session and redirects to authorized protected routes.
- [ ] Reload/close rehydrates session from profile without JS token storage.
- [ ] Expired access token refreshes once and retries original request.
- [ ] Refresh failure logs out and returns to public routes.
- [ ] Admin routes require `admin`; user routes accept authenticated non-admin users.
