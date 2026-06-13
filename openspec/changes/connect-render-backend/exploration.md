## Exploration: Connect Expo app to Render production backend

### Current State
The app is an Expo Router + TypeScript app with screens under `app/`, business logic in hooks, persistence behind repositories/storage, and an existing opt-in backend boundary. `requerimientos/final.md` changes the target from local/opt-in data to authenticated production API usage: JWT auth, SecureStore persistence, `Authorization: Bearer <token>`, server categories, server transactions/balance, and receipt upload before create/update. Current code does not yet satisfy that final contract: login is hardcoded demo-only, there is no `AuthContext`/`useAuth`, no `expo-secure-store` dependency, API calls do not send auth headers, the client lacks `/auth/*` and `/transactions/upload`, backend mappers currently omit photo/location metadata, balance is computed client-side from listed transactions, and env naming uses `EXPO_PUBLIC_CASHI_API_BASE_URL` instead of the required `EXPO_PUBLIC_API_URL`.

### Affected Areas
- `requerimientos/final.md` — primary product/technical contract for JWT auth, endpoint list, SecureStore, and unchanged screen/component boundary.
- `openspec/config.yaml` — strict TDD, OpenSpec source of truth, 400-line review budget, `npm test` + `npm run typecheck` verification commands.
- `openspec/specs/transaction-management/spec.md` — currently specifies local persistence; must evolve for server CRUD, server ids, upload/image URL, and coordinates.
- `openspec/specs/category-management/spec.md` — currently specifies local category CRUD; final backend likely requires list-only server categories for transaction selection unless CRUD remains intentionally supported.
- `openspec/specs/balance-summary/spec.md` — currently requires hook-owned client computation; final requires `GET /transactions/balance` from server.
- `src/api/client.ts` — centralized fetch client exists, but needs auth/register/login, upload, auth header injection, token-aware construction, and likely no-auth paths.
- `src/api/config.ts` — resolves `EXPO_PUBLIC_CASHI_API_BASE_URL`; final requires `EXPO_PUBLIC_API_URL` and `.env.example` may expose the public Render URL.
- `src/api/dto.ts` / `src/api/mappers.ts` — DTOs exist for categories/transactions/balance, but transaction payloads lack `imageUrl` and location fields; mappers currently strip `photoUri` and `location`.
- `src/repositories/backendRepositories.ts` — backend adapters exist for categories/transactions, but are tokenless and have no upload-first flow.
- `src/hooks/useLoginForm.ts` / `app/index.tsx` — login is local hardcoded demo; must call backend auth and route based on persisted token.
- `app/_layout.tsx` — likely home for `AuthProvider` bootstrap gate so screens do not receive/pass token props.
- `src/hooks/useCategories.ts` / `src/hooks/useTransactions.ts` — already isolate data access and errors; final should make them consume token internally through `useAuth()` or token-aware repository factory without UI imports.
- `app/(tabs)/balance.tsx` / `src/hooks/useTransactions.ts` — balance currently derives from transactions in hook; final should avoid duplicating server calculation.
- `app/(tabs)/transaction/[id].tsx` / `src/hooks/useTransactionForm.ts` / `src/components/transactions/TransactionForm.tsx` — photo/location collection exists, but UI copy says photo/location are local-only; final requires upload + coordinate body submission.
- `__tests__/apiClient.test.ts`, `__tests__/repositories.backend.test.ts`, `__tests__/useLoginForm.test.ts`, `__tests__/useTransactions.test.ts`, `__tests__/useCategories.test.ts` — existing mocked boundary tests provide the best TDD extension points.

### Approaches
1. **Extend the existing repository/API boundary to authenticated production mode** — Keep screens/components mostly unchanged; add auth context/storage, token-aware API client, upload handling inside API/repository/hook layers, and update env naming.
   - Pros: Preserves current architecture and rubric boundary; reuses existing tests, mappers, repositories, and hook error surfaces; minimizes UI churn.
   - Cons: Requires careful refactor of API client construction and hook dependencies to avoid token prop-passing; balance may need a new hook or repository method.
   - Effort: Medium/High

2. **Introduce a separate `apiService` facade above repositories** — Add a final-evaluation service layer that owns base URL, headers, auth endpoints, upload, and error normalization, then gradually wire hooks to it.
   - Pros: Matches requirement wording (`apiService`) and can simplify the defense narrative.
   - Cons: Risks duplicating existing `src/api/client.ts` + repository abstractions; more changed lines; higher chance of violating established architecture if screens reach into the service.
   - Effort: High

3. **Directly wire hooks to fetch and SecureStore** — Replace repositories with direct HTTP calls from hooks.
   - Pros: Fastest implementation path.
   - Cons: Weakens existing boundaries, conflicts with rubric intent that components/screens avoid network/token details, and discards tested repository/API seams.
   - Effort: Medium but not recommended

### Recommendation
Use Approach 1. Treat the current `src/api/*` client as the required centralized API service, extend it rather than duplicating it, and add a small auth/storage boundary (`AuthContext` + `useAuth` + SecureStore-backed token store). Prefer `EXPO_PUBLIC_API_URL` while optionally supporting the old `EXPO_PUBLIC_CASHI_API_BASE_URL` during migration. Add token-aware request headers, `/auth/login`, `/auth/register`, `/transactions/upload`, and transaction mapper support for `imageUrl` plus optional coordinates. Keep screens render-focused; hooks should obtain auth internally and expose the same public shape where possible.

### Risks
- Backend DTO field names for uploaded image and coordinates must be confirmed against the deployed API; current local model uses `photoUri` while final requires server `imageUrl`.
- `expo-secure-store` is not installed, so implementation changes package/lock and requires Expo-compatible install/versioning.
- Current specs still describe local persistence/client balance; proposal/spec phases must explicitly modify these contracts before apply.
- Auth bootstrap and route protection can create flicker or navigation loops if token loading is not modeled with an initialization state.
- Existing tests assert tokenless requests and local/default behavior; they must be updated intentionally, not blindly patched.

### Ready for Proposal
Yes — the orchestrator should proceed to proposal for `connect-render-backend`, framing this as production backend integration on top of the existing tested API/repository boundary, with strict TDD and likely review slicing because auth, API transport, repositories/hooks, UI copy, docs/env, and tests may exceed the 400-line budget.
