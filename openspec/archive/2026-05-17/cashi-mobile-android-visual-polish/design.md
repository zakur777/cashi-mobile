# Technical Design: Android Visual Polish

## Change

`cashi-mobile-android-visual-polish`

## Skill resolution

`fallback-path` — the exact user-requested skill files were loaded directly before design work:

- `mobile-app-design/SKILL.md`
- `react-native/SKILL.md`
- `typescript/SKILL.md`
- `design-system/SKILL.md`

Engram persistence was requested, but no Engram tools are available in this subagent session. This design is persisted to OpenSpec only.

## Summary

Implement a small Android-first visual polish pass in the existing Expo React Native app. The change stays at style/token/component level and preserves the current architecture, Expo Go compatibility, accepted `AppBackground`, and the current three-tab navigation model.

The implementation should tune shared tokens and existing component styles for:

- list/card rhythm in Movimientos and Categorías
- typography hierarchy and metadata readability
- consistent 48dp Android touch targets for primary icon/actions
- Balance card and mini-stat alignment
- Category/Transaction form spacing, segmented controls, chips, helper/error text, and CTA rhythm
- custom tab bar active pill icon/label alignment

The OpenDesign files under `Cashi-Mobile-UX-Polish/` are read-only validation references only. Do not modify, copy, or commit them.

## Current implementation observations

### Already aligned

- `app/(tabs)/_layout.tsx` declares exactly three visible tabs: `index`, `categories`, `balance`.
- Detail routes `category/[id]` and `transaction/[id]` are configured with `href: null` and are excluded by `CashiTabBar`'s `mainRoutes` filter.
- `CashiTabBar` returns `null` when the active route is not one of the three main tabs, so hidden detail routes do not show an extra tab bar.
- `src/components/ui/AppBackground.tsx` already provides the accepted background and should be left untouched.
- Core OpenDesign tokens are already represented in `src/design/tokens.ts`.

### Gaps to polish

- Category add and Balance refresh controls use 44x44 while Transaction add uses 48x48; normalize to Android 48dp touch targets.
- Card rhythm is close but not fully consistent: transaction rows use `minHeight: 72`, category rows have no explicit min height, and list gaps rely on per-card `marginBottom` instead of one shared list rhythm.
- Metadata and labels are readable but can be tightened to match the OpenDesign 12px label/meta rhythm and clearer line heights.
- Transaction segmented control lacks the border used by Category segmented control; active segment color should move closer to lime/OpenDesign active affordance where contrast allows.
- Category palette row lacks the bordered soft container visible in OpenDesign.
- Form hero treatments differ: Transaction uses title/help card; Category uses preview icon/title. Keep these structures, but align field/segment/button rhythm.
- Tab bar is structurally correct; only tune the active pill/content alignment if needed.

## Design goals and non-goals

### Goals

1. Improve practical parity with OpenDesign Android references for rhythm, hierarchy, contrast, and action affordances.
2. Keep changes small, token-driven, and reviewable under 300 changed lines.
3. Preserve testability and existing user-facing behavior.
4. Collect strict TDD RED/GREEN evidence during apply, plus Android/OpenDesign validation evidence during verify.

### Non-goals

- No background redesign or `AppBackground` behavior changes.
- No dependency additions or native/dev-client requirements.
- No broad component rewrites, data model changes, new screens, or new tabs.
- No pixel-perfect proprietary-font or CSS backdrop-filter parity.
- No changes under `Cashi-Mobile-UX-Polish/`.

## Proposed implementation

### 1. Extend design tokens minimally

File: `src/design/tokens.ts`

Add only small component/rhythm aliases derived from existing primitives. Keep the current primitive/semantic values unchanged.

Proposed additions:

- `layout.screenPadding = spacing.md`
- `layout.tabBarHeight = 72`
- `componentSizes.iconButton = touchTarget.minHeight` (48)
- `componentSizes.listIcon = 46`
- `componentSizes.listRowMinHeight = 72`
- `componentSizes.inputMinHeight = 52`
- optional `componentSizes.segmentMinHeight = 44` if forms need slightly denser controls than 48 while retaining accessible outer targets

Rationale: a tiny component-token layer avoids repeated hardcoded dimensions while staying within the review budget. Do not move all existing constants into a large token hierarchy in this pass.

### 2. Normalize list/card rhythm

Files:

- `src/components/transactions/TransactionList.tsx`
- `src/components/categories/CategoryList.tsx`

Changes:

- Use shared row minimum height (`72`) for both transaction and category cards.
- Keep icon badges at `46x46`, `radius.sm`/16-ish parity.
- Keep card padding at `spacing.sm`/12 and inter-row gap at 10–12. Prefer current `marginBottom: spacing.sm` or FlatList `ItemSeparatorComponent`, but do not refactor list structure unless necessary.
- Category cards should keep the colored left affordance but align internal row dimensions with transaction cards.
- Normalize header add buttons to 48x48, consistent radius, and consistent text/icon line height.
- Add/keep accessible labels for primary and row actions where small enough to fit scope:
  - `Agregar movimiento`
  - `Agregar categoría`
  - `Editar <name/description>`
  - `Eliminar <name/description>`

