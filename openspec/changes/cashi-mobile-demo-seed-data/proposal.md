# Proposal: Cashi Mobile Demo Seed Data

## Intent

Add deterministic demo data so Cashi Mobile opens with useful sample categories, transactions, and balance information during demos, while preserving user-entered data.

## Scope

### In Scope

- Demo categories and transactions with stable ids.
- Empty-only seed behavior: seed data is written only when both category and transaction stores are empty.
- Idempotent behavior across app restarts.
- Tests proving seed/no-overwrite behavior.

### Out of Scope

- Backend/API integration.
- Reset button or manual seed UI.
- Random/generated fixture ids.
- Overwriting existing user data.

## Approach

Create a centralized demo seed service in the storage boundary. Hooks can call it before refreshing data so screens remain render-only and components stay untouched. The seed service reads existing categories and transactions, writes fixtures only when both are empty, and returns whether seeding occurred.

## Affected Areas

| Area           | Impact       | Description                                                    |
| -------------- | ------------ | -------------------------------------------------------------- |
| `src/storage/` | Modified/New | Add demo seed fixtures/orchestration.                          |
| `src/hooks/`   | Modified     | Invoke seeding before initial refresh.                         |
| `__tests__/`   | Modified/New | Add seed service tests and adjust hook expectations if needed. |

## Risks

| Risk                   | Mitigation                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| Duplicate seed records | Seed only when both stores are empty, use deterministic fixtures.       |
| Overwrite user data    | No-op when either store already has data.                               |
| Hook race              | Centralized idempotent service; save full fixtures only from one guard. |

## Success Criteria

- [ ] Empty app shows demo categories, transactions, and balance.
- [ ] Existing user data is never overwritten.
- [ ] Seed operation is idempotent.
- [ ] Components remain render-only.
- [ ] `npm test` and `npm run typecheck` pass.
