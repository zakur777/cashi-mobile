# Demo Seed Data Specification

## ADDED Requirements

### Requirement: Empty-only demo seed

The system MUST seed deterministic demo categories and transactions only when both persisted datasets are empty.

#### Scenario: Fresh install receives demo data

- GIVEN category storage is empty
- AND transaction storage is empty
- WHEN the app loads data for the first time
- THEN demo categories are persisted
- AND demo transactions are persisted
- AND transaction category ids reference existing demo categories

#### Scenario: Existing data is preserved

- GIVEN category storage has at least one category OR transaction storage has at least one transaction
- WHEN seed initialization runs
- THEN no demo data is written
- AND existing persisted data remains unchanged

### Requirement: Seed idempotency

The system MUST keep demo seeding idempotent across app restarts and repeated refreshes.

#### Scenario: Repeated initialization does not duplicate records

- GIVEN demo data has already been seeded
- WHEN seed initialization runs again
- THEN the stored category and transaction counts do not increase
- AND existing seeded ids remain stable

### Requirement: Architecture boundary preservation

The system MUST keep seed orchestration outside UI components.

#### Scenario: Components stay render-only

- GIVEN demo seed support is implemented
- WHEN UI components and screens are inspected
- THEN components do not import AsyncStorage
- AND components do not contain seed fixtures or seed business logic