OpenDesign reference anchors:

- `.tx-row`: `min-height: 70px`, `padding: 12px`, `grid-template-columns: 46px 1fr auto`, `gap: 12px`, `border-radius: 20px`
- `.cat-card`: `padding: 15px`, `border-radius: 22px`, `grid-template-columns: 46px 1fr auto`

### 3. Tighten typography hierarchy

Files:

- `TransactionList.tsx`
- `CategoryList.tsx`
- `BalanceSummary.tsx`
- `TransactionForm.tsx`
- `CategoryForm.tsx`

Changes:

- Preserve current Inter font setup.
- Keep screen titles around 30–31px and kicker 12px uppercase/lime.
- Normalize card titles to 14–16px depending context:
  - transaction row title: 14–15px bold
  - category row title: 16px bold, not visually larger than Balance section titles
- Ensure metadata/helper/error text uses explicit line heights (`17–18`) and `colors.textSecondary`/`colors.textMuted` consistently.
- Avoid copy changes unless needed for accessibility labels.

### 4. Balance screen alignment

File: `src/components/balance/BalanceSummary.tsx`

Changes:

- Normalize refresh icon container to 48x48.
- Keep hero card gradient/background intact, but align padding with OpenDesign summary-card (`20`) and maintain `radius.lg`.
- Keep main amount at 40px or nudge only if emulator shows wrapping/clipping; do not chase pixel perfection.
- Mini-stats should remain two equal columns with 10–12 gap and 13–16 padding.
- Principal category and state cards should share card rhythm: `radius.md`, `padding: spacing.md`, clear 12/13px label/help text.

### 5. Harmonize forms

Files:

- `src/components/transactions/TransactionForm.tsx`
- `src/components/categories/CategoryForm.tsx`

Changes:

- Keep existing form flows and validation behavior.
- Normalize back buttons to 48x48 for Android touch target consistency.
- Align field groups to OpenDesign-style `gap: 7–8`; current `spacing.xs` is acceptable.
- Add border to Transaction `typeRow` to match Category `segmentedRow`.
- Use consistent active segment styling. Prefer `colors.lime` + `colors.textOnAccent` for closer OpenDesign parity if contrast remains acceptable; otherwise keep `colors.secondary`.
- Add a soft bordered palette container around Category swatches if it stays within line budget.
- Ensure swatches/chips remain at least 48dp touch targets.
- Keep save/delete CTAs as full-width pills with `touchTarget.minHeight`.

OpenDesign reference anchors:

- `.form-stack`: `gap: 12px`
- `.field`: `gap: 7px`
- `.input`: `min-height: 52px`, `border-radius: 17px`
- `.segmented`: `gap: 6px`, `padding: 5px`, `border-radius: 18px`, border present
- `.btn-primary`: `min-height: 48px`, pill radius

### 6. Bottom tab micro-polish

File: `src/components/navigation/CashiTabBar.tsx`

Changes:

- Preserve `mainRoutes = ['index', 'categories', 'balance']` and the detail-route hiding behavior.
- Keep shell height 72, left/right 14, padding 8, gap 8.
- Tune active/inactive item alignment only if Android emulator shows drift:
  - icon size remains 19
  - label size remains 10, bold
  - active pill min height fills available shell and centers icon+label with gap 4
- Add no new tabs and no route architecture changes.

## Data flow and contracts

No data-flow or domain model changes are planned.

Existing contracts remain:

- `TransactionList` receives transaction display data and invokes `onCreate`, `onEdit(id)`, `onDelete(id)`.
- `CategoryList` receives categories/transactions and invokes `onCreate`, `onEdit(id)`, `onDelete(id)`.
- `TransactionForm` and `CategoryForm` remain controlled components using caller-owned state and validation errors.
- `BalanceSummary` remains pure presentational summary from numeric props.
- `CashiTabBar` consumes React Navigation bottom tab props and filters visible routes to the approved three.

Potential new non-breaking contract additions:

- `accessibilityLabel` on existing `Pressable` elements.
- `testID` only if needed for TDD assertions; prefer accessibility queries first.

## File change forecast

Expected implementation files and line impact:

| File                                              |    Forecast |
| ------------------------------------------------- | ----------: |
| `src/design/tokens.ts`                            | 10–25 lines |
| `src/components/navigation/CashiTabBar.tsx`       |  5–20 lines |
| `src/components/transactions/TransactionList.tsx` | 25–45 lines |
| `src/components/categories/CategoryList.tsx`      | 25–50 lines |
| `src/components/balance/BalanceSummary.tsx`       | 15–35 lines |
| `src/components/transactions/TransactionForm.tsx` | 20–45 lines |
| `src/components/categories/CategoryForm.tsx`      | 20–45 lines |
| tests under `__tests__/`                          | 30–60 lines |

