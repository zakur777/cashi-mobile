# SDD Explore — cashi-mobile-opendesign-ux-polish

## status

explored

## executive_summary

Cashi Mobile already has a coherent fintech baseline UI with tokenized colors/spacing/radius and clear hook-first separation. The app is functionally solid and visually consistent, but there is room for a professional polish pass in hierarchy, typography, interaction states, empty/loading systemization, and navigation visual refinement. This change should proceed to proposal/spec/design before implementation.

## scope_checked

- Routes/screens under `app/`
- Presentational components under `src/components/`
- Design tokens under `src/design/tokens.ts`
- Login/readme credential consistency
- Known UX warnings carried forward

## current_ui_inventory

### Screens / UX purpose

1. `app/index.tsx` — Login screen (email/password, inline validation, submit CTA).
2. `app/(tabs)/index.tsx` — Transactions list hub.
3. `app/(tabs)/categories.tsx` — Categories list hub.
4. `app/(tabs)/balance.tsx` — Balance summary view.
5. `app/(tabs)/category/[id].tsx` — Category create/edit form.
6. `app/(tabs)/transaction/[id].tsx` — Transaction create/edit form.
7. `app/(tabs)/_layout.tsx` — Tabs visual shell and color behavior.

### Components

- `src/components/transactions/TransactionList.tsx`
- `src/components/transactions/TransactionForm.tsx`
- `src/components/categories/CategoryList.tsx`
- `src/components/categories/CategoryForm.tsx`
- `src/components/balance/BalanceSummary.tsx`

## design_system_state

### Tokens present (`src/design/tokens.ts`)

- Colors: primary/secondary/success/surface/surfaceCard/text/border/danger/dangerSoft
- Spacing scale: xs/sm/md/lg/xl
- Radius scale: sm/md/lg/pill
- Touch target minimum: 44

### Current token usage quality

- Good adoption in core components and screens.
- Interaction sizing generally respects `touchTarget.minHeight`.
- Visual language is already mostly token-based (not purely literal values).

## ux_strengths_already_implemented

- Clear hook-first architecture; screens orchestrate, components render.
- No AsyncStorage leakage into components (`src/components` has no AsyncStorage imports).
- Inline field/form validation flow in login and forms.
- Empty states present in categories/transactions/balance.
- Financial signposting in transaction/balance (`+/-`, income vs expense styling).
- Tab/header theming aligned with app palette.
- Safe, low-friction CRUD flows with direct actions (create/edit/delete).

## polish_opportunities_for_opendesign

### Information hierarchy & visual rhythm

- Strengthen typographic hierarchy (titles/section labels/amount emphasis consistency).
- Standardize vertical rhythm and card density across list and form screens.
- Introduce a reusable layout shell pattern for all tabs/forms.

### Interaction states

- Add explicit pressed/disabled/loading states for all primary/secondary/destructive buttons.
- Improve affordance and contrast tuning for action buttons and chips.

### Navigation/UI chrome

- Refine tab bar and header styling for stronger fintech trust signal (depth, spacing, iconography strategy if introduced later).
- Normalize page-level status messaging (loading/error/empty) into reusable patterns.

### Forms UX

- Improve grouping and progressive disclosure in transaction form (type/category/date blocks).
- Add clearer helper text/microcopy for critical financial fields.

### Data readability

- Improve numeric readability (alignment, formatting consistency, potential mono numeric treatment).
- Harmonize card metadata contrast and spacing for scannability.

### Accessibility polish

- Expand accessibility labels/hints consistency across list actions and destructive buttons.
- Review contrast pairs for long sessions and low-light readability.

## carried_forward_warnings

1. `SafeAreaView` deprecation warning still relevant (known non-blocking deferred item).
2. README credential drift is still present:
   - README: `admin@cashi.cl` / `123456`
   - Runtime hook/tests: `demo@cashi.com` / `Cashi1234`

## proceed_recommendation

Proceed with SDD phases:

- `proposal` ✅
- `spec` ✅
- `design` ✅
  before any UI implementation.

Rationale: scope is cross-screen, design-system-sensitive, and should remain reviewable and architecture-safe.

## likely_affected_files_next_phases

- `openspec/changes/cashi-mobile-opendesign-ux-polish/proposal.md`
- `openspec/changes/cashi-mobile-opendesign-ux-polish/specs/...` (UI/UX deltas)
- `openspec/changes/cashi-mobile-opendesign-ux-polish/design.md`
- `openspec/changes/cashi-mobile-opendesign-ux-polish/tasks.md`

Likely implementation-touch areas later (not in this phase):

- `src/design/tokens.ts`
- `app/index.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/categories.tsx`
- `app/(tabs)/balance.tsx`
- `src/components/categories/*`
- `src/components/transactions/*`
- `src/components/balance/BalanceSummary.tsx`
- `README.md` (credential drift correction if approved)

## risks

- UI polish can balloon into broad visual churn without strict task slicing.
- Introducing non-token literals would regress design-system discipline.
- Visual changes must not leak business logic into components.

## skill_resolution

injected
