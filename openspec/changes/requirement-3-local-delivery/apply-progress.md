# Apply Progress: Requirement 3 Local Delivery

## Status

Completed with maintainer-approved `size:exception` for a single PR. No chained branches were created.

## Completed Tasks

- [x] 1.1 Data contract metadata/legacy tests.
- [x] 1.2 Local repository create/update metadata tests.
- [x] 1.3 Backend omission/default-local tests.
- [x] 2.1 Expo dependencies installed via `npx expo install expo-image-picker expo-location`.
- [x] 2.2 Camera/gallery/location permission strings configured in `app.json`.
- [x] 2.3 Optional transaction metadata types added.
- [x] 2.4 Zod transaction schema accepts optional metadata and metadata-free transactions.
- [x] 2.5 Backend DTOs remain metadata-free; mappers explicitly omit local-only fields.
- [x] 3.1 Hook tests added for denied/granted/clear flows.
- [x] 3.2 `useImagePicker` and `useLocation` hooks created.
- [x] 3.3 Screen tests added for preview, coordinates, inline errors, edit initialization, and clear/save.
- [x] 3.4 Transaction screen/form submit optional metadata while keeping components render-only.
- [x] 4.1 README documents local-first behavior, backend preservation, URI caveat, and commands.
- [x] 4.2 Verification commands run.

## TDD Cycle Evidence

| Task(s) | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.1, 2.3, 2.4 | `__tests__/schemas.test.ts`, `__tests__/transactionsStorage.test.ts` | Unit | Existing relevant tests passed except new schema RED | ✅ Schema failed because metadata was stripped | ✅ Data contract suite passed | ✅ Metadata and metadata-free legacy cases | ✅ Types/schema kept optional |
| 1.2 | `__tests__/repositories.local.test.ts` | Unit | Existing repository tests passed | ✅ New metadata persistence cases written first | ✅ Local repository suite passed | ✅ Create and update metadata cases | ✅ No production logic change beyond typed input |
| 1.3, 2.5 | `__tests__/apiMappers.test.ts`, `__tests__/repositories.backend.test.ts`, `__tests__/dataSource.test.ts` | Unit | Existing backend/data-source tests passed | ✅ Omission/default-local expectations written first | ✅ Backend/data-source suite passed | ✅ Mapper and repository omission cases | ✅ Mappers explicitly destructure local-only fields away |
| 3.1, 3.2 | `__tests__/useImagePicker.test.ts`, `__tests__/useLocation.test.ts` | Unit hook | N/A new hooks | ✅ Tests failed because hooks did not exist | ✅ Hook tests passed | ✅ Denied, granted, and clear/init cases | ✅ Fixed location initial object dependency loop |
| 3.3, 3.4 | `__tests__/transactionDetailScreen.test.tsx` | Component/screen | Existing screen focus test passed | ✅ Tests failed because UI/submit metadata did not exist | ✅ Screen tests passed | ✅ Preview/errors, create with metadata, edit initialized/cleared metadata | ✅ Kept device logic in hooks/screen and presentational props in form |
| 4.1, 4.2 | `README.md`, full suite | Docs/verification | N/A docs | ✅ Docs gap identified by task | ✅ README updated, commands passed | ➖ Documentation-only | ✅ Commands recorded below |

## Verification

- `npm test -- __tests__/schemas.test.ts __tests__/transactionsStorage.test.ts __tests__/repositories.local.test.ts __tests__/apiMappers.test.ts __tests__/repositories.backend.test.ts __tests__/dataSource.test.ts` → PASS, 35 tests.
- `npm test -- __tests__/useImagePicker.test.ts __tests__/useLocation.test.ts --runInBand` → PASS, 6 tests.
- `npm test -- __tests__/transactionDetailScreen.test.tsx --runInBand` → PASS, 4 tests.
- `npm run typecheck` → PASS.
- `npm test -- --runInBand` → PASS, 28 suites / 120 tests. Existing Expo vector-icon act warnings were logged in unrelated icon tests.

## Deviations / Issues

- OpenSpec config had `strict_tdd: true`, so strict TDD evidence was recorded even though the orchestration note said no strict TDD instruction was found in Engram.
- `npx expo install` used Yarn internally and created/updated `yarn.lock`.
- Running the two new hook test files without `--runInBand` hit a Jest worker OOM once; rerunning sequentially passed.
