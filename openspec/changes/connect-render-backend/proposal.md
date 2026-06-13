# Proposal: Connect Cashi Mobile to Production Backend

## Intent

Replace local/opt-in persistence with the production Render API while preserving the existing screen/component contract. The existing login screen MUST call `/auth/login`; demo credentials are only for manual verification and MUST NOT be hardcoded.

## Scope

### In Scope
- Configure `EXPO_PUBLIC_API_URL` for `https://cashi-api-pphe.onrender.com`; document it in `.env.example`/README.
- Add JWT auth session handling with `AuthContext`, `useAuth`, SecureStore persistence, startup bootstrap, and logout.
- Centralize `/auth/*`, `/categories`, `/transactions`, `/transactions/balance`, and `/transactions/upload` calls in `src/api/*`.
- Update repositories/hooks so categories, transactions, balance, image upload, and coordinates use authenticated server data without passing tokens through screens.
- Update tests for config, auth, API headers/errors, repositories, hooks, and README evidence.

### Out of Scope
- Backend changes, new secrets, hardcoded demo credentials, UI redesign, or direct `fetch`/SecureStore/API imports from screens/components.
- Replacing the existing architecture with direct hook-to-fetch wiring.

## Capabilities

### New Capabilities
- `auth-session`: login/register API calls, SecureStore token persistence, auth bootstrap, authorization headers, and logout.

### Modified Capabilities
- `app-scaffold`: enforce AuthProvider/api-service boundaries.
- `transaction-management`: server CRUD, numeric ids, upload-before-save `imageUrl`, and coordinates.
- `category-management`: authenticated server category listing for transaction selection.
- `balance-summary`: server-owned balance via `GET /transactions/balance`.

## Proposal Question Round

Assumptions needing user review: registration is required even if no current route exists; categories become server list-first rather than local CRUD; logout may need a minimal profile/logout surface if absent.

## Approach

Extend the existing `src/api/*` + repository boundary as the required `apiService`. Add a small auth/storage layer under `src/contexts`/`src/hooks`/`src/storage`, inject bearer tokens in the API client, and keep screens render-focused. First slice: env/config + login token persistence + authenticated health/login smoke path, then server data flows.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/_layout.tsx`, `app/index.tsx` | Modified | Auth bootstrap, route gating, real login submission. |
| `src/api/*` | Modified | Base URL, auth endpoints, bearer headers, upload, errors. |
| `src/hooks/*`, `src/repositories/*` | Modified | Token-aware server data behind stable hook APIs. |
| `src/domain/*`, `src/api/mappers.ts` | Modified | Server ids, `imageUrl`, coordinates DTO mapping. |
| `package.json`, `.env.example`, `README.md` | Modified/New | SecureStore dependency and run/backend docs. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend DTO names differ for upload/location | Medium | Verify against Render responses and mapper tests. |
| Auth bootstrap causes flicker/navigation loops | Medium | Model `isInitializing` before redirects. |
| Work exceeds 400-line review budget | High | Split auth/config, server data, docs/tests into review slices. |

## Rollback Plan

Revert the change branch/slices; restore local repository wiring and old env config. Remove SecureStore usage and keep any README/env changes in the same rollback commit.

## Dependencies

- Render API availability; `expo-secure-store` installed with Expo-compatible version.

## Acceptance Criteria / Success Criteria

- [ ] Login persists JWT securely and all protected requests send `Authorization: Bearer <token>`.
- [ ] Categories, transactions, upload, and balance use production endpoints with Spanish server/network errors surfaced.
- [ ] Screens/components keep current boundaries and do not import network/token services.
- [ ] `npm test` and `npm run typecheck` pass; manual verification may use demo credentials only outside production logic.
