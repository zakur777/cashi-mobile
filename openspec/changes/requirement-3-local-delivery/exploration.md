## Exploration: Requirement 3 local-first delivery

### Current State
Cashi currently supports transaction/category CRUD, balance summaries, Expo Router navigation, AsyncStorage-backed local repositories, and opt-in backend repositories selected by `resolveCashiDataSource()`. The default data source is already `local`; backend remains available when `EXPO_PUBLIC_CASHI_DATA_SOURCE=backend` or Expo `extra.cashiDataSource` is set.

Requirement 3 asks for local-first device API work: extend `Transaction` with optional `photoUri` and `location`, add camera/gallery and foreground GPS access through `useImagePicker` and `useLocation`, show visible inline permission errors without `Alert`, preview photo/location before save, persist the optional fields in AsyncStorage, and show the saved photo/coordinates on the transaction detail/edit screen. The app does not yet have `expo-image-picker`, `expo-location`, device permission hooks, transaction media/location fields, or UI for receipt/location capture.

Backend integration must be preserved for final evaluation. Current backend DTOs and mappers do not support photo/location fields, so local delivery should avoid removing backend code and should either keep backend behavior unchanged or explicitly omit local-only fields when backend mode is active until backend contracts are expanded.

### Affected Areas
- `package.json` / `app.json` — need Expo-compatible device API dependencies and possibly platform permission strings/config plugins for camera, gallery, and foreground location.
- `src/domain/types.ts` — `Transaction` needs optional `photoUri?: string` and `location?: { latitude: number; longitude: number }` without changing existing fields.
- `src/repositories/types.ts` — `TransactionInput` should carry the same optional local fields so hooks/repositories can persist them.
- `src/storage/transactionsStorage.ts` — AsyncStorage already serializes full transaction objects, but tests should prove optional fields survive load/save and legacy transactions still parse.
- `src/repositories/localRepositories.ts` — local create/update spread input already persists extra typed fields once the input type is extended.
- `src/api/dto.ts`, `src/api/mappers.ts`, `src/repositories/backendRepositories.ts` — backend path currently maps only amount/type/description/date/categoryId; preserve it and decide whether local-only fields are intentionally omitted in backend mode.
- `src/hooks/useTransactionForm.ts` — form submit values need to include optional `photoUri` and `location`, while Zod validation stays focused on required form fields.
- `src/hooks/useImagePicker.ts` — new hook required to own camera/gallery permissions and `expo-image-picker` calls.
- `src/hooks/useLocation.ts` — new hook required to own foreground location permission, loading, errors, and coordinate state.
- `src/components/transactions/TransactionForm.tsx` — needs buttons for camera/gallery/location, inline errors, photo preview, coordinate display, and remove/clear actions while staying render-only.
- `app/(tabs)/transaction/[id].tsx` — needs to compose form, image, and location hooks; initialize edit state from existing transaction; pass optional data to create/update.
- `__tests__/` — add/adjust tests for schemas/types, hooks, local repository/storage persistence, screen rendering, and denied-permission states; mock Expo device modules.
- `README.md` — must document Requirement 3 fields, install/run steps, and AI usage per the delivery document.

### Approaches
1. **Local-first extension with backend preservation** — Extend the domain/input types with optional fields, implement device hooks and form UI for local storage, and keep backend mappers omitting unsupported fields.
   - Pros: Meets delivery requirement, preserves existing backend integration, minimizes backend risk, leverages default `local` data-source behavior.
   - Cons: Backend mode will not persist receipt/location until backend DTO/contracts are expanded; must document that local delivery uses local source.
   - Effort: Medium

2. **Full local and backend media/location contract now** — Add optional fields across domain and backend DTO/mappers, including image/location payload support.
   - Pros: Single model across both sources if backend supports it.
   - Cons: Current API client has no upload endpoint or receipt/location DTOs; likely breaks final backend evaluation if assumed contracts are wrong; larger change.
   - Effort: High

### Recommendation
Use **Local-first extension with backend preservation**. Requirement 3 explicitly evaluates AsyncStorage persistence and device APIs, while the user explicitly said not to remove backend connections. Keep `local` as the default delivery mode, add receipt/location only to the local domain/input flow, and preserve current backend repository/client behavior by intentionally ignoring unsupported optional fields in backend mappers. If backend evaluation later requires these fields, create a separate backend-media delta after confirming API contracts.

### Risks
- `expo-image-picker` and `expo-location` are not installed; they must be added with `npx expo install` to match the Expo SDK.
- Local image URIs from Expo Go cache can be invalidated between development sessions; document this known dev behavior while still persisting the URI string.
- Existing edit screen is form-only; “detail” display requirements must be satisfied inside the edit/detail route or by adding clear read-only sections without confusing the existing UX.
- Backend mode currently uses numeric IDs and DTOs without media/location. Sending local-only fields blindly would be wrong; backend mappers should remain contract-safe.
- Permission-denied flows require inline visible errors and test mocks; using `Alert` or direct module calls inside components would lose rubric points.

### Ready for Proposal
Yes — propose a local-first Requirement 3 change scoped to device hooks, optional transaction metadata, form/detail UI, AsyncStorage persistence tests, README updates, and explicit backend-preservation/non-removal constraints.
