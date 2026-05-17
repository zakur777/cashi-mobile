# Apply Progress — Category Metadata and Balance Insight

## Status

implemented

## Strict TDD Evidence

### RED

Focused tests were added before implementation for:

- category schema type/color validation
- category form metadata submission
- CLP formatting
- primary expense category computation

Focused command initially failed as expected because `src/domain/money.ts`, `CATEGORY_COLORS`, form setters, and `primaryExpenseCategory` did not exist.

```text
npm test -- --runInBand __tests__/money.test.ts __tests__/schemas.test.ts __tests__/useCategoryForm.test.ts __tests__/useTransactions.test.ts
```

### GREEN

Implemented:

- `CATEGORY_COLORS`, `CategoryColor`, `CategoryInput`, and category metadata fields
- `formatCLP` / `formatSignedCLP`
- category schema metadata validation
- category form hook and UI type/color controls
- category list metadata display
- CLP demo seed amounts and category metadata
- primary expense category calculation in `useTransactions`
- balance principal category rendering

Focused test pass:

```text
npm test -- --runInBand __tests__/money.test.ts __tests__/schemas.test.ts __tests__/useCategoryForm.test.ts __tests__/useCategories.test.ts __tests__/useTransactions.test.ts __tests__/CategoryList.test.tsx __tests__/TransactionList.test.tsx __tests__/balanceScreen.test.tsx
```

Result: 8 suites passed, 28 tests passed.

### REFACTOR

- Added legacy category defaults in `useCategories` so old AsyncStorage records do not crash.
- Kept AsyncStorage access in storage layer and components render-only.

## Files Changed

- `src/domain/types.ts`
- `src/domain/schemas.ts`
- `src/domain/money.ts`
- `src/storage/demoSeed.ts`
- `src/hooks/useCategoryForm.ts`
- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `src/components/categories/CategoryForm.tsx`
- `src/components/categories/CategoryList.tsx`
- `src/components/transactions/TransactionList.tsx`
- `src/components/balance/BalanceSummary.tsx`
- `app/(tabs)/category/[id].tsx`
- `app/(tabs)/categories.tsx`
- `app/(tabs)/balance.tsx`
- tests under `__tests__/`