Total forecast: ~150–285 changed lines. This stays within the 300 changed-line guard if implementation avoids refactors and snapshot churn.

Do not touch:

- `src/components/ui/AppBackground.tsx`
- `Cashi-Mobile-UX-Polish/**`
- dependency manifests except if the test runner requires no-op metadata updates, which are not expected

## Strict TDD plan

Test runner: `npm test`

### RED evidence to collect during apply

Before style implementation, add the smallest behavior/accessibility tests that expose current gaps. Run `npm test -- --runInBand` and record the failing test names/output.

Recommended RED tests:

1. `CashiTabBar` renders exactly the three approved labels for main routes and never renders `Categoría`/`Movimiento` detail labels.
   - This may pass immediately; if so, it documents the navigation guard rather than serving as RED.
2. `CategoryList` primary add control is accessible as `Agregar categoría` and triggers `onCreate`.
   - Expected current failure: no accessible label on the add Pressable.
3. `TransactionList` primary add control is accessible as `Agregar movimiento` and triggers `onCreate`.
   - Expected current failure: no accessible label on the add Pressable.
4. Optional if line budget allows: row destructive actions expose specific labels, e.g. `Eliminar Supermercado` / `Eliminar Comida`.

Avoid brittle tests that assert every style numeric value. One or two focused style/token assertions are acceptable only for contractual constraints, e.g. exported `componentSizes.iconButton` equals `touchTarget.minHeight`.

### GREEN evidence to collect during apply

After implementation:

- Run `npm test -- --runInBand`.
- Run `npm run typecheck`.
- Confirm tests pass and record command outputs in apply/verify notes.

### Validation evidence to collect during verify

- Run `npx expo export --platform android`.
- Android emulator/device visual pass for:
  - Movimientos
  - Categorías
  - Balance
  - Transaction form
  - Category form
  - hidden detail-route behavior
- OpenDesign comparison notes against:
  - `Cashi-Mobile-UX-Polish/css/cashi.css`
  - `android-transactions.html`
  - `android-categories.html`
  - `android-balance.html`
  - `android-transaction-form.html`
  - `android-category-form.html`

Record practical parity outcomes for rhythm/spacing, card sizing/alignment, typography hierarchy, contrast/readability, tab active state, and form consistency. Explicitly note that background parity is not pixel-perfect by design and is out of scope.

## Rollout plan

Single PR is appropriate if changed lines remain at or below 300.

Implementation order:

1. Add TDD tests and capture RED.
2. Add tiny component/rhythm token aliases.
3. Polish list/header action rhythm in Transaction and Category lists.
4. Polish Balance card/action rhythm.
5. Harmonize forms.
6. Micro-polish tab alignment without touching route filtering.
7. Run GREEN commands and Android/OpenDesign validation.
8. Check changed-line count. If >300, stop and document why or split only after parent/user approval.

## Risks and mitigations

- **Risk: style drift from many small edits.** Mitigate with tiny shared tokens and no broad rewrites.
- **Risk: changed-line budget overrun.** Mitigate by avoiding snapshots, new components, and large token refactors.
- **Risk: tests become brittle style snapshots.** Mitigate by testing behavior/accessibility and only contractual token sizes.
- **Risk: detail routes exposed accidentally.** Mitigate by preserving `mainRoutes`, adding tab visibility test, and manual detail-route validation.
- **Risk: background scope creep.** Mitigate by not editing `AppBackground` and documenting background as accepted.

## Acceptance mapping

- Android-first OpenDesign visual comparison: covered by verify visual pass and comparison notes.
- Expo Go compatibility: no dependency or native changes; validate with Expo export and managed workflow run.
- Navigation visibility: preserve `mainRoutes`, `href: null`, and add tab visibility test.
- Visual polish boundaries: touches only tokens and presentational component styles; no background/reference edits.
- Review workload guard: forecast <=300 lines; compute changed lines before review.

## Phase result envelope

```yaml
phase: design
change: cashi-mobile-android-visual-polish
status: complete
artifact_store: openspec
artifact_path: openspec/changes/cashi-mobile-android-visual-polish/design.md
engram_persistence: unavailable-no-tools
skill_resolution: fallback-path
scope:
  package_focus: cashi-mobile Expo React Native app
  style_token_component_level: true
  dependency_changes: none
  background_redesign: false
  opendesign_reference_edits: false
constraints_satisfied:
  expo_go_compatible_design: true
  three_visible_tabs_preserved: true
  detail_routes_hidden: true
  changed_line_forecast_within_300: true
forecast:
  files: 7-10
  changed_lines: 150-285
strict_tdd:
  test_runner: npm test
  red_plan: add focused accessibility/navigation tests before implementation and run npm test -- --runInBand
  green_plan: run npm test -- --runInBand and npm run typecheck after implementation
  validation_plan: run npx expo export --platform android plus Android emulator/OpenDesign comparison notes
ready_for_apply: true
```
