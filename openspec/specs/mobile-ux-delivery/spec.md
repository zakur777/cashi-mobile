# mobile-ux-delivery Specification

## Purpose
Define the mobile UX baseline and delivery traceability expectations for Cashi Mobile.

## Requirements

### Requirement: Mobile UX baseline
The system MUST use SafeAreaView and KeyboardAvoidingView where applicable, SHALL provide empty states, and MUST use StyleSheet.create().

#### Scenario: Usable forms and lists
- GIVEN form and list screens
- WHEN the user interacts with the keyboard and long content
- THEN inputs are not hidden by the keyboard
- AND lists and forms are navigable with visible empty states

### Requirement: Delivery evidence and TDD traceability
The implementation process MUST provide RED→GREEN→REFACTOR evidence per capability and include tests in the same functionality commit.

#### Scenario: Capability review
- GIVEN commit history by capability
- WHEN evidence is audited
- THEN a test-first sequence is verifiable
- AND README documents installation, execution, and tests
