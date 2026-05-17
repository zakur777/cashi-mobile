# Implementation Tasks — cashi-mobile-android-visual-polish

## Review Workload Forecast

| Field                   | Value           |
| ----------------------- | --------------- |
| Estimated changed lines | 180–280         |
| 400-line budget risk    | Low             |
| Chained PRs recommended | No              |
| Suggested split         | single PR       |
| Delivery strategy       | single-pr       |
| Chain strategy          | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

## Constraints and stop condition

- Keep total diff at **<=300 changed lines** (session preflight guard).
- Do not edit: `src/components/ui/AppBackground.tsx`, `Cashi-Mobile-UX-Polish/**`, native folders, dependency manifests.
- No new dependencies, no dev-client/native-only work.
- **Stop condition:** if forecast or running diff exceeds 300 lines, stop implementation, document overage cause, and request delivery decision before continuing.

## Ordered implementation tasks (STRICT TDD)

### 1) Baseline + RED test additions for polish contracts

- Files:
  - `__tests__/TransactionList.test.tsx`
  - `__tests__/CategoryList.test.tsx`
  - `__tests__/CashiTabBar.test.tsx` (create if missing)
- Add failing/contract tests for:
  - Accessible add actions (`Agregar movimiento`, `Agregar categoría`) and callback invocation.
  - Tab visibility guard (only Movimientos/Categorías/Balance; detail routes hidden).
  - Optional narrow token contract assertion if needed for touch target constants.
- Evidence:
  - Run `npm test -- --runInBand` and capture RED output (or document any pre-existing pass-only contract test).

### 2) GREEN: minimal shared token aliases for rhythm/touch sizes

- File: `src/design/tokens.ts`
- Add minimal component/layout aliases only (no token refactor), e.g. screen padding, icon button size (48), list row min height, input min height.
- Keep primitive/semantic values unchanged.
- Evidence:
  - Tests from Task 1 move toward GREEN where token contracts apply.

### 3) GREEN: list/card rhythm + action consistency (Movimientos/Categorías)

- Files:
  - `src/components/transactions/TransactionList.tsx`
  - `src/components/categories/CategoryList.tsx`
- Apply small style edits:
  - Normalize row min-height/padding/gaps and 46-ish icon container rhythm.
  - Normalize header add button to 48x48 in both lists.
  - Add accessibility labels for add/edit/delete actions where missing.
- Evidence:
  - `npm test -- --runInBand` (target tests green).

### 4) GREEN: balance card and control micro-alignment

- File: `src/components/balance/BalanceSummary.tsx`
- Tune spacing/typography/card rhythm and refresh control touch target consistency (48) without changing behavior/data flow.
- Evidence:
  - Relevant existing tests pass (`npm test -- --runInBand`).

### 5) GREEN: form consistency polish

- Files:
  - `src/components/transactions/TransactionForm.tsx`
  - `src/components/categories/CategoryForm.tsx`
- Harmonize segmented/chip/input/helper/error/CTA spacing and control sizing.
- Align transaction segmented control container treatment with category form where applicable.
- Keep existing validation/business logic unchanged.
- Evidence:
  - `npm test -- --runInBand` remains green.

### 6) TRIANGULATE: tab micro-polish while preserving route-visibility behavior

- File: `src/components/navigation/CashiTabBar.tsx`
- Small alignment/padding/contrast tuning only; preserve `mainRoutes` behavior and hidden detail routes.
- Evidence:
  - Tab visibility tests stay green.

### 7) REFACTOR/SIZE GUARD: tighten and de-duplicate style constants

- Discovery/targets:
  - Re-check edited files for duplicated numeric literals that should use token aliases.
- Keep edits minimal and stop if this pushes over 300 lines.
- Evidence:
  - `git diff --shortstat` or equivalent changed-line count documented.

### 8) Full validation + OpenDesign comparison evidence

- Commands:
  - `npm test -- --runInBand`
  - `npm run typecheck`
  - `npx expo export --platform android`
- OpenDesign validation (read-only references):
  - `Cashi-Mobile-UX-Polish/css/cashi.css`
  - `Cashi-Mobile-UX-Polish/screens/android-transactions.html`
  - `Cashi-Mobile-UX-Polish/screens/android-categories.html`
  - `Cashi-Mobile-UX-Polish/screens/android-balance.html`
  - `Cashi-Mobile-UX-Polish/screens/android-transaction-form.html`
  - `Cashi-Mobile-UX-Polish/screens/android-category-form.html`
- Record Android-first parity notes for: rhythm/spacing, card sizing/alignment, typography hierarchy, contrast/readability, tab active-state alignment, form consistency.
