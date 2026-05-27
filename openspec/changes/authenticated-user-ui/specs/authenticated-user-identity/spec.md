# authenticated-user-identity Specification

## Purpose

Define required authenticated identity rendering behavior for shell footer, profile header, and dashboard welcome in authenticated client routes.

## Requirements

### Requirement: Render Auth Identity in Sidebar Footer

The system MUST render sidebar footer identity from the authenticated session source of truth and MUST NOT use hardcoded mock identity values.

#### Scenario: Authenticated name and email are present

- GIVEN an authenticated user with `name` and `email`
- WHEN the authenticated sidebar footer is rendered
- THEN the footer shows that user's name and email

#### Scenario: Email is missing in auth payload

- GIVEN an authenticated user with `name` and no `email`
- WHEN the authenticated sidebar footer is rendered
- THEN the footer shows the name and a safe fallback email label

### Requirement: Prioritize Auth Identity in Profile Header

The system MUST prioritize authenticated session identity for the profile identity header while preserving existing non-identity profile sections.

#### Scenario: Auth identity overrides stale profile identity

- GIVEN profile page data and authenticated session identity differ
- WHEN the profile page identity header is rendered
- THEN the header displays authenticated session name/email
- AND profile providers, university, and progress sections remain unchanged

#### Scenario: Auth name is missing

- GIVEN an authenticated user without a usable display name
- WHEN the profile identity header is rendered
- THEN the header shows a defined safe name fallback

### Requirement: Personalize Dashboard Welcome from Auth First Name

The system SHALL personalize dashboard home welcome text with authenticated first name when available and SHALL use fallback copy when unavailable.

#### Scenario: First name available

- GIVEN an authenticated user with a parseable first name
- WHEN dashboard home welcome is rendered
- THEN welcome text includes that first name

#### Scenario: First name unavailable

- GIVEN an authenticated user without a parseable first name
- WHEN dashboard home welcome is rendered
- THEN welcome text uses the defined generic fallback greeting

### Requirement: Maintain Responsive and Avatar-Fallback Safety

The system MUST keep identity UI usable at 390px width with no horizontal overflow and MUST retain avatar-fallback behavior when no avatar exists.

#### Scenario: Narrow viewport rendering

- GIVEN a 390px viewport and long authenticated identity strings
- WHEN sidebar footer and profile header are rendered
- THEN identity text remains visible via truncation or wrapping-safe behavior
- AND no horizontal scroll is introduced

#### Scenario: No avatar field in auth user

- GIVEN authenticated identity without avatar image data
- WHEN identity UI components are rendered
- THEN avatar fallback initials or placeholder remain visible
