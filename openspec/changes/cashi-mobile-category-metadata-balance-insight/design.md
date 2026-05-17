# Design: Category Metadata and Balance Insight

## Approach

Implement the data/model layer before the visual polish. Add typed category metadata in domain types and schemas, then update hooks/components to pass that metadata through existing CRUD flows.

## Data Model

- `Category.type`: reuse `TransactionType` (`income | expense`).
- `Category.color`: fixed union of Cashi palette values.
- Add defaults for legacy categories to avoid crashes after users already have local AsyncStorage data.

## CLP Formatting

Create `src/domain/money.ts` with `formatCLP(amount)` and `formatSignedCLP(amount, type)` helpers. Use `Intl.NumberFormat('es-CL')` or equivalent deterministic formatting with `CLP`, no decimals.

## Balance Insight

Compute `primaryExpenseCategory` in `useTransactions` by summing expense transactions by categoryId and resolving the category name/color. Return `null` when no expense categories exist.

## UI Scope for This Change

Only minimal UI updates needed to support new fields:

- Category form: name, type segmented control, color fixed palette.
- Category list: show type/color metadata enough to verify behavior.
- Balance summary: show principal expense category.
  Full OpenDesign visual styling remains for the next change.

## TDD Plan

1. RED tests for category schema metadata.
2. RED tests for category form metadata submission.
3. RED tests for CLP formatting.
4. RED tests for principal expense category.
5. GREEN implementation.
6. Verify full suite and Android bundle.
