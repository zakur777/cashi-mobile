# Delta for balance-summary

## MODIFIED Requirements

### Requirement: Hook-owned balance computation

The system MUST retrieve `totalIncome`, `totalExpense`, and `balance` from `GET /transactions/balance` through hook logic, not compute or fetch them in components.
(Previously: hook logic computed totals from persisted transactions.)

#### Scenario: Correct totals

- GIVEN an authenticated user with server transactions
- WHEN the balance summary is queried
- THEN `GET /transactions/balance` returns `totalIncome`, `totalExpense`, and `balance`
- AND the UI renders the server-owned values without recalculating them in components

### Requirement: Focus refresh

The system SHALL refresh balance data from the server when the balance screen regains focus.
(Previously: totals were recalculated from the most recent persisted local data.)

#### Scenario: Return to balance tab

- GIVEN transaction changes made outside the balance screen
- WHEN the user returns to the balance tab
- THEN the latest balance endpoint response is requested with bearer auth

#### Scenario: Balance request failure

- GIVEN the balance endpoint fails
- WHEN the balance hook handles the response
- THEN the screen state exposes the server message or `Error de conexión`
