# Apply Progress — Backend Integration Repositories Slice

## Status

applied

## Workload / PR boundary

- Assigned slice: **slice 1 only** — data-source resolver + repository contracts/adapters + unit tests.
- Delivery path: chained/split delivery selected by parent/user; hook wiring is explicitly deferred.
- Estimated/reported slice size: 435 lines across new repository files and tests.
- Review note: this slice is isolated and additive, but still near/over the 400-line budget because it includes both adapters and tests. No screens/hooks were modified.

## Completed tasks

- [x] RED — `__tests__/dataSource.test.ts`
- [x] RED — `__tests__/repositories.local.test.ts`
- [x] RED — `__tests__/repositories.backend.test.ts`
- [x] GREEN — `src/repositories/types.ts`
- [x] GREEN — `src/repositories/dataSource.ts`
- [x] GREEN — `src/repositories/localRepositories.ts`
- [x] GREEN — `src/repositories/backendRepositories.ts`
- [x] GREEN — `src/repositories/index.ts`
- [x] VERIFY — focused tests, full tests, typecheck

## Files changed

### Added

- `src/repositories/types.ts`
- `src/repositories/dataSource.ts`
- `src/repositories/localRepositories.ts`
- `src/repositories/backendRepositories.ts`
- `src/repositories/index.ts`
- `__tests__/dataSource.test.ts`
- `__tests__/repositories.local.test.ts`
- `__tests__/repositories.backend.test.ts`

### Intentionally unchanged

- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `app/**`
- `src/storage/**`
- `package.json` / lockfiles
- `Cashi-Mobile-UX-Polish/**`

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| Data source resolver | `__tests__/dataSource.test.ts` | Unit | N/A (new) | ✅ Failed: missing `src/repositories/dataSource` | ✅ Focused tests passed | ✅ explicit/env/expo/default/invalid cases | ✅ Explicit blank input fixed to local; pure resolver kept small |
| Local repositories | `__tests__/repositories.local.test.ts` | Unit with storage mocks | N/A (new) | ✅ Failed: missing `src/repositories/localRepositories` | ✅ Focused tests passed | ✅ categories + transactions, get/create/update/delete, legacy normalization | ✅ Shared local id builder and category normalizer |
| Backend repositories | `__tests__/repositories.backend.test.ts` | Unit with mocked API client | N/A (new) | ✅ Failed: missing `src/repositories/backendRepositories` | ✅ Focused tests passed | ✅ categories + transactions, id conversion, blank description, API error passthrough | ✅ Small factory functions over existing API mappers |

## Test commands run

1. RED focused run:

```text
npm test -- --runInBand __tests__/dataSource.test.ts __tests__/repositories.local.test.ts __tests__/repositories.backend.test.ts
```

Result: ✅ RED captured; 3 suites failed because repository modules did not exist.

2. GREEN focused run:

```text
npm test -- --runInBand __tests__/dataSource.test.ts __tests__/repositories.local.test.ts __tests__/repositories.backend.test.ts
```

Result: ✅ 3 suites passed, 11 tests passed.

3. Full Jest suite:

```text
npm test -- --runInBand
```

Result: ✅ 23 suites passed, 89 tests passed.

4. Typecheck:

```text
npm run typecheck
```

Result: ✅ passed.

Known unrelated test noise: existing `@expo/vector-icons` async `act(...)` warnings remain in icon-rendering tests; tests pass.

## Implementation notes

- `resolveCashiDataSource` supports explicit input, `EXPO_PUBLIC_CASHI_DATA_SOURCE`, Expo extra `cashiDataSource`, and defaults to `local`.
- Blank explicit source resolves to `local` and does not fall through to env/backend.
- Invalid source values throw `ApiClientError` with `kind: 'config'`.
- `localCategoryRepository` wraps existing demo seed + storage behavior and normalizes legacy category `type/color` defaults.
- `localTransactionRepository` wraps existing demo seed + transaction storage behavior.
- `createBackendCategoryRepository(client)` and `createBackendTransactionRepository(client)` wrap the verified `src/api` client and mappers.
- Backend repositories validate mobile string ids before calling API client through existing `mapMobileIdToBackendId`.
- Backend repository factories accept an injected `CashiApiClient`; default client creation remains lazy via default parameter and is not invoked in tests.

## Constraint checks

- Backend/PostgreSQL/Docker/watchers started: **No**.
- Hook wiring implemented: **No**.
- Screens edited: **No**.
- Storage modules edited: **No**.
- Package/native dependency changes: **No**.
- `Cashi-Mobile-UX-Polish/**` edited: **No**.
- Tests use mocked storage/API client only: **Yes**.
- Local-first remains default: **Yes**.

## Deviations / risks

- The slice size is 435 lines including tests, slightly above the nominal 400-line review budget, but it is the approved first split slice and remains isolated to repository boundaries.
- Hook selection/wiring is intentionally not implemented; repositories are currently additive and unused by active screens.
- Expo extra fallback test required isolated module mocking because `expo-constants` runtime object is not directly mutable.

## Remaining tasks

- Slice 2: refactor `useCategories` and `useTransactions` to select injected/local/backend repositories while preserving local-first default.
- Add hook-level tests for repository injection, backend config failure, and mutation error messages.
- Later, after approval, start backend and perform live Android network validation.
