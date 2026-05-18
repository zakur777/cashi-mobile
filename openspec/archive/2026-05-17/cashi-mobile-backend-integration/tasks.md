# Tasks: Cashi Mobile Backend Integration API Layer

## Review Workload Forecast

| Field                   | Value           |
| ----------------------- | --------------- |
| Estimated changed lines | 260–380         |
| 400-line budget risk    | Medium          |
| Chained PRs recommended | No              |
| Suggested split         | single PR       |
| Delivery strategy       | single-pr       |
| Chain strategy          | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Medium

## Implementation Tasks (Strict TDD)

- [x] 1. **RED — API config tests**: Create `__tests__/apiConfig.test.ts` covering:
  - `resolveApiBaseUrl` reads explicit input and trims/strips trailing slash.
  - no hardcoded localhost fallback when env/extra are missing.
  - `requireApiBaseUrl` throws typed config error for missing/invalid URL.
  - accepts only `http://` or `https://` URLs.

- [x] 2. **RED — API mapper tests**: Create `__tests__/apiMappers.test.ts` covering:
  - category DTO ↔ domain mapping (`number` id ↔ `string` id, type/color preservation).
  - transaction DTO ↔ domain mapping (description `null` → `""`, categoryId conversion, ISO date passthrough).
  - outbound transaction/category mapping trims values and omits empty description.
  - invalid outbound id conversion raises mapper/client-safe error.
  - balance DTO → domain passthrough.

- [x] 3. **RED — API client tests (mocked fetch)**: Create `__tests__/apiClient.test.ts` covering:
  - request construction for health/categories/transactions/balance CRUD (method, path, headers, body).
  - JSON parsing success paths with DTO typing boundaries.
  - error normalization for `400/404/409/422/5xx` and unknown non-2xx statuses.
  - network rejection handling and parse-failure handling.
  - uses injected `fetchImpl`; no live backend calls.

- [x] 4. **GREEN — DTO and error primitives**: Implement:
  - `src/api/dto.ts` (health/category/transaction/balance request+response DTOs).
  - `src/api/errors.ts` (`ApiClientError`, error kind/code types, status mapping helpers).

- [x] 5. **GREEN — API config implementation**: Implement `src/api/config.ts` with:
  - `normalizeApiBaseUrl`, `resolveApiBaseUrl`, `requireApiBaseUrl`.
  - env + Expo extra resolution behavior from design (`EXPO_PUBLIC_CASHI_API_BASE_URL`, `expoConfig.extra.cashiApiBaseUrl`).
  - strict URL validation and config-error throws.

- [x] 6. **GREEN — Mapper implementation**: Implement `src/api/mappers.ts` with:
  - category/transaction/balance mapping functions described in spec/design.
  - numeric/string ID conversion helpers with validation.
  - description/date/category field rules and outbound cleanup.

- [x] 7. **GREEN — Fetch client implementation**: Implement `src/api/client.ts` with:
  - `createCashiApiClient({ baseUrl, fetchImpl })`.
  - endpoint methods for health, categories CRUD, transactions CRUD, and balance.
  - shared request helper (path join, JSON headers/body, response parse).
  - normalized error translation via `src/api/errors.ts`.

- [x] 8. **TRIANGULATE — Public API surface & integration sanity**:
  - Add `src/api/index.ts` exports for DTO/config/errors/mappers/client.
  - Extend tests for at least one additional edge path per module (e.g., unknown HTTP status, whitespace-only base URL, non-numeric string id).

- [x] 9. **REFACTOR — Keep slice boundaries intact**:
  - Refine naming/types/internal helpers without changing behavior.
  - Confirm no edits to `src/hooks/useCategories.ts`, `src/hooks/useTransactions.ts`, or local-storage active UX flows.
  - Confirm no new native dependencies in `package.json`.

- [x] 10. **VERIFY**:
  - Run `npm test`.
  - Run `npm run typecheck`.
  - Optionally run `expo export` for bundling confidence.
  - Do not start backend/Postgres/Docker/watchers.

## Acceptance Evidence Checklist

- [x] RED stage captured (tests fail before implementation).
- [x] GREEN stage captured (tests pass after implementation).
- [x] Client tests are mocked-fetch only; no backend runtime required.
- [x] DTO/config/errors/mappers/client/index implemented under `src/api`.
- [x] Existing screen/hook local storage behavior remains default in this slice.
- [x] No native dependency additions.
