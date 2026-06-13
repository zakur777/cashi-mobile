# Delta for app-scaffold

## MODIFIED Requirements

### Requirement: Hook-first boundaries

The system MUST enforce render-only components and SHALL keep business logic, network access, token access, and persistence access in hooks, contexts, repositories, storage adapters, and API services.
(Previously: components avoided business rules while logic lived in hooks and services.)

#### Scenario: Layer separation

- GIVEN UI screens and components
- WHEN imports and responsibilities are reviewed
- THEN components do not contain business rules
- AND logic resides in `useTransactions`, `useCategories`, `useTransactionForm`, and `useCategoryForm`

#### Scenario: Production backend boundary

- GIVEN screens and components are reviewed
- WHEN backend integration is enabled
- THEN they do not import `fetch`, SecureStore, or the API service directly
- AND token values are not passed between screens as props or route params

## ADDED Requirements

### Requirement: Manual production verification documentation

The system MUST document a manual verification path for the production Render backend using demo-user credentials supplied outside source code.

#### Scenario: Demo user verification

- GIVEN a reviewer follows README verification steps
- WHEN they provide valid demo credentials outside committed app logic
- THEN login, protected data loading, logout, and error behavior can be verified against production
