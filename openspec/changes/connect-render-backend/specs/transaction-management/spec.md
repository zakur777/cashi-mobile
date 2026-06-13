# Delta for transaction-management

## MODIFIED Requirements

### Requirement: Transaction CRUD with category relation

The system MUST provide authenticated server CRUD for transactions, including server category selection, numeric ids, optional coordinates, optional receipt `imageUrl`, and category-name rendering.
(Previously: CRUD changes were persisted locally.)

#### Scenario: List with category name

- GIVEN an authenticated user and server transactions exist
- WHEN the user opens the transaction list
- THEN `GET /transactions` provides items with numeric ids
- AND each item shows amount, type, and category name

#### Scenario: Edit and delete transaction

- GIVEN an existing server transaction
- WHEN the user edits or deletes it
- THEN `PATCH /transactions/:id` or `DELETE /transactions/:id` is called with auth
- AND the list reflects the updated server state

#### Scenario: Create transaction with optional metadata

- GIVEN a valid transaction form with optional coordinates and no photo
- WHEN the user saves it
- THEN `POST /transactions` sends amount, type, categoryId, and coordinates when present
- AND omits image fields when no photo was selected

### Requirement: Transaction validation rules

The system MUST validate with Zod that amount is positive and categoryId is a valid server category id.
(Previously: validation required amount positive and categoryId valid for local data.)

#### Scenario: Invalid amount

- GIVEN the transaction form
- WHEN the user enters `amount <= 0`
- THEN submission is rejected
- AND an inline error is shown

## ADDED Requirements

### Requirement: Receipt upload before save

The system MUST upload a selected receipt image to `POST /transactions/upload` before create or update and MUST send the returned `imageUrl` in the transaction body.

#### Scenario: Upload selected receipt

- GIVEN the user selected a receipt image in an existing UI flow
- WHEN the transaction is saved
- THEN the image is uploaded with bearer auth
- AND the returned `imageUrl` is sent to create or update the transaction

#### Scenario: Missing screen or upload UI

- GIVEN a create or edit screen lacks receipt UI for a path
- WHEN typed service coverage and manual docs are reviewed
- THEN upload behavior is still specified through typed services or documented manual verification
