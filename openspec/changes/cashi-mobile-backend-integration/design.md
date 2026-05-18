# Design: Cashi Mobile Backend Integration API Layer

## Status

designed

## Scope

This design covers the first **mobile-only** backend-integration slice for `cashi-mobile-backend-integration`:

- typed backend DTOs
- configurable API base URL resolution
- fetch-based API client
- DTO/domain mappers
- mocked-fetch tests

This slice explicitly does **not**:

- start the backend, PostgreSQL, Docker, or file watchers
- add native dependencies or leave Expo Go compatibility
- replace the current local-storage-driven category, transaction, or balance screen behavior
- introduce auth, pagination, filtering, or user/account scoping

## Current mobile model summary

`src/domain/types.ts` defines the active app domain:

```ts
type TransactionType = "income" | "expense";

type CategoryColor = "#281C59" | "#4E8D9C" | "#85C79A" | "#EDF7BD";

interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: CategoryColor;
}

interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
}

interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
```

The active hooks (`useCategories`, `useTransactions`) load and persist through AsyncStorage. They also seed demo data and compute balance locally. This design preserves those code paths as the default UX path for this slice.

## Backend contract targeted by mobile

The backend category contract is expected to include `type` and `color`; ids remain numeric.

### Health

```ts
GET /health -> { status: 'ok' }
```

### Category DTOs

```ts
interface BackendCategoryDto {
  id: number;
  name: string;
  type: "income" | "expense";
  color: "#281C59" | "#4E8D9C" | "#85C79A" | "#EDF7BD";
}

interface CreateCategoryRequestDto {
  name: string;
  type: "income" | "expense";
  color: "#281C59" | "#4E8D9C" | "#85C79A" | "#EDF7BD";
}

type UpdateCategoryRequestDto = Partial<CreateCategoryRequestDto>;
```

### Transaction DTOs

```ts
interface BackendTransactionDto {
  id: number;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  categoryId: number;
  category: BackendCategoryDto;
}

interface CreateTransactionRequestDto {
  amount: number;
  type: "income" | "expense";
  description?: string;
  date: string;
  categoryId: number;
}

type UpdateTransactionRequestDto = Partial<CreateTransactionRequestDto>;
```

### Balance DTO

```ts
interface BackendBalanceDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
```

## Proposed file changes

### New files

- `src/api/dto.ts`
- `src/api/errors.ts`
- `src/api/config.ts`
- `src/api/mappers.ts`
- `src/api/client.ts`
- `src/api/index.ts`
- `__tests__/apiConfig.test.ts`
- `__tests__/apiMappers.test.ts`
- `__tests__/apiClient.test.ts`

### Existing files intentionally unchanged in this slice

- `src/hooks/useCategories.ts`
- `src/hooks/useTransactions.ts`
- `src/storage/categoriesStorage.ts`
- `src/storage/transactionsStorage.ts`
- screens and navigation files

These remain local-first until a later repository/hook wiring slice.

## Configuration design

Use existing Expo/runtime mechanisms only:

1. Prefer `process.env.EXPO_PUBLIC_CASHI_API_BASE_URL` when available.
2. Fall back to `Constants.expoConfig?.extra?.cashiApiBaseUrl` from `expo-constants` if configured.
3. If neither exists, return `null` from a pure resolver and make default client creation fail with a typed config error.

`expo-constants` is already present in `package.json`, so this adds no native dependency beyond the existing Expo dependency footprint.

Recommended functions:

```ts
interface ApiConfigInput {
  baseUrl?: string | null;
}

function normalizeApiBaseUrl(baseUrl: string): string;
function resolveApiBaseUrl(input?: ApiConfigInput): string | null;
function requireApiBaseUrl(input?: ApiConfigInput): string;
```

Behavior:

- Trim whitespace.
- Strip trailing slashes.
- Require `http://` or `https://`.
- Do not default to `localhost`.
- Throw `ApiClientError` with kind `config` for missing or invalid URLs when a required base URL is needed.

Example runtime values:

- Android emulator: `http://10.0.2.2:3000`
- Physical device: `http://<LAN-IP>:3000`
- Tunnel/proxy: `https://<public-or-tunnel-host>`

## API client design

```ts
interface CashiApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

function createCashiApiClient(options: CashiApiClientOptions): CashiApiClient;
```

Injecting `fetchImpl` keeps tests isolated from real network calls.

Client interface:

```ts
interface CashiApiClient {
  health(): Promise<HealthDto>;
  getCategories(): Promise<BackendCategoryDto[]>;
  getCategory(id: number): Promise<BackendCategoryDto>;
  createCategory(input: CreateCategoryRequestDto): Promise<BackendCategoryDto>;
  updateCategory(
    id: number,
    input: UpdateCategoryRequestDto,
  ): Promise<BackendCategoryDto>;
  deleteCategory(id: number): Promise<BackendCategoryDto>;
  getTransactions(): Promise<BackendTransactionDto[]>;
  getTransaction(id: number): Promise<BackendTransactionDto>;
  createTransaction(
    input: CreateTransactionRequestDto,
  ): Promise<BackendTransactionDto>;
  updateTransaction(
    id: number,
    input: UpdateTransactionRequestDto,
  ): Promise<BackendTransactionDto>;
  deleteTransaction(id: number): Promise<BackendTransactionDto>;
  getBalance(): Promise<BackendBalanceDto>;
}
```

