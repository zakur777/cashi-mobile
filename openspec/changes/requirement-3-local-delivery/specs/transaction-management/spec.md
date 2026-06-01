# Delta for transaction-management

## ADDED Requirements

### Requirement: Backend contract-safe metadata omission

The system MUST keep backend data-source integration available and MUST NOT send unsupported local-only `photoUri` or `location` fields to backend DTOs.

#### Scenario: Backend create omits metadata

- GIVEN backend mode is active and a transaction input includes metadata
- WHEN the transaction is created or updated
- THEN backend payloads exclude `photoUri` and `location`
- AND the backend repository remains usable

#### Scenario: Local mode remains default

- GIVEN no explicit backend data-source override is configured
- WHEN transactions are created with metadata
- THEN the local data source handles persistence

## MODIFIED Requirements

### Requirement: Transaction CRUD with category relation

The system MUST provide CRUD for transactions, including category selection, category-name rendering, and optional local `photoUri` and `location` metadata display/editing.
(Previously: CRUD covered amount/type/category relation only, without receipt or coordinates metadata.)

#### Scenario: List with category name

- GIVEN transactions and categories exist
- WHEN the user opens the transaction list
- THEN each item shows amount, type, and category name

#### Scenario: Edit and delete transaction

- GIVEN an existing transaction with or without metadata
- WHEN the user edits or deletes it
- THEN the change is persisted locally
- AND the list reflects the updated state

#### Scenario: Persist optional metadata locally

- GIVEN a transaction has `photoUri` or `location`
- WHEN it is saved, loaded, and edited locally
- THEN metadata is preserved unless the user clears it

#### Scenario: Legacy transactions remain compatible

- GIVEN stored transactions without metadata
- WHEN local transactions are loaded
- THEN they remain valid and render without metadata errors

### Requirement: Transaction validation rules

The system MUST validate with Zod that amount is positive and categoryId is valid; optional metadata MUST NOT make legacy or metadata-free submissions invalid.
(Previously: validation only covered required amount and categoryId fields.)

#### Scenario: Invalid amount

- GIVEN the transaction form
- WHEN the user enters `amount <= 0`
- THEN submission is rejected
- AND an inline error is shown

#### Scenario: Metadata-free valid transaction

- GIVEN required transaction fields are valid and metadata is absent
- WHEN the user submits the form
- THEN submission succeeds

## Acceptance Criteria

- Local CRUD saves, loads, edits, and clears optional metadata.
- Backend mode remains available and contract-safe.
