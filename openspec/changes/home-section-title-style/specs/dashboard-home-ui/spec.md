# dashboard-home-ui Specification

## Purpose

Define dashboard home section-header behavior so title typography, casing, and icon wrappers are consistent with existing product UI references while preserving accessibility semantics and responsive behavior.

## Requirements

### Requirement: Dashboard Home Title Typography Consistency

The system MUST render the three authenticated dashboard home section titles with the same typography style used by Profile section titles (`text-2xl font-bold tracking-normal`).

#### Scenario: Typography matches Profile reference

- GIVEN an authenticated user views the dashboard home page
- WHEN section headers for Academic Summary, Current Subjects, and Next Exams are rendered
- THEN each section title uses the Profile-equivalent typography style
- AND no section keeps previous, divergent title typography

#### Scenario: Responsive layout remains intact

- GIVEN the dashboard home page is viewed at narrow mobile width (390px)
- WHEN section headers render with the updated title typography
- THEN headers remain readable without horizontal overflow
- AND existing responsive section behavior is preserved

### Requirement: Dashboard Home Academic Summary Casing

The system MUST display the academic summary section title as `Resumen académico` in dashboard home UI and related automated assertions.

#### Scenario: UI uses updated title casing

- GIVEN an authenticated user is on dashboard home
- WHEN the academic summary section header is shown
- THEN the title text is `Resumen académico`
- AND the legacy text `Resumen Académico` is not displayed for that section

#### Scenario: Tests assert updated casing

- GIVEN existing dashboard home tests that assert exact title text
- WHEN the test suite is updated for this change
- THEN assertions referencing academic summary use `Resumen académico`
- AND tests no longer depend on the prior capitalized variant

### Requirement: Dashboard Home Header Icon Wrapper Parity

The system MUST render icon wrappers beside dashboard home section titles with a visual style equivalent to `EmptySearch`/`EmptyMedia` `variant="icon"` (shape, spacing, and proportion), while icon glyph color MUST use primary color semantics.

#### Scenario: Header icon wrapper matches reference visual language

- GIVEN dashboard home section headers include a leading icon
- WHEN the icon wrapper is rendered
- THEN wrapper shape and sizing visually match the `variant="icon"` reference style
- AND wrapper treatment is consistent across all three dashboard home sections

#### Scenario: Heading semantics are preserved

- GIVEN section titles currently rely on heading semantics for structure
- WHEN styling and wrapper updates are applied
- THEN existing heading level semantics are preserved
- AND no semantic change is introduced unless explicitly specified by a future change
