# SDD Explore — cashi-mobile-demo-seed-data

## status

explored

## executive_summary

Seeding demo data only when AsyncStorage is empty is feasible and aligns with current architecture (hook-first, render-only components, storage boundary). Current screens already support empty states; adding safe one-time seed data would improve demo readability without overwriting user-entered data. This should proceed to proposal/spec/design before implementation.

## scope_checked

- Storage adapters: `src/storage/categoriesStorage.ts`, `src/storage/transactionsStorage.ts`
- Hooks: `src/hooks/useCategories.ts`, `src/hooks/useTransactions.ts`
- Screens/components impacted by visible seeded data: transactions, categories, balance
- Tests: categories/transactions storage and hooks

## current_state_findings

- Categories and transactions are persisted as full arrays in AsyncStorage (`getAll`/`saveAll`).
- `getAll` returns `[]` for missing key, parse errors, or read failures.
- `useCategories` and `useTransactions` call `refresh()` on mount and keep screens render-only.
- No existing seeding step exists.
- Adding seed data will populate transactions/categories/balance after first load.

## constraints_to_preserve

- SDD-only workflow.
- Components remain render-only.
- AsyncStorage access remains in storage layer.
- TypeScript domain contracts remain stable.
- Strict TDD active (`npm test`) and typecheck available (`npm run typecheck`).

## recommended_seed_strategy

1. Define deterministic demo fixtures with stable ids.
2. Seed only when both datasets are empty.
3. Never overwrite existing user data.
4. Keep seeding idempotent.
5. Ensure seeded transaction `categoryId` values match seeded category ids.
6. Keep seeding in storage/domain orchestration, not UI components.

## risks

- Hook-level seeding can race if multiple hooks seed independently.
- Non-deterministic IDs would make tests unstable.
- Partial-empty scenarios need explicit no-overwrite policy.

## next_recommended

Proceed with proposal, spec, design, tasks, apply, verify.

## skill_resolution

injected
