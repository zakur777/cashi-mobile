# SDD Explore — cashi-mobile-android-visual-polish

## status

explored

## executive_summary

Cashi Mobile already includes substantial visual parity work (`cashi-mobile-opendesign-ux-polish`, `cashi-mobile-visual-parity-pass`, `cashi-mobile-visual-parity-followup`). For this iteration, the best path is a small, high-impact Android-first refinement pass focused on spacing, card sizing, typography, tab polish, and form consistency—without changing architecture, dependencies, or background strategy.

## context_checked

- OpenSpec prior polish changes and tasks:
  - `openspec/changes/cashi-mobile-opendesign-ux-polish/*`
  - `openspec/changes/cashi-mobile-visual-parity-pass/*`
  - `openspec/changes/cashi-mobile-visual-parity-followup/*`
- App shell / tabs:
  - `app/(tabs)/_layout.tsx`
  - `src/components/navigation/CashiTabBar.tsx`
- Background:
  - `src/components/ui/AppBackground.tsx`
- Main polish targets:
  - `src/components/transactions/TransactionList.tsx`
  - `src/components/categories/CategoryList.tsx`
  - `src/components/balance/BalanceSummary.tsx`
  - `src/components/transactions/TransactionForm.tsx`
  - `src/components/categories/CategoryForm.tsx`
- Tokens:
  - `src/design/tokens.ts`
- OpenDesign reference files for validation:
  - `Cashi-Mobile-UX-Polish/css/cashi.css`
  - `Cashi-Mobile-UX-Polish/screens/android-balance.html`
  - `Cashi-Mobile-UX-Polish/screens/android-transactions.html`
  - `Cashi-Mobile-UX-Polish/screens/android-categories.html`
  - `Cashi-Mobile-UX-Polish/screens/android-category-form.html`
  - `Cashi-Mobile-UX-Polish/screens/android-transaction-form.html`

## findings

### 1) Tab constraints are already mostly aligned

- Only 3 visible tabs are rendered through `CashiTabBar` (`index`, `categories`, `balance`).
- Detail routes are in Tabs config with `href: null`; they do not render in custom tab bar.
- Active tab pill exists and is gradient-backed already.

### 2) Background constraint is satisfied

- `AppBackground` already uses layered gradient washes and is acceptable per user constraint.
- No follow-up needed on background unless real exported assets appear (out of scope now).

### 3) Highest-impact visual gaps remain in density/rhythm

- Card heights and internal spacing vary across transaction/category/balance cards.
- Typography hierarchy is good but not fully normalized:
  - header/title/kicker scales differ subtly across screens
  - metadata contrast/readability can be tightened for Android scan speed
- Action affordances differ:
  - plus buttons vary in size/radius (44 vs 48 patterns)
  - delete/edit micro-actions differ in spacing and emphasis

### 4) Forms are close, but consistency can improve

- Category and transaction forms share structure, but segmented controls/chips/field spacing are not fully harmonized.
- Consistent input/block rhythm and helper/error spacing would produce visible quality gain with low risk.

### 5) Expo Go + Android-first constraint is compatible

- All needed adjustments are style/token/component-level.
- No dev-client or native-only dependencies required.

## bounded_followup_scope (recommended)

A single polish change focused on:

1. **List/Card rhythm normalization**
   - unify min-heights, vertical paddings, inter-card spacing in transactions/categories
2. **Typography hierarchy tightening**
   - standardize title/kicker/meta scales and line-heights
3. **Action consistency**
   - normalize icon button dimensions and destructive/secondary action placement
4. **Balance card alignment**
   - tighten mini-stat sizing and principal category block spacing
5. **Form consistency**
   - align segmented controls, chips, helper/error text spacing, and CTA vertical rhythm
6. **Tab micro-polish**
   - keep current 3-tab behavior; only tune icon/label alignment and active pill padding if needed

## OpenDesign validation requirement

Implementation and verification must explicitly compare the Android app against the local OpenDesign HTML/CSS references listed above. The references are read-only and must not be committed or modified. Validation should focus on practical parity for rhythm, spacing, hierarchy, contrast, tab active state, and form consistency—not pixel-perfect background fidelity.

## out_of_scope

- Background redesign
- New assets not already exported
- Navigation architecture changes
- Native-only libs / dev-client
- Any modification or commit of `Cashi-Mobile-UX-Polish/`

## workload_forecast

Estimated implementation touch: ~7–9 files, ~180–260 changed lines. This is within the stated review budget (300 changed lines), assuming strict scope control.

## android_validation_plan

- OpenDesign visual comparison against local HTML/CSS references
- Android Studio emulator visual pass (primary)
- `npm run typecheck`
- `npm test -- --runInBand`
- `npx expo export --platform android`

## risks

- Scope creep into broader redesign if token additions are not tightly bounded.
- Small style edits across many components can unintentionally break visual consistency if not token-driven.
- Keeping under 300 changed lines requires disciplined “no-refactor” editing.

## skill_resolution

fallback-path
