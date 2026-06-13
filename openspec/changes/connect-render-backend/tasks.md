# Tasks: Connect Cashi Mobile to Production Backend

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 850-1,150 changed lines |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 auth/API foundation -> PR 2 server data repositories -> PR 3 route gating, docs, manual verification |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | API config, typed auth client, SecureStore token lifecycle | PR 1 | Tests included; no screen rewiring beyond auth seams. |
| 2 | Authenticated repositories, DTO mappers, upload-before-save, server balance/categories | PR 2 | Depends on PR 1 client/session contracts. |
| 3 | Hooks, route gating, login/logout UX, README/manual verification | PR 3 | Depends on PR 1-2; validates screen boundaries. |

## Phase 1: RED Tests for Foundation

- [x] 1.1 Add failing tests in `__tests__/apiConfig.test.ts` for `EXPO_PUBLIC_API_URL` Render base URL and no credential hardcoding.
- [x] 1.2 Add failing tests in `__tests__/apiClient.test.ts` for `/auth/login`, `/auth/register`, bearer headers, `body.error`, and `Error de conexión`.
- [x] 1.3 Add failing tests in `__tests__/authTokenStorage.test.ts` and `__tests__/AuthContext.test.tsx` for SecureStore save/load/delete, bootstrap, login, and logout.

## Phase 2: Auth and API Foundation

- [x] 2.1 Install Expo-compatible `expo-secure-store`; update `package.json` and lockfile.
- [x] 2.2 Update `src/api/config.ts`, `src/api/dto.ts`, `src/api/errors.ts`, `src/api/client.ts`, and `src/api/index.ts` for env, auth DTOs, bearer injection, JSON errors, and multipart upload.
- [x] 2.3 Create `src/storage/authTokenStorage.ts`, `src/contexts/AuthContext.tsx`, and `src/hooks/useAuth.ts` with strict TypeScript types and no `any`.

## Phase 3: Server Data Boundaries

- [x] 3.1 Add failing mapper/repository tests for numeric ids, `imageUrl`, coordinates, valid server category ids, upload-before-save, and `GET /transactions/balance`.
- [x] 3.2 Update `src/api/mappers.ts`, `src/domain/types.ts`, `src/domain/schemas.ts`, and `src/repositories/types.ts` for server ids, receipt URLs, coordinates, and balance contract.
- [x] 3.3 Update `src/repositories/backendRepositories.ts` so categories, transactions, upload, and balance use authenticated `CashiApiClient` without UI token plumbing.

## Phase 4: Hook and Route Integration

- [x] 4.1 Add failing hook/screen tests for login success/failure, protected redirect after `isInitializing=false`, stored-token login redirect, logout-to-login route gating, category errors, transaction CRUD, and balance focus refresh.
- [x] 4.2 Update `src/hooks/useLoginForm.ts`, `useCategories.ts`, `useTransactions.ts`, and `useTransactionForm.ts` to consume auth internally and preserve render-only screen APIs.
- [x] 4.3 Update `app/_layout.tsx`, `app/index.tsx`, `app/(tabs)/*`, and any logout surface so unauthenticated users see login and authenticated users reach protected tabs.

## Phase 5: Verification and Documentation

- [x] 5.1 Update `.env.example` and `README.md` with `EXPO_PUBLIC_API_URL=https://cashi-api-pphe.onrender.com`, external demo credentials, registration-service note, upload/manual checks, and logout/error verification.
- [x] 5.2 Run `npm test`, `npm run typecheck`, and manual Render checks for login, categories, transactions, upload, balance refresh, logout, and network failure. Automated checks passed; manual Render/device checks are documented for the user because this environment cannot operate an emulator/device session.
