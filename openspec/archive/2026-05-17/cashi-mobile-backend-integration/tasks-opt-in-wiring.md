# Tasks: Opt-in Backend Wiring Slice (`cashi-mobile-backend-integration`)

## Review Workload Forecast

| Field                   | Value                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Estimated changed lines | 430–620                                                                                        |
| 400-line budget risk    | High                                                                                           |
| Chained PRs recommended | Yes                                                                                            |
| Suggested split         | PR 1 (data-source + repositories + unit tests) → PR 2 (hook wiring + hook tests + verify/docs) |
| Delivery strategy       | ask-on-risk                                                                                    |
| Chain strategy          | pending                                                                                        |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

## Preconditions

- Strict TDD is active (`openspec/config.yaml`).
- Test runner is `npm test`.
- Do not start backend/Postgres/Docker/watchers.
- Keep local-first as default; backend is opt-in only.
- No native dependencies or package changes.

## Implementation Tasks (Strict TDD)

- [ ] 1. **RED — Data-source resolver tests** (`__tests__/dataSource.test.ts`)
  - Add tests for `resolveCashiDataSource` precedence.
  - Add tests for blank input resolving to `local`.
  - Add tests for invalid values throwing typed `ApiClientError`.
  - Add tests confirming backend base URL is **not** required when resolved source is `local`.

- [ ] 2. **RED — Local repository adapter tests** (`__tests__/repositories.local.test.ts`)
  - Test category local adapter: seed + storage, legacy normalization, create/update/delete persistence.
  - Test transaction local adapter: seed + storage and create/update/delete persistence.

- [ ] 3. **RED — Backend repository adapter tests** (`__tests__/repositories.backend.test.ts`)
  - Use mocked `CashiApiClient`; no live network.
  - Cover categories/transactions get/create/update/delete, mappers, id conversion, and `ApiClientError` passthrough.

- [ ] 4. **RED — Hook selection + opt-in behavior tests**
  - Update `__tests__/useCategories.test.ts` for injected repository, local default, backend missing base URL error, mutation messages.
  - Update `__tests__/useTransactions.test.ts` for repository injection, backend failure messages, and derived balance/category behavior.

- [ ] 5. **GREEN — Repository contracts + data-source resolver**
  - Add `src/repositories/types.ts`.
  - Add `src/repositories/dataSource.ts`.
  - Add `src/repositories/index.ts` exports.

- [ ] 6. **GREEN — Local and backend repository implementations**
  - Add `src/repositories/localRepositories.ts`.
  - Add `src/repositories/backendRepositories.ts`.
  - Ensure backend client creation is lazy.

- [ ] 7. **GREEN — Hook wiring (opt-in, non-breaking API)**
  - Refactor `useCategories` and `useTransactions` to accept optional repository/dataSource config.
  - Preserve existing return shapes and screen call compatibility.

- [ ] 8. **TRIANGULATE — Edge-case expansion**
  - Add env/casing/blank base URL/local legacy normalization edge cases.

- [ ] 9. **REFACTOR — Boundary and dependency guardrails**
  - Keep UI screens untouched.
  - Keep storage modules unchanged unless minimal compatibility requires otherwise.
  - Confirm no package/lock/native dependency edits.

- [ ] 10. **VERIFY — Local-only validation**
  - Run `npm test -- --runInBand`.
  - Run `npm run typecheck`.
  - Do not start backend/Postgres/Docker/watchers.

## Stop Conditions

- Request to enable backend by default.
- Need to start backend/Postgres/Docker/watchers to proceed.
- Any proposal to add native dependencies.
- Hook/screen changes would replace local-first default UX.
- Planned/observed diff remains above 400 lines without an explicit chain/size decision.
- Backend category contract no longer includes `type` and `color`.
