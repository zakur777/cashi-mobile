# Design: Opt-in Backend Wiring in Cashi Mobile

## Executive summary

The current `src/api` layer is ready and verified, but it is intentionally not wired into the active UI. The next implementation slice should add a repository boundary with two adapters:

1. **Local adapter** wrapping the existing AsyncStorage/demo-seed behavior.
2. **Backend adapter** wrapping `createCashiApiClient` plus DTO/domain mappers.

The existing hooks (`useCategories`, `useTransactions`) should select repositories through an explicit opt-in data-source config. Default behavior remains local-first. Backend mode is activated only when configuration explicitly requests it and a valid backend base URL exists.

## Design goals

- Preserve local-first UX by default.
- Make backend wiring explicit and reversible with config/env.
- Avoid live backend calls in tests.
- Preserve Expo Go and avoid new native dependencies.
- Keep screens mostly unchanged by moving selection inside hooks.
- Keep backend mode additive; no auth, sync/merge, pagination, or offline cache in this slice.

## Non-goals

- Starting backend, PostgreSQL, Docker, Expo watchers, or any live service.
- Replacing local data as the default app behavior.
- Adding native modules or state-management libraries.
- Implementing conflict resolution or local/backend synchronization.
- Adding auth/user scoping.

## Proposed files

### New files

- `src/repositories/types.ts`
- `src/repositories/localRepositories.ts`
- `src/repositories/backendRepositories.ts`
- `src/repositories/dataSource.ts`
- `src/repositories/index.ts`
- `__tests__/repositories.local.test.ts`
- `__tests__/repositories.backend.test.ts`
- `__tests__/dataSource.test.ts`

### Modified files

- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `__tests__/useCategories.test.ts`
- `__tests__/useTransactions.test.ts`

### Files intentionally unchanged unless tests expose a necessary integration issue

- `app/(tabs)/*.tsx`
- `app/(tabs)/category/[id].tsx`
- `app/(tabs)/transaction/[id].tsx`
- `src/storage/*.ts`
- `package.json` / lockfile

## Configuration contract

Add an app data-source resolver separate from API base URL resolution.

```ts
type CashiDataSource = "local" | "backend";

interface DataSourceConfigInput {
  dataSource?: string | null;
}

function resolveCashiDataSource(input?: DataSourceConfigInput): CashiDataSource;
```

Resolution order:

1. Explicit input, for tests/hook injection.
2. `process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE`.
3. `Constants.expoConfig?.extra?.cashiDataSource`.
4. Default: `'local'`.

Rules:

- Only `'local'` and `'backend'` are valid.
- Missing/blank config resolves to `'local'`.
- Invalid values throw a typed config `ApiClientError`.
- `EXPO_PUBLIC_CASHI_API_BASE_URL` is required only when selected source is `'backend'`.
- Do not call `requireApiBaseUrl()` at module import time.

## Repository contracts

```ts
interface CategoryRepository {
  getAll(): Promise<Category[]>;
  create(input: CategoryInput): Promise<Category>;
  update(id: string, input: CategoryInput): Promise<Category>;
  delete(id: string): Promise<void>;
}

interface TransactionInput {
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
}

interface TransactionRepository {
  getAll(): Promise<Transaction[]>;
  create(input: TransactionInput): Promise<Transaction>;
  update(id: string, input: TransactionInput): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
```

Keep balance calculation in `useTransactions` for this slice. The backend balance endpoint remains available in `src/api/client.ts`, but hook totals should continue deriving from the transaction list so the UI has consistent behavior across local and backend modes and still supports `primaryExpenseCategory`.

## Adapter behavior

### Local repositories

Local category repository:

- `getAll()` calls `seedDemoDataIfEmpty()` and `categoriesStorage.getAll()`.
- Applies the same legacy normalization currently in `useCategories` (`type ?? 'expense'`, `color ?? CATEGORY_COLORS.lime`).
- `create/update/delete` mirrors current hook persistence semantics.

Local transaction repository:

- `getAll()` calls `seedDemoDataIfEmpty()` and `transactionsStorage.getAll()`.
- `create/update/delete` mirrors current hook persistence semantics.

### Backend repositories

Backend category repository:

- `getAll()` calls `client.getCategories()` then `mapCategoryDtoToDomain`.
- `create()` uses `mapCategoryDomainToCreateDto`, then maps response to domain.
- `update()` converts mobile string id via `mapMobileIdToBackendId`, uses `mapCategoryDomainToUpdateDto`, maps response.
- `delete()` converts id and calls `client.deleteCategory(id)`; returns `void`.

Backend transaction repository:

- `getAll()` calls `client.getTransactions()` then `mapTransactionDtoToDomain`.
- `create()` uses `mapTransactionDomainToCreateDto`, maps response.
- `update()` converts id, uses `mapTransactionDomainToUpdateDto`, maps response.
- `delete()` converts id and calls `client.deleteTransaction(id)`; returns `void`.

Error handling:

- Preserve `ApiClientError` internally for tests/diagnostics.
- Hooks should translate repository failures to current Spanish user-facing strings:
  - categories load: `No se pudieron cargar las categorías`
  - category mutation: `No se pudo guardar la categoría` / `No se pudo eliminar la categoría`
  - transactions load: `No se pudieron cargar las transacciones`
  - transaction mutation: `No se pudo guardar la transacción` / `No se pudo eliminar la transacción`

## Hook selection design

Add optional hook dependencies for tests while keeping current screen call sites valid:

```ts
interface UseCategoriesOptions {
  repository?: CategoryRepository;
  dataSource?: CashiDataSource;
}

function useCategories(options?: UseCategoriesOptions): UseCategoriesResult;

interface UseTransactionsOptions {
  categories?: Category[];
  repository?: TransactionRepository;
  dataSource?: CashiDataSource;
}
```

Selection rules:

1. If `repository` is passed, use it. This enables deterministic hook tests.
2. Otherwise resolve data source from explicit option/env/Expo extra.
3. If source is `local`, use singleton local repositories.
4. If source is `backend`, create backend repositories from `createDefaultCashiApiClient()` lazily.
5. If backend is selected but base URL is missing/invalid, hook refresh should enter error state without crashing the render phase.

## Strict TDD implementation plan

### RED

1. Add `dataSource` resolver tests.
2. Add local repository tests.
3. Add backend repository tests using a mocked `CashiApiClient`.
4. Add hook selection tests.

### GREEN

Implement minimal repository types/adapters/data-source resolver. Refactor hooks to delegate to repositories while preserving returned result shapes.

### VERIFY

Run, without starting backend/services:

```text
npm test -- --runInBand
npm run typecheck
```

Optional only if requested: `npx expo export --platform android`.

## Stop conditions

Stop and ask for a delivery/product decision before implementation continues if any of these occur:

- Enabling backend by default is requested.
- A live backend, PostgreSQL, Docker, or watcher startup is needed.
- New native dependencies are proposed.
- Hook/screen changes require replacing local UX instead of opt-in backend mode.
- Review-size forecast clearly exceeds the configured 400 changed-line budget.
- Backend contract no longer includes category `type` and `color`.
