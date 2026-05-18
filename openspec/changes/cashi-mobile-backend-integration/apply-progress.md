# Apply Progress — cashi-mobile-backend-integration

## Status

applied

## Executive summary

Implemented the first mobile-only backend integration slice without starting backend, PostgreSQL, Docker, or watchers. The slice adds an additive `src/api` layer with typed backend DTOs, base URL configuration, normalized errors, DTO/domain mappers, and a fetch-based Cashi API client. Current local-storage hooks/screens remain unchanged and continue to be the active UX path.

## Workload / PR boundary

- Delivery strategy from `tasks.md`: single-pr.
- 400-line budget risk: Medium.
- Runtime code/tests added: additive new files under `src/api` and `__tests__`.
- OpenSpec artifacts updated under `openspec/changes/cashi-mobile-backend-integration/`.
- Pre-existing dirty file preserved: `expo-env.d.ts`.

## Completed tasks

- [x] Task 1 — RED API config tests.
- [x] Task 2 — RED API mapper tests.
- [x] Task 3 — RED API client tests with mocked fetch.
- [x] Task 4 — DTO and error primitives.
- [x] Task 5 — API config implementation.
- [x] Task 6 — Mapper implementation.
- [x] Task 7 — Fetch client implementation.
- [x] Task 8 — Public API surface and edge-case triangulation.
- [x] Task 9 — Slice boundary refactor/sanity checks.
- [x] Task 10 — Verification commands.

## Files changed

### Added mobile API layer

- `src/api/dto.ts`
- `src/api/errors.ts`
- `src/api/config.ts`
- `src/api/mappers.ts`
- `src/api/client.ts`
- `src/api/index.ts`

### Added tests

- `__tests__/apiConfig.test.ts`
- `__tests__/apiMappers.test.ts`
- `__tests__/apiClient.test.ts`

### Updated SDD artifacts

- `openspec/changes/cashi-mobile-backend-integration/tasks.md`
- `openspec/changes/cashi-mobile-backend-integration/apply-progress.md`

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| API config | `__tests__/apiConfig.test.ts` | Unit | N/A (new) | ✅ Failed: missing `src/api/errors` and `src/api/config` | ✅ Focused API tests passed | ✅ explicit URL, env URL, missing URL, invalid protocol | ✅ Pure config helpers; no localhost fallback |
| API mappers | `__tests__/apiMappers.test.ts` | Unit | N/A (new) | ✅ Failed: missing `src/api/errors` and `src/api/mappers` | ✅ Focused API tests passed | ✅ category, transaction, balance, invalid id, blank description | ✅ Shared id validation and small pure functions |
| API client | `__tests__/apiClient.test.ts` | Unit with mocked fetch | N/A (new) | ✅ Failed: missing `src/api/errors` and `src/api/client` | ✅ Focused API tests passed | ✅ GET/POST/PATCH/DELETE, 400/404/409/422/5xx/unknown, network, parse | ✅ Shared request helper, headers, path join, error normalization |
| Public API / slice boundary | API tests + git checks | Unit + static checks | ✅ Existing full suite later passed | ✅ Public exports absent before implementation | ✅ Full suite passed | ✅ `src/api/index.ts` exports all modules; no hooks/screens wired | ✅ Additive slice only; package manifests unchanged |

## Test commands run

1. RED focused run:

```text
npm test -- --runInBand __tests__/apiConfig.test.ts __tests__/apiMappers.test.ts __tests__/apiClient.test.ts
```

Result: ✅ RED captured; 3 suites failed because `src/api/*` modules did not exist yet.

2. GREEN focused run:

```text
npm test -- --runInBand __tests__/apiConfig.test.ts __tests__/apiMappers.test.ts __tests__/apiClient.test.ts
```

Result: ✅ 3 suites passed, 20 tests passed.

3. Typecheck:

```text
npm run typecheck
```

Result: ✅ passed.

4. Full Jest suite:

```text
npm test -- --runInBand
```

Result: ✅ 20 suites passed, 78 tests passed.

Known test noise: existing `@expo/vector-icons` async `act(...)` warnings remain present in icon-rendering component tests; tests pass.

5. Expo Android export:

```text
npx expo export --platform android
```

Result: ✅ exported successfully to `dist`.

## Implementation notes

- `src/api/config.ts` resolves explicit base URL, `EXPO_PUBLIC_CASHI_API_BASE_URL`, and `expoConfig.extra.cashiApiBaseUrl` via existing `expo-constants` dependency.
- Missing configuration returns `null` from `resolveApiBaseUrl`; `requireApiBaseUrl` throws typed `ApiClientError` with `kind: 'config'`.
- There is no hardcoded localhost fallback.
- `src/api/mappers.ts` keeps ids string-based for the mobile domain and validates outbound ids before backend requests.
- Backend nullable transaction descriptions map to `''` for the current mobile domain.
- Blank outbound descriptions are omitted from transaction create/update DTOs.
- `src/api/client.ts` uses injected `fetchImpl` for tests and defaults to `globalThis.fetch` for runtime.
- HTTP, network, config, and parse failures normalize through `ApiClientError`.

## Constraint checks

- Backend/PostgreSQL/Docker/watchers started: **No**.
- Native dependencies added: **No**.
- Package manifests edited: **No**.
- Current local-storage hooks/screens replaced or wired to API: **No**.
- `src/hooks/useCategories.ts` edited: **No**.
- `src/hooks/useTransactions.ts` edited: **No**.
- Storage files edited: **No**.
- `Cashi-Mobile-UX-Polish/**` edited: **No**.
- `expo-env.d.ts` touched by this task: **No**; pre-existing dirty state remains.
- Backend repo edited by this task: **No**.

## Deviations from design

- `ApiConfigInput` remains minimal (`baseUrl?: string | null`) for the public API. Tests use explicit input and environment variables; Expo extra fallback is implemented but not deeply mocked to avoid fragile module mocking.
- Runtime DTO validation is intentionally light in this slice; mapper guards cover type/color/id paths used at boundaries. A later repository slice can add stronger response validation if desired.

## Remaining tasks

- Wire the API layer into an opt-in repository/hook boundary in a later SDD slice.
- Decide runtime base URL strategy before live testing:
  - Android emulator: `http://10.0.2.2:3000`
  - physical device: `http://<LAN-IP>:3000`
  - tunnel/proxy: public HTTPS URL
- Start backend only after the parent/user approves the live integration step.

## Skill resolution

none
