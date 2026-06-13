# Delta for category-management

## MODIFIED Requirements

### Requirement: Category CRUD with validation

The system MUST list categories from `GET /categories` for the authenticated user flow and MUST validate selected category ids before transaction submission.
(Previously: categories were locally created, read, updated, and deleted with Zod validation.)

#### Scenario: Create valid category

- GIVEN server categories are loaded
- WHEN the user selects a valid category while creating a transaction
- THEN the selected server `categoryId` is accepted
- AND the category name can be rendered in transaction UI

#### Scenario: Invalid category input

- GIVEN categories are not loaded or the selected id is absent
- WHEN the user submits the transaction form
- THEN saving is blocked
- AND an inline field error is shown

### Requirement: Category persistence isolation

The system MUST retrieve categories through an authenticated data boundary, not UI components or AsyncStorage.
(Previously: categories were persisted in AsyncStorage through a data boundary.)

#### Scenario: Storage boundary respected

- GIVEN category operations
- WHEN the persistence flow is inspected
- THEN only hooks or adapters access the category API boundary
- AND components only consume state and actions

#### Scenario: Authenticated category list

- GIVEN an authenticated session
- WHEN categories are loaded
- THEN `GET /categories` is called with a bearer token
- AND server or network errors are surfaced to the screen state
