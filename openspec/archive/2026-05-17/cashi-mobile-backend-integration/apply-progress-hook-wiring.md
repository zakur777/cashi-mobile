# Apply Progress — Backend Integration Hook Wiring Slice

## Status

applied

## Workload / PR boundary

- Assigned slice: **slice 2 only** — `useCategories` / `useTransactions` opt-in repository selection and hook tests.
- Delivery path: chained/split delivery selected by parent/user; repositories slice was already completed separately.
- Changed tracked files for this slice: **4 files, 282 insertions / 77 deletions**.
- Review note: hook wiring is isolated from the previously-added API/repository files and keeps active UI local-first by default.

## Completed tasks

- [x] RED — hook tests for injected repositories, backend missing config errors, and mutation error messages.
- [x] GREEN — `useCategories` delegates to selected repositories while preserving return shape.
- [x] GREEN — `useTransactions` delegates to selected repositories while preserving derived totals/category projections.
- [x] TRIANGULATE — local default behavior remains covered by existing storage-backed tests; backend source failure covered without live backend.
- [x] REFACTOR — screens/storage/package files left unchanged.
- [x] VERIFY — focused hook tests, full tests, typecheck.

## Files changed

- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `__tests__/useCategories.test.ts`
- `__tests__/useTransactions.test.ts`

## TDD Cycle Evidence

| Task                     | Test File                           | Layer               | Safety Net                       | RED                                                                            | GREEN                        | TRIANGULATE                                                                                                 | REFACTOR                                                     |
| ------------------------ | ----------------------------------- | ------------------- | -------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Categories hook wiring   | `__tests__/useCategories.test.ts`   | Hook/component unit | Existing categories hook tests   | ✅ Failed: injected repository ignored; mutation errors not surfaced           | ✅ Focused hook tests passed | ✅ local default, injected repo, backend missing base URL, save/delete errors covered                       | ✅ Hook selection isolated; screens unchanged                |
| Transactions hook wiring | `__tests__/useTransactions.test.ts` | Hook/component unit | Existing transactions hook tests | ✅ Failed: new options unsupported / hook stayed loading before implementation | ✅ Focused hook tests passed | ✅ injected repo, backend missing base URL, derived balance/category projection, save/delete errors covered | ✅ Balance and primary category derivation preserved in hook |

## Test commands run

1. RED focused run:

```text
npm test -- --runInBand __tests__/useCategories.test.ts __tests__/useTransactions.test.ts
```

Result: ✅ RED captured. New tests failed because hooks did not yet support repository/dataSource options and mutation failure behavior.

2. GREEN focused run:

```text
npm test -- --runInBand __tests__/useCategories.test.ts __tests__/useTransactions.test.ts
```

Result: ✅ 2 suites passed, 15 tests passed.

3. Full Jest suite:

```text
npm test -- --runInBand
```

Result: ✅ 23 suites passed, 95 tests passed.

4. Typecheck:

```text
npm run typecheck
```

Result: ✅ passed.

Known unrelated test noise: existing `@expo/vector-icons` async `act(...)` warnings remain in icon-rendering tests; tests pass.

## Implementation notes

- `useCategories` now accepts optional `{ repository?, dataSource? }`.
- `useTransactions` now accepts optional `{ categories?, repository?, dataSource? }`.
- Selection order:
  1. injected repository;
  2. resolved data source;
  3. local repository by default;
  4. backend repository only when explicitly selected.
- Backend repository creation happens inside async hook operations, not at module import/render time.
- Backend selected with missing/invalid base URL sets hook error state instead of crashing render.
- Hook mutation failures set Spanish user-facing errors and rethrow the original error so form callers can still handle failures.
- `useTransactions` continues deriving `transactionsWithCategory`, totals, balance, and `primaryExpenseCategory` from the transaction list.

## Constraint checks

- Backend/PostgreSQL/Docker/watchers started: **No**.
- Screens edited: **No**.
- Storage modules edited: **No**.
- Package/native dependency changes: **No**.
- `Cashi-Mobile-UX-Polish/**` edited: **No**.
- Tests use injected repositories/mocks only: **Yes**.
- Local-first remains default: **Yes**.
- Active screen call sites remain compatible: **Yes**.

## Deviations / risks

- Existing hook tests needed additional storage mocks because hooks now import the repository barrel, which exposes both local adapters. This remains test-only and does not change runtime behavior.
- Hook mutations now rethrow after setting an error. This preserves failure visibility for callers and adds user-facing hook error state, but future UI wiring should decide how to display those messages.
- Backend mode remains opt-in and untested against a live backend in this slice by design.

## Remaining tasks

- Run SDD verify for the complete `cashi-mobile-backend-integration` mobile work.
- Decide whether to commit mobile backend integration in one commit or split commits by API layer / repositories / hook wiring.
- Later, after approval, start backend and perform live Android network validation with `EXPO_PUBLIC_CASHI_DATA_SOURCE=backend` and a configured API base URL.

## Skill resolution

none
