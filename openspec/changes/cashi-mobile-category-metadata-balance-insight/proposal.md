# Proposal: Category Metadata and Balance Insight

## Intent

Adopt the OpenDesign product decisions that add category type/color, CLP money formatting, and a balance insight for the highest-spend category before applying the full UI polish.

## Scope

### In Scope

- Extend `Category` with `type: income | expense` and a fixed Cashi palette `color`.
- Update category validation, form hook, category CRUD hook, and category UI props.
- Update demo seed data to CLP-scale amounts and category metadata.
- Add CLP formatting helper for display.
- Add balance `primaryExpenseCategory` based on the expense category with highest total spending.
- Tests for schema, category form, seed data, balance computation, and CLP formatting.

### Out of Scope

- Full OpenDesign visual implementation.
- Backend/API sync.
- Charts, QR, cards, contacts, profile, savings goals, or payment methods.

## Success Criteria

- Existing category data can still render safely with defaults during migration.
- New categories require name/type/color.
- Demo data uses CLP amounts: 1,250,000 income and 65,500 expenses.
- Balance exposes Comida as principal category for current demo seed.
- `npm test`, `npm run typecheck`, and Android bundle/export pass.
