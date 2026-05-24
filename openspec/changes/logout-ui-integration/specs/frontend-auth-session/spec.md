# Frontend Auth Session Specification

## Purpose

Define logout UI integration for profile and sidebar so both entry points execute one canonical session-clear path, expose mutation UX states, and return users to public login routing.

## Requirements

### Requirement: Unified logout entry points

The system MUST provide logout actions from both profile page and sidebar menu, and both actions MUST invoke the same canonical client logout flow.

#### Scenario: Profile button triggers canonical logout
- GIVEN an authenticated user on profile page
- WHEN the user activates the profile logout button
- THEN the client invokes the shared logout action path
- AND no alternate/duplicated logout implementation is used.

#### Scenario: Sidebar menu triggers canonical logout
- GIVEN an authenticated user with sidebar menu available
- WHEN the user activates sidebar logout menu item
- THEN the client invokes the same shared logout action path as profile logout
- AND behavior parity is preserved between both entry points.

### Requirement: TanStack Query mutation lifecycle for logout

The system MUST execute UI-initiated logout through a TanStack Query mutation and SHALL expose pending and error lifecycle state to the invoking UI controls.

#### Scenario: Pending state disables controls
- GIVEN a logout mutation is in progress
- WHEN profile button or sidebar item is rendered
- THEN the initiating control is disabled for re-submit
- AND UI exposes a pending/processing affordance.

#### Scenario: Mutation failure exposes recoverable state
- GIVEN logout mutation fails due to transport or server error
- WHEN mutation settles with error
- THEN UI surfaces a non-blocking error feedback state
- AND user remains in current authenticated context until explicit successful logout.

### Requirement: Canonical session, auth, and cache clearing

The system MUST clear authentication/session state and TanStack Query cache through one existing canonical client path after successful logout API completion.

#### Scenario: Successful logout clears via single path
- GIVEN a successful logout API response
- WHEN the canonical logout completion path runs
- THEN auth/session state is reset to anonymous
- AND query cache/session-derived client data is cleared exactly through that shared path.

#### Scenario: Double-clear is prevented
- GIVEN profile and sidebar share the same logout mechanism
- WHEN logout success handling executes
- THEN cleanup is applied once per logout action
- AND no duplicated clear/reset side effects are triggered.

### Requirement: Post-logout public routing

The system MUST route the user to public login state after successful logout completion.

#### Scenario: Logout transitions to login route
- GIVEN an authenticated user initiates logout and cleanup succeeds
- WHEN post-logout routing evaluates auth state
- THEN protected content is no longer accessible
- AND user lands on public `/login` entry.

### Requirement: Accessible logout controls and feedback

The system MUST provide accessible names/labels for logout triggers and SHOULD keep these labels programmatically determinable during pending and error states.

#### Scenario: Assistive technology can identify logout actions
- GIVEN profile and sidebar logout controls are present
- WHEN assistive technology queries accessible names
- THEN each control exposes a deterministic logout label
- AND pending/error state announcements do not remove action discoverability.

### Requirement: Logout integration test coverage

The system MUST include automated tests that verify profile and sidebar logout wiring, pending disabled behavior, canonical cleanup invocation, and post-logout public routing.

#### Scenario: Profile and sidebar wiring are both validated
- GIVEN automated client tests for logout UI integration
- WHEN tests simulate logout from profile and sidebar
- THEN both paths assert shared mutation/logout action usage
- AND assertions validate transition to public login state after success.

#### Scenario: Pending and error policies are validated
- GIVEN automated tests for logout mutation lifecycle
- WHEN tests simulate pending and failing mutation states
- THEN controls are asserted disabled during pending
- AND error policy assertions verify recoverable feedback without anonymous transition.
