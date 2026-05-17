# transaction-management Specification

## Requirements

### Requirement: Transaction CRUD with category relation

The system MUST provide CRUD for transactions, including category selection and category-name rendering.

#### Scenario: List with category name

- GIVEN transactions and categories exist
- WHEN the user opens the transaction list
- THEN each item shows amount, type, and category name

#### Scenario: Edit and delete transaction

- GIVEN an existing transaction
- WHEN the user edits or deletes it
- THEN the change is persisted locally
- AND the list reflects the updated state

### Requirement: Transaction validation rules

The system MUST validate with Zod that amount is positive and categoryId is valid.

#### Scenario: Invalid amount

- GIVEN the transaction form
- WHEN the user enters `amount <= 0`
- THEN submission is rejected
- AND an inline error is shown
