# Delta for mobile-ux-delivery

## MODIFIED Requirements

### Requirement: Mobile UX baseline

The system MUST use SafeAreaView and KeyboardAvoidingView where applicable, SHALL provide empty states, MUST use StyleSheet.create(), and MUST show device-permission errors inline without Alert-based flows.
(Previously: UX baseline covered safe areas, keyboard handling, empty states, and StyleSheet usage only.)

#### Scenario: Usable forms and lists

- GIVEN form and list screens
- WHEN the user interacts with the keyboard and long content
- THEN inputs are not hidden by the keyboard
- AND lists and forms are navigable with visible empty states

#### Scenario: Permission denied feedback

- GIVEN camera, gallery, or location permission is denied
- WHEN the user attempts the related action
- THEN an inline visible error is shown on the form
- AND the user can continue editing the transaction

### Requirement: Delivery evidence and TDD traceability

The implementation process MUST provide RED→GREEN→REFACTOR evidence per capability and include tests in the same functionality commit; README MUST document Requirement 3 local usage, backend preservation, and test/typecheck commands.
(Previously: delivery evidence required test-first traceability and README installation/execution/test documentation.)

#### Scenario: Capability review

- GIVEN commit history by capability
- WHEN evidence is audited
- THEN a test-first sequence is verifiable
- AND README documents installation, execution, and tests

#### Scenario: Requirement 3 delivery review

- GIVEN Requirement 3 is evaluated
- WHEN README and tests are inspected
- THEN local metadata behavior and backend omission behavior are documented
- AND `npm test` and `npm run typecheck` evidence is available

## Acceptance Criteria

- Permission errors are inline and testable.
- README documents local-first behavior and backend non-removal.
