## Exploration: frontend-auth-integration

### Current State
Backend auth is cookie-based and already exposes login/refresh/profile/logout endpoints under `/api/auth/*` in `server/src/module/auth/controllers/auth.controller.ts`. Login (`POST /api/auth/login`) and refresh (`POST /api/auth/refresh`) set `materiapp_access_token` and `materiapp_refresh_token` as `httpOnly` cookies via `setCookie` (`server/src/shared/utils/set-cookie.util.ts`) and cookie names are defined in `server/src/module/common/constants/cookie.constant.ts`.

Frontend has axios base setup with `withCredentials: true` (`client/src/core/api/index.ts`) but no auth service/store/interceptor yet. Router auth state is a placeholder (`client/src/core/router/index.tsx`): `isAuthenticated = false` and `role = 'admin'`.

### Affected Areas
- `server/src/module/auth/controllers/auth.controller.ts` — canonical auth endpoints and cookie lifecycle.
- `server/src/module/auth/services/auth.service.ts` — token generation/refresh payload (`roles` included).
- `server/src/core/middleware/csrf.middleware.ts` — CSRF enabled globally, skipping only `POST /api/auth/login` and `POST /api/auth/register`.
- `server/src/main.ts` — global `/api` prefix, cookie parser, header versioning (`Accept-Version`), no explicit CORS config found.
- `server/src/module/user/schemas/user.schema.ts` — persisted role model (`roles: string[]`, default `['user']`).
- `server/src/module/common/enums/role.enum.ts` — role constants (`admin | user | student`).
- `client/src/core/router/index.tsx` — auth gate and role branching are currently stubbed.
- `client/src/core/router/public.route.tsx` / `user.route.tsx` / `admin.route.tsx` — route split exists and can be driven by real auth state.
- `client/src/modules/auth/components/login-form.tsx` — login submit is simulated (`setTimeout`) and not integrated.
- `client/src/core/providers/query-client.provider.tsx` — TanStack Query provider exists for session/user bootstrap queries.

### Approaches
1. **Client-auth store + axios interceptor (cookie session aware)** — add auth source of truth in client, call `/api/auth/profile` for bootstrap, interceptor retries once via `/api/auth/refresh` on 401, then retries original request.
   - Pros: Works with `httpOnly` cookies (no JS token storage), durable across reload/close, centralizes role-based routing.
   - Cons: Must coordinate CSRF token flow for mutating endpoints and avoid refresh loops.
   - Effort: Medium

2. **Decode token client-side for auth state** — infer session from JWT payload in browser.
   - Pros: Fast route decisions without profile fetch.
   - Cons: Not viable with current `httpOnly` cookie strategy (token not readable from JS); risks divergence from backend truth.
   - Effort: Low (but architecturally incorrect here)

### Recommendation
Choose **Approach 1**. Keep backend as the source of truth and model frontend auth as a cookie-session client: login → profile hydrate → guarded routes by roles; on 401 use refresh once and retry. This aligns with existing backend contract and avoids insecure token handling.

### Risks
- **CSRF mismatch risk**: backend CSRF middleware protects non-ignored mutating routes; client currently has no CSRF header retrieval/injection flow.
- **CORS/credentials risk**: no explicit `app.enableCors({ credentials: true, origin })` found in `server/src/main.ts`; cross-origin cookie auth may fail depending on deployment topology.
- **Versioning risk**: server uses header-based versioning (`Accept-Version`); client currently does not set it.
- **Role drift risk**: router checks a single `admin` literal now; role array from backend (`roles`) requires deterministic mapping policy.

### Ready for Proposal
Yes — enough backend/frontend shape is known to define a concrete proposal and delta specs.
