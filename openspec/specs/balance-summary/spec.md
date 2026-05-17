# balance-summary Specification

## Purpose
Define balance calculation and refresh behavior for Cashi Mobile.

## Requirements

### Requirement: Hook-owned balance computation
The system MUST compute `totalIncome`, `totalExpense`, and `balance` in hook logic, not in components.

#### Scenario: Correct totals
- GIVEN persisted transactions with type `income` and `expense`
- WHEN the balance summary is queried
- THEN `totalIncome` sums income transactions
- AND `totalExpense` sums expense transactions
- AND `balance = income - expense`

### Requirement: Focus refresh
The system SHALL refresh balance data when the balance screen regains focus.

#### Scenario: Return to balance tab
- GIVEN transaction changes made outside the balance screen
- WHEN the user returns to the balance tab
- THEN totals are recalculated from the most recent persisted data
