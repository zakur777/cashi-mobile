# Design: Cashi Mobile Demo Seed Data

## Technical Approach

Add a small storage-layer seed module that owns deterministic demo fixtures and an idempotent `seedDemoDataIfEmpty()` orchestration function. The function reads categories and transactions, writes fixtures only when both stores are empty, and returns a boolean indicating whether data was seeded.

Hooks call `seedDemoDataIfEmpty()` before their normal initial/refresh reads. This keeps UI components render-only and avoids AsyncStorage access outside storage.

## Seed Policy

- Seed when: `categories.length === 0 && transactions.length === 0`.
- No-op when either dataset contains data.
- Use stable ids: no `Date.now()`, no random UUIDs.
- Include enough data to exercise categories, transaction list, category names, income/expense styling, and balance summary.

## Demo Dataset Shape

Recommended categories:

- Salary / Ingresos
- Food / Comida
- Transport / Transporte
- Entertainment / Ocio

Recommended transactions:

- At least one income.
- Multiple expenses across categories.
- Recent ISO-like date strings.
- Amounts that make balance visibly non-zero.

## Testing Strategy

RED:

- Add tests for seeding when empty, no-op with existing data, and idempotency.
  GREEN:
- Implement seed module and hook integration.
  REFACTOR:
- Keep fixtures typed and centralized; avoid literals in UI.

## Tradeoffs

| Option                  | Decision | Reason                                                    |
| ----------------------- | -------- | --------------------------------------------------------- |
| Seed in components      | Rejected | Violates render-only UI boundary.                         |
| Seed directly in hooks  | Partial  | Hooks may invoke the service but should not own fixtures. |
| Seed service in storage | Accepted | Keeps persistence orchestration testable and centralized. |

## Review Risks

- Hook tests may need to account for seed initialization.
- Existing storage tests should remain unchanged.
- Since this is demo behavior, avoid broad UI redesign in the same change.
