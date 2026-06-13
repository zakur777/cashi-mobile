# Design: Connect Cashi Mobile to Production Backend

## Technical Approach

Extend the existing Expo Router architecture instead of bypassing it: screens stay render-focused, hooks coordinate state, repositories isolate persistence/transport, and `src/api/*` becomes the authenticated API service for Render. Current local/opt-in wiring (`resolveCashiDataSource`, AsyncStorage repositories, DTO mappers, mocked fetch tests) is replaced for production flows by `EXPO_PUBLIC_API_URL`, JWT session bootstrap, bearer headers, server balance, server categories, transaction CRUD, and receipt upload before save.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| API boundary | Evolve `src/api/client.ts` as `apiService` with auth, JSON, multipart, and errors. | New parallel service; direct `fetch` in hooks. | Reuses tested seams and preserves the app-scaffold boundary. |
| Session storage | `AuthContext` + `useAuth` backed by `expo-secure-store`. | AsyncStorage token; passing tokens through route params/props. | JWTs are sensitive and screens MUST NOT handle token plumbing. |
| Backend data | Hooks create token-aware repositories internally, while keeping repository injection for tests. | Global mutable singleton; direct hook-to-fetch. | Keeps tests deterministic and avoids stale tokens. |
| Upload | Repository uploads local `photoUri` via multipart first, then sends returned `imageUrl`. | Base64 in JSON; server upload after create. | Matches backend contract and avoids oversized JSON payloads. |

## Data Flow

```text
LoginScreen -> useLoginForm -> useAuth.login -> api.auth.login
                                      -> SecureStore(token) -> AuthProvider state

Tabs/Screens -> hooks -> authenticated repositories -> CashiApiClient
                                               -> Render API + bearer token

Transaction save -> repository -> upload(photoUri) -> imageUrl -> create/update DTO
```

Startup: `app/_layout.tsx` wraps `AuthProvider`; provider loads SecureStore before rendering protected routes. `app/index.tsx` redirects authenticated users to tabs; protected tabs redirect unauthenticated users to login after `isInitializing=false` to avoid flicker/loops.

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json`, lockfile | Modify | Add Expo-compatible `expo-secure-store`. |
| `.env.example`, `README.md` | Create/Modify | Document `EXPO_PUBLIC_API_URL=https://cashi-api-pphe.onrender.com`, demo credential sourcing, manual verification. |
| `src/api/config.ts` | Modify | Prefer `EXPO_PUBLIC_API_URL`; optionally keep old env as migration fallback with deprecation tests. |
| `src/api/dto.ts`, `src/api/mappers.ts` | Modify | Add auth DTOs, upload DTO, `imageUrl`, coordinates, numeric id mapping, Zod-backed response/request validation. |
| `src/api/client.ts`, `src/api/errors.ts` | Modify | Add `/auth/login`, `/auth/register`, bearer injection, multipart upload, `body.error` extraction, `Error de conexión`. |
| `src/storage/authTokenStorage.ts` | Create | SecureStore get/set/delete adapter. |
| `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts` | Create | Auth bootstrap, login/register service calls, logout, initialization state. |
| `src/repositories/backendRepositories.ts`, `src/repositories/types.ts` | Modify | Token-aware factories, upload-before-save, server balance repository/service. |
| `src/hooks/useLoginForm.ts`, `useCategories.ts`, `useTransactions.ts`, `useTransactionForm.ts` | Modify | Use auth internally, validate selected server category id, expose server balance refresh state. |
| `app/_layout.tsx`, `app/index.tsx`, tab screens | Modify | Provider wrapping, route gating, logout entry point if absent, remove local demo copy. |

## Interfaces / Contracts

- Auth: `POST /auth/login` and `POST /auth/register` return `{ token: string }`.
- Protected JSON requests include `Authorization: Bearer <token>` and `Accept: application/json`; JSON bodies include `Content-Type: application/json`.
- Upload: `POST /transactions/upload` sends `FormData` with one receipt file. In Expo/React Native append `{ uri, name, type }`; do not set multipart `Content-Type` manually so fetch supplies the boundary. Response returns `{ imageUrl: string }`.
- Transaction create/update DTOs include `amount`, `type`, `categoryId`, optional `description`, optional `imageUrl`, optional `latitude`/`longitude` or backend-confirmed coordinate field names.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Env resolution, auth token storage, DTO/Zod mappers, error extraction. | Jest mocks for env, SecureStore, malformed DTOs. |
| Integration | AuthProvider bootstrap/login/logout; API headers; repository upload-before-save; hook error/loading states. | Testing Library hooks/components with mocked client/fetch/SecureStore. |
| Screen | Login success/failed auth; protected redirect; balance focus refresh. | Existing screen tests with provider test wrapper. |
| Manual | Render login, protected category/transaction/balance, upload, logout, network failure. | README steps using externally supplied demo credentials. |

## Migration / Rollout

No data migration required; local AsyncStorage data remains orphaned when production mode becomes default. Slice for review budget: (1) env/API/auth/storage tests, (2) repositories/mappers/upload/balance, (3) hook/screen/docs manual verification. Ask before chained PRs because risk exceeds 400 changed lines.

## Open Questions

- [ ] Confirm exact backend upload response and coordinate field names.
- [ ] Decide whether category create/update/delete UI remains available or category management becomes server list-only for this release.
- [ ] Add a minimal visible logout/profile entry if none exists.