Request construction:

- JSON requests include `Content-Type: application/json` and `Accept: application/json`.
- GET/DELETE requests include `Accept: application/json`; DELETE does not send a body.
- Paths are appended to normalized `baseUrl` without double slashes.
- Bodies are `JSON.stringify`-encoded only when present.

## Error normalization

Define a stable error shape:

```ts
type ApiErrorKind = "config" | "network" | "http" | "parse";

interface NormalizedApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?:
    | "bad_request"
    | "not_found"
    | "conflict"
    | "unprocessable_entity"
    | "server_error"
    | "unknown_http_error";
  details?: unknown;
}

class ApiClientError extends Error {
  readonly error: NormalizedApiError;
}
```

HTTP status mapping:

| Status        | code                   | default message                              |
| ------------- | ---------------------- | -------------------------------------------- |
| 400           | `bad_request`          | `Solicitud inválida`                         |
| 404           | `not_found`            | `Recurso no encontrado`                      |
| 409           | `conflict`             | `El recurso ya existe o está en conflicto`   |
| 422           | `unprocessable_entity` | `No se pudo procesar la solicitud`           |
| 500-599       | `server_error`         | `El servidor no pudo completar la solicitud` |
| other non-2xx | `unknown_http_error`   | `No se pudo completar la solicitud`          |

Network failures become `kind: 'network'`. Invalid JSON for a successful response becomes `kind: 'parse'` because the typed contract was not met.

## Mapper design

### Identifier conversion

Backend ids are numbers. Mobile domain ids are strings.

Inbound:

```ts
backend id 12 -> mobile id '12'
```

Outbound:

```ts
mobile id '12' -> backend id 12
```

Outbound conversion should validate non-empty finite positive integers before request construction.

### Category mapping

```ts
function mapCategoryDtoToDomain(dto: BackendCategoryDto): Category;
function mapCategoryDomainToCreateDto(
  input: CategoryInput,
): CreateCategoryRequestDto;
function mapCategoryDomainToUpdateDto(
  input: Partial<CategoryInput>,
): UpdateCategoryRequestDto;
```

Rules:

- `id`: numeric to string.
- `name`: preserve inbound; trim outbound names.
- `type`: preserve exactly.
- `color`: preserve exactly and validate against `CATEGORY_COLORS` at runtime when mapping inbound unknown JSON.

### Transaction mapping

```ts
function mapTransactionDtoToDomain(dto: BackendTransactionDto): Transaction;
function mapTransactionDomainToCreateDto(
  input: Omit<Transaction, "id">,
): CreateTransactionRequestDto;
function mapTransactionDomainToUpdateDto(
  input: Partial<Omit<Transaction, "id">>,
): UpdateTransactionRequestDto;
```

Rules:

- `id`: numeric to string.
- `categoryId`: numeric to string inbound; validated string to number outbound.
- `amount`: preserve as number.
- `type`: preserve exactly.
- `date`: preserve backend ISO string as a string.
- `description`: map `null` inbound to `''`.
- Outbound `description`: trim; omit when empty.
- Embedded backend `category` is not embedded in the mobile `Transaction` domain object.

### Balance mapping

```ts
function mapBalanceDtoToDomain(dto: BackendBalanceDto): BalanceSummary;
```

Preserve `totalIncome`, `totalExpense`, and `balance` directly.

## Strict TDD plan

Test runner: `npm test`

No backend, PostgreSQL, Docker, file watchers, or live network calls are required.

### RED evidence plan

Before implementation, add failing tests:

1. `__tests__/apiConfig.test.ts`
2. `__tests__/apiMappers.test.ts`
3. `__tests__/apiClient.test.ts`

Expected RED result: `npm test` fails because `src/api/*` modules do not exist yet.

### GREEN evidence plan

Implement the smallest additive API layer to satisfy the tests:

1. Add `src/api/dto.ts`.
2. Add `src/api/errors.ts`.
3. Add `src/api/config.ts`.
4. Add `src/api/mappers.ts`.
5. Add `src/api/client.ts`.
6. Add `src/api/index.ts` exports.
7. Run `npm test`.
8. Run `npm run typecheck`.

## Rollout plan

### Slice 1: API layer only

Add files and tests listed above. Keep hooks/screens unchanged.

### Slice 2: Read repository boundary, still opt-in

Add repository/service adapters that can read from either local storage or API. Keep default local-first behavior.

### Slice 3: Screen read integration

Wire categories/transactions/balance reads behind explicit runtime selection.

### Slice 4: Mutations

Wire create/update/delete category and transaction methods.

## Verification checklist

- [ ] RED tests fail before implementation.
- [ ] GREEN implementation passes `npm test`.
- [ ] `npm run typecheck` passes.
- [ ] No backend, Docker, PostgreSQL, or watcher started.
- [ ] No new native dependencies added.
- [ ] Current hooks/screens still use local storage by default.
- [ ] Base URL has no hardcoded localhost fallback.
- [ ] DTOs include category `type`/`color` and numeric backend ids.
- [ ] Mappers cover category, transaction, balance, and error/id edge cases.
