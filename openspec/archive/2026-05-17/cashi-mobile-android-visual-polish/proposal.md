# Proposal: Android Visual Polish

## Intent

Perform a small, Android-first visual polish pass that improves Cashi Mobile's perceived quality after the prior OpenDesign parity work, without changing product scope, navigation architecture, background strategy, or Expo Go delivery.

This change should tighten practical parity with the local OpenDesign reference for rhythm, spacing, hierarchy, contrast, tab alignment, and form consistency. It must not pursue pixel-perfect background fidelity; the accepted current background remains `src/components/ui/AppBackground.tsx`.

## Scope

### In Scope

- Normalize list/card rhythm across Movimientos and Categorías:
  - inter-card spacing
  - card minimum heights and vertical padding
  - internal row alignment for icons, labels, metadata, amounts, and actions
- Tighten typography hierarchy for screen headers, section labels, card titles, metadata, and financial amounts.
- Improve action consistency:
  - icon button dimensions should respect Android touch target expectations
  - edit/delete/secondary actions should use consistent spacing and visual weight
  - primary add actions should feel aligned across list screens and forms
- Refine Balance screen sizing and alignment:
  - main balance card rhythm
  - income/expense mini-stat sizing
  - principal category block spacing
  - supporting state/insight card alignment
- Harmonize Category and Transaction forms:
  - section/card spacing
  - segmented controls and category/type chips
  - field label/input/helper/error spacing
  - CTA vertical rhythm
- Micro-polish the custom bottom tab bar while preserving behavior:
  - exactly three visible tabs: Movimientos, Categorías, Balance
  - active pill padding, icon/label alignment, and contrast
  - detail routes must remain hidden from tabs
- Keep implementation style-token driven and limited to React Native primitives/StyleSheet-compatible changes.

### Out of Scope

- Background redesign or continued background pixel-perfect iteration.
- New visual assets unless a real exported asset already exists and is explicitly accepted.
- Modifying, committing, or copying files from `Cashi-Mobile-UX-Polish/`.
- Native-only dependencies, Expo dev-client migration, or any dependency that breaks Expo Go/simple delivery.
- New product features or IA changes: QR, cards, contacts, savings goals, profile, payment methods, backend sync, investments, or new tabs.
- Navigation architecture refactors beyond confirming hidden detail routes remain hidden.
- Pixel-perfect parity with proprietary fonts, CSS backdrop-filter, or OpenDesign background effects.
- Broad component rewrites or data-flow changes.

## Affected Areas

Primary implementation candidates:

- `src/design/tokens.ts`
- `src/components/navigation/CashiTabBar.tsx`
- `src/components/transactions/TransactionList.tsx`
- `src/components/transactions/TransactionForm.tsx`
- `src/components/categories/CategoryList.tsx`
- `src/components/categories/CategoryForm.tsx`
- `src/components/balance/BalanceSummary.tsx`
- Tab/form screen wrappers only if needed for spacing consistency:
  - `app/(tabs)/index.tsx`
  - `app/(tabs)/categories.tsx`
  - `app/(tabs)/balance.tsx`
  - `app/(tabs)/category/[id].tsx`
  - `app/(tabs)/transaction/[id].tsx`

Reference-only validation inputs:

- `Cashi-Mobile-UX-Polish/css/cashi.css`
- `Cashi-Mobile-UX-Polish/screens/android-balance.html`
- `Cashi-Mobile-UX-Polish/screens/android-transactions.html`
- `Cashi-Mobile-UX-Polish/screens/android-categories.html`
- `Cashi-Mobile-UX-Polish/screens/android-category-form.html`
- `Cashi-Mobile-UX-Polish/screens/android-transaction-form.html`

## OpenDesign Validation Requirement

Implementation and verification must include a practical visual comparison against the local OpenDesign HTML/CSS files listed above. The comparison should validate:

- visual rhythm and vertical spacing across screen sections
- list/card density and internal alignment
- hierarchy of titles, labels, metadata, and amount typography
- card/surface contrast and readable muted text contrast on Android
- active bottom tab pill, icon, and label alignment
- category and transaction form consistency, including segmented controls, chips, inputs, helper/error text, and CTA placement

The validation must be Android-first using Android Studio/emulator. Do not target pixel-perfect background fidelity, and do not modify or commit anything under `Cashi-Mobile-UX-Polish/`.

## Constraints

- User-facing copy remains Spanish Rioplatense where copy changes are unavoidable; SDD artifacts remain English.
- Keep Expo Go/simple delivery; no dev-client or native-only dependency path.
- Keep the accepted background implementation in `src/components/ui/AppBackground.tsx`.
- Only three tabs may be visible: Movimientos, Categorías, Balance.
- Detail routes must not appear in the tab bar.
- Favor small, tokenized style adjustments over broad rewrites.
- Stay within the review workload guard of approximately 300 changed lines.

## Risks

- Style-only changes across multiple components can drift into a broad redesign if not bounded by tokens and existing component structure.
- Over-tuning against HTML/CSS can create React Native approximations that are fragile on Android screen sizes.
- Additional spacing or larger touch targets may reduce visible content density if not checked on emulator.
- Tab micro-polish could accidentally expose detail routes if tab filtering is touched carelessly.
- Background or font exactness pressure could reintroduce scope creep from prior visual parity passes.

## Rollback Plan

- Revert this change's style edits in the affected components and tokens.
- Preserve prior accepted artifacts from `cashi-mobile-opendesign-ux-polish`, `cashi-mobile-visual-parity-pass`, and `cashi-mobile-visual-parity-followup`.
- If a specific polish area regresses Android usability, roll back only that component-level adjustment rather than reverting the whole app shell.
- Do not roll back `AppBackground` unless a separate approved background change exists.

## Success Criteria

- Android emulator review shows visibly improved spacing, card sizing, hierarchy, contrast, tab alignment, and form consistency versus the current app.
- Practical parity is validated against the required OpenDesign reference files for rhythm, spacing, hierarchy, contrast, tabs, and forms.
- `Cashi-Mobile-UX-Polish/` remains unmodified and uncommitted.
- Exactly three visible tabs remain: Movimientos, Categorías, Balance.
- Detail routes remain hidden from the custom tab bar.
- No native-only dependencies, dev-client requirements, or Expo Go delivery regressions are introduced.
- `npm run typecheck` passes.
- `npm test -- --runInBand` passes.
- `npx expo export --platform android` passes.
- Implementation remains within the intended small polish footprint and review budget.

## Workload Forecast

Expected implementation touch: 7–9 files and approximately 180–260 changed lines if scope remains limited to token/component style tuning. This is within the configured 300 changed-line review budget.

## Skill Resolution

fallback-path — exact user-requested project skill files were loaded directly before drafting this proposal.
