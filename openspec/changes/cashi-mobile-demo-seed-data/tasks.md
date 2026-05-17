# Tasks: Cashi Mobile Demo Seed Data

## Review Workload Forecast

| Field                   | Value            |
| ----------------------- | ---------------- |
| Estimated changed lines | 120–220          |
| 400-line budget risk    | Low              |
| Chained PRs recommended | No               |
| Delivery strategy       | Single work unit |

## Implementation Tasks

- [x] 1. RED: Add tests for `seedDemoDataIfEmpty()` when both stores are empty.
- [x] 2. RED: Add tests proving seeding is no-op when categories or transactions already exist.
- [x] 3. RED: Add idempotency test for repeated seed initialization.
- [x] 4. GREEN: Add centralized demo seed fixtures/service in `src/storage`.
- [x] 5. GREEN: Invoke seed initialization before hook refreshes without moving logic into components.
- [x] 6. REFACTOR: Keep fixtures typed, deterministic, and category references valid.
- [x] 7. VERIFY: Run `npm test`, `npm run typecheck`, and, if relevant, Android bundling/Expo launch check.

## Acceptance Evidence

- Tests prove empty-only behavior.
- Tests prove user data is preserved.
- Tests prove no duplicate seeding.
- App populated screens are visible after clearing app storage/fresh install.
