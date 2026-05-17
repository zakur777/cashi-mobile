# Apply Progress — cashi-mobile-demo-seed-data

## Status

implemented

## Strict TDD Evidence

### RED

Command:

```text
npm test -- --runInBand __tests__/demoSeed.test.ts
```

Result: failed because `../src/storage/demoSeed` did not exist.

### GREEN

Implemented:

- `src/storage/demoSeed.ts`
- hook integration in `src/hooks/useCategories.ts`
- hook integration in `src/hooks/useTransactions.ts`
- test mocks in hook tests so existing hook specs remain focused

Focused command:

```text
npm test -- --runInBand __tests__/demoSeed.test.ts __tests__/useCategories.test.ts __tests__/useTransactions.test.ts
```

Result: 3 suites passed, 12 tests passed.

### REFACTOR

- Fixtures are deterministic and typed.
- Seed service is centralized in storage boundary.
- Components remain unchanged and render-only.

## Completed Tasks

- [x] Added deterministic demo categories and transactions.
- [x] Added `seedDemoDataIfEmpty()` with empty-only guard.
- [x] Integrated seed initialization before category/transaction refresh.
- [x] Proved no overwrite and idempotency in tests.
- [x] Verified category ids referenced by demo transactions exist.

## Files Changed

- `src/storage/demoSeed.ts`
- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `__tests__/demoSeed.test.ts`
- `__tests__/useCategories.test.ts`
- `__tests__/useTransactions.test.ts`

## Notes

The app seeds only when both category and transaction stores are empty. Existing data prevents demo seeding, preserving user-entered data.
