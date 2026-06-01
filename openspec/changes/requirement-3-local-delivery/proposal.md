# Proposal: Requirement 3 Local Delivery

## Intent

Deliver Requirement 3 as a local-first mobile feature: users can attach a receipt photo and current coordinates to a transaction, persist them in AsyncStorage, and review/edit them later. Backend integration must remain available and contract-safe for final evaluation.

## Scope

### In Scope
- Add optional `photoUri` and `location` metadata to local transaction domain/input flow.
- Add Expo camera/gallery and foreground-location hooks with inline permission errors.
- Update transaction form/detail route to preview, clear, save, and display photo/coordinates.
- Persist optional metadata through AsyncStorage and prove legacy transaction compatibility.
- Preserve backend repositories/mappers by omitting unsupported local-only fields in backend mode.
- Update README with Requirement 3 usage, local mode, tests, and known URI behavior.

### Out of Scope
- Backend upload/storage contracts for photos or coordinates.
- Removing or replacing existing backend data-source integration.
- Introducing theming, NativeWind, UI libraries, or screen logic inside components.

## Capabilities

### New Capabilities
- `transaction-device-metadata`: Camera/gallery receipt capture and foreground GPS metadata for transactions.

### Modified Capabilities
- `transaction-management`: Transactions may include optional `photoUri` and `location`; local CRUD persists them and edit/detail displays them.
- `mobile-ux-delivery`: Permission-denied states must be visible inline; README must document install/run/test evidence.

## Approach

Follow the exploration recommendation: extend local types and hooks first, compose device behavior in `app/(tabs)/transaction/[id].tsx`, keep `TransactionForm` render-only, validate required fields with Zod, and leave backend DTO/mappers contract-safe by intentionally dropping unsupported optional metadata.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json`, `app.json` | Modified | Add Expo device APIs and permission config. |
| `src/domain/types.ts`, `src/repositories/types.ts` | Modified | Add optional metadata types. |
| `src/hooks/useImagePicker.ts`, `src/hooks/useLocation.ts` | New | Own permissions, loading, errors, and selected values. |
| `src/components/transactions/TransactionForm.tsx` | Modified | Render controls, previews, inline errors, clear actions. |
| `app/(tabs)/transaction/[id].tsx` | Modified | Compose hooks and submit metadata. |
| `src/storage/transactionsStorage.ts`, `src/repositories/localRepositories.ts` | Modified | Preserve local persistence behavior with tests. |
| `src/api/*`, `src/repositories/backendRepositories.ts` | Modified | Protect/verify backend omission behavior. |
| `__tests__/`, `README.md` | Modified | Add mocks, regression tests, and delivery documentation. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend contract breakage | Med | Keep DTO/mappers unchanged for unsupported fields and test omission. |
| Permission flow regressions | Med | Centralize in hooks and mock denied/granted paths. |
| Dev photo URI invalidation | Low | Persist URI string and document Expo cache limitation. |

## Rollback Plan

Revert the Requirement 3 change files and dependency/config additions. Because backend contracts remain unchanged and metadata is optional, existing transactions continue to parse if app code is rolled back.

## Dependencies

- Expo-compatible `expo-image-picker` and `expo-location` installed via `npx expo install`.

## Success Criteria

- [ ] Local transactions can save, load, edit, and display `photoUri` and coordinates.
- [ ] Denied camera/gallery/location permissions show inline errors without `Alert`.
- [ ] Backend mode remains available and does not send unsupported metadata fields.
- [ ] `npm test` and `npm run typecheck` pass with Requirement 3 coverage.
