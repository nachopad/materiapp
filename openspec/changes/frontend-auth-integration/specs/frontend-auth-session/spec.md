# Frontend Auth Session Specification

## Requirements

### Requirement: Cookie login and profile hydration

The system MUST authenticate through backend cookie endpoints and MUST NOT persist JWTs in JavaScript storage.

#### Scenario: Successful login hydrates session
- GIVEN a user submits valid login credentials
- WHEN the client calls `POST /api/auth/login` and then `GET /api/auth/profile`
- THEN the client stores only serializable session metadata (auth flag, user identity, roles, hydration status)
- AND navigation proceeds to the protected destination.

#### Scenario: Invalid credentials stay unauthenticated
- GIVEN a user submits invalid credentials
- WHEN `POST /api/auth/login` fails
- THEN the client remains unauthenticated and exposes a login error state
- AND no protected route is rendered.

### Requirement: Session bootstrap across reload/restart

The system MUST re-evaluate session state on app bootstrap by querying profile with credentials and MUST expose loading until hydration resolves.

#### Scenario: Existing cookie session rehydrates after reload
- GIVEN the browser has a valid auth cookie and the app reloads
- WHEN bootstrap calls `GET /api/auth/profile`
- THEN the client marks the user authenticated using roles from the response
- AND protected routes render without manual re-login.

#### Scenario: Missing or expired session resolves to public state
- GIVEN no valid cookie session exists
- WHEN bootstrap profile fetch fails with unauthorized state
- THEN the client resolves to unauthenticated
- AND public routing is rendered after loading completes.

### Requirement: One-shot refresh retry

The system MUST send credentialed requests with required headers, and on eligible 401 responses MUST attempt one refresh before retrying the original request.

#### Scenario: Expired access token recovers through refresh
- GIVEN an authenticated session and a protected request returns 401 for access expiry
- WHEN the client executes `POST /api/auth/refresh` once and retries the original request
- THEN the retried request succeeds without user interruption
- AND the interceptor prevents retry loops.

#### Scenario: Concurrent 401 responses share a refresh cycle
- GIVEN multiple protected requests fail concurrently with refresh-eligible 401
- WHEN refresh is already in progress
- THEN additional failed requests wait for that refresh outcome
- AND no duplicate refresh storm is triggered.

### Requirement: Refresh failure logs out

The system MUST clear auth state and transition to public access when refresh fails.

#### Scenario: Refresh endpoint fails
- GIVEN an authenticated client receives a refresh-eligible 401
- WHEN `POST /api/auth/refresh` fails or returns unauthorized
- THEN the client clears session metadata and roles
- AND protected routing redirects to public auth entry.

### Requirement: Role-aware route protection

The system MUST enforce role-gated routing from backend roles: authenticated users access user routes, and only `admin` accesses admin routes.

#### Scenario: Authenticated non-admin user accesses protected user route
- GIVEN an authenticated user without `admin` role
- WHEN the user navigates to a protected non-admin route
- THEN access is granted.

#### Scenario: Non-admin user attempts admin route
- GIVEN an authenticated user without `admin` role
- WHEN the user navigates to an admin-only route
- THEN access is denied and routed to an authorized fallback.

### Requirement: Credentials, versioning, and CSRF headers

The system MUST send `withCredentials: true` and `Accept-Version: 1` on auth/session API calls, and MUST include configured CSRF headers for protected mutating requests when policy requires them.

#### Scenario: Protected mutation includes expected headers
- GIVEN a protected mutating request is dispatched
- WHEN request interceptors prepare outbound headers
- THEN credentials and version headers are present
- AND CSRF header is attached per backend contract.

### Requirement: Loading boundaries avoid auth flicker

The system MUST expose pending states for login submission, bootstrap hydration, and refresh-in-progress so guards do not redirect before auth state is known.

#### Scenario: Bootstrap loading suppresses premature redirects
- GIVEN app startup with unresolved profile hydration
- WHEN route guards evaluate current auth status
- THEN a loading boundary is rendered
- AND redirects occur only after hydration settles.
