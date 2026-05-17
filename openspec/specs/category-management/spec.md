# category-management Specification

## Purpose

Define local category management behavior for Cashi Mobile.

## Requirements

### Requirement: Category CRUD with validation

The system MUST provide create, read, update, and delete operations for categories with Zod validation and inline errors.

#### Scenario: Create valid category

- GIVEN the category form
- WHEN the user enters a valid name and confirms
- THEN a persisted category is created
- AND it appears in the list without reloading the app

#### Scenario: Invalid category input

- GIVEN the category form
- WHEN the user submits an empty name
- THEN saving is blocked
- AND an inline field error is shown

### Requirement: Category persistence isolation

The system MUST persist categories in AsyncStorage through a data boundary, not UI components.

#### Scenario: Storage boundary respected

- GIVEN category operations
- WHEN the persistence flow is inspected
- THEN only hooks or adapters access AsyncStorage
- AND components only consume state and actions
