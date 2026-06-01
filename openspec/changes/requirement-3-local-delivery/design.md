# Design: Requirement 3 Local Delivery

## Technical Approach

Implement Requirement 3 as a local-first extension of the existing transaction flow. Add optional transaction metadata to domain/input types, compose Expo device hooks in `app/(tabs)/transaction/[id].tsx`, keep `TransactionForm` render-only, persist metadata through the existing AsyncStorage/local repository path, and keep backend DTOs contract-safe by explicitly omitting unsupported `photoUri`/`location` fields.

## Architecture Decisions

| Decision | Choice | Tradeoff / Rationale |
|---|---|---|
| Metadata model | Add `TransactionLocation` and optional `photoUri`/`location` to `Transaction` and `TransactionInput`. | Optional fields preserve legacy records while enabling local persistence without migrations. |
| Device APIs | New hooks: `src/hooks/useImagePicker.ts` and `src/hooks/useLocation.ts`. | Keeps permissions/loading/errors out of screens/components and makes denied/granted states testable. |
| Form boundary | Screen composes metadata hooks; `TransactionForm` receives values/callbacks only. | Follows existing hook-driven logic pattern and prevents device API calls inside render components. |
| Backend safety | Do not add metadata to backend DTO interfaces; mapper tests prove omission. | Backend cannot persist Requirement 3 metadata yet, but evaluation backend mode remains usable. |
| Validation | Keep required fields in `transactionSchema`; metadata remains optional and structurally typed. | Avoids making legacy or metadata-free submissions invalid. |

## Data Flow

```text
Camera/Gallery/Location hooks
        │
        ▼
transaction/[id].tsx ── values/callbacks ──▶ TransactionForm
        │                                      │
        └── submit TransactionInput ◀──────────┘
        │
        ├─ local(default) ─▶ localTransactionRepository ─▶ transactionsStorage/AsyncStorage
        └─ backend(opt-in) ─▶ backend mappers omit metadata ─▶ API client
```

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json` | Modify | Add Expo-compatible `expo-image-picker` and `expo-location`. |
| `app.json` | Modify | Add camera/gallery/location permission configuration. |
| `src/domain/types.ts` | Modify | Add `TransactionLocation`; extend `Transaction`. |
| `src/repositories/types.ts` | Modify | Extend `TransactionInput` with optional metadata. |
| `src/domain/schemas.ts` | Modify | Ensure metadata stays optional/non-blocking if schema receives it. |
| `src/hooks/useImagePicker.ts` | Create | Camera/gallery permission handling, selected URI, clear, inline error state. |
| `src/hooks/useLocation.ts` | Create | Foreground permission handling, coordinates, clear, loading/error state. |
| `src/hooks/useTransactionForm.ts` | Modify | Submit metadata passed from screen without owning device state. |
| `src/components/transactions/TransactionForm.tsx` | Modify | Render receipt preview, capture/select/clear controls, coordinates, inline errors. |
| `app/(tabs)/transaction/[id].tsx` | Modify | Initialize edit metadata, compose hooks, include metadata on create/update. |
| `src/storage/transactionsStorage.ts` | Modify | No logic change expected; add tests for metadata and legacy compatibility. |
| `src/repositories/localRepositories.ts` | Modify | No logic change expected beyond typed input; test create/update persistence. |
| `src/api/dto.ts` | Keep | No metadata fields added to backend request DTOs. |
| `src/api/mappers.ts` | Modify/Test | Preserve mapper payload shape and explicitly omit local-only fields. |
| `__tests__/*` | Modify/Create | Add hook, storage, repository, mapper, form/screen tests with Expo module mocks. |
| `jest/setup.ts` | Modify | Add stable mocks only if shared by tests. |
| `README.md` | Modify | Document local-first usage, backend preservation, URI caveat, test/typecheck commands. |

## Interfaces / Contracts

```ts
export interface TransactionLocation {
  latitude: number;
  longitude: number;
}

export interface TransactionMetadataInput {
  photoUri?: string;
  location?: TransactionLocation;
}
```

`Transaction` and `TransactionInput` include `TransactionMetadataInput`. Backend `CreateTransactionRequestDto` / `UpdateTransactionRequestDto` do not.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Zod optional metadata, image/location hooks, mapper omission. | Jest + `@testing-library/react-native` hooks; mock `expo-image-picker`/`expo-location`. |
| Repository/Storage | Local create/update/save/load preserves metadata; legacy records still load. | Existing AsyncStorage and repository mocks. |
| Screen/UI | Inline permission errors, preview/clear controls, edit initialization. | Render `TransactionDetailScreen`/`TransactionForm` with mocked hooks. |
| E2E | Not available. | Document manual run path in README. |

## Migration / Rollout

No migration required. Existing stored transactions lack optional metadata and remain valid. Roll out behind the existing default local data source; backend remains opt-in.

## Open Questions

- None.
