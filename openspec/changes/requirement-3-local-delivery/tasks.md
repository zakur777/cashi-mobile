# Tasks: Requirement 3 Local Delivery

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 650-900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 types/persistence/backend safety → PR 2 device hooks/UI → PR 3 docs/final verification |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Optional metadata model, local persistence, backend omission | PR 1 | Include tests proving local default and mapper safety. |
| 2 | Device hooks and transaction form/screen UX | PR 2 | Depends on PR 1; include hook/UI tests. |
| 3 | README and final evidence | PR 3 | Depends on PR 2; run `npm test` and `npm run typecheck`. |

## Phase 1: RED Tests — Data Contracts

- [x] 1.1 Add failing metadata/legacy cases to `__tests__/schemas.test.ts` and `__tests__/transactionsStorage.test.ts`.
- [x] 1.2 Add failing local create/update metadata cases to `__tests__/repositories.local.test.ts`.
- [x] 1.3 Add failing backend omission/default-local cases to `__tests__/apiMappers.test.ts`, `__tests__/repositories.backend.test.ts`, and `__tests__/dataSource.test.ts`.

## Phase 2: GREEN — Model, Storage, Backend Safety

- [x] 2.1 Update `package.json`/lockfile via `npx expo install expo-image-picker expo-location`.
- [x] 2.2 Configure `app.json` camera, gallery, and foreground-location permission strings.
- [x] 2.3 Add `TransactionLocation` plus optional `photoUri`/`location` to `src/domain/types.ts` and `src/repositories/types.ts`.
- [x] 2.4 Update `src/domain/schemas.ts` so metadata is optional and metadata-free valid transactions still pass.
- [x] 2.5 Keep `src/api/dto.ts` metadata-free and adjust `src/api/mappers.ts` only to explicitly omit local-only fields.

## Phase 3: RED/GREEN — Hooks and UX

- [x] 3.1 Create failing hook tests for denied/granted/clear flows in `__tests__/useImagePicker.test.ts` and `__tests__/useLocation.test.ts`.
- [x] 3.2 Create `src/hooks/useImagePicker.ts` and `src/hooks/useLocation.ts` with Expo mocks in `jest/setup.ts` only if shared.
- [x] 3.3 Add failing form/screen tests in `__tests__/transactionDetailScreen.test.tsx` for preview, coordinates, inline errors, edit initialization, and clear/save.
- [x] 3.4 Update `src/hooks/useTransactionForm.ts`, `src/components/transactions/TransactionForm.tsx`, and `app/(tabs)/transaction/[id].tsx`; keep logic in hooks/screen and render-only components with `StyleSheet.create()`.

## Phase 4: Verification and Docs

- [x] 4.1 Update `README.md` with Requirement 3 local usage, backend preservation, URI caveat, install/run/test/typecheck evidence.
- [x] 4.2 Run `npm test` and `npm run typecheck`; record RED→GREEN→REFACTOR evidence for each work unit.
