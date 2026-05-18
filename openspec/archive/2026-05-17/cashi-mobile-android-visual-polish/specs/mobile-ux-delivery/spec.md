# Delta for Mobile UX Delivery

## ADDED Requirements

### Requirement: Android-first OpenDesign visual comparison

The implementation and verification process MUST perform an Android-first practical visual comparison against the local OpenDesign references using `Cashi-Mobile-UX-Polish/css/cashi.css` and these screens: `android-balance.html`, `android-transactions.html`, `android-categories.html`, `android-category-form.html`, and `android-transaction-form.html`.

#### Acceptance Criteria

- Comparison evidence MUST cover rhythm/spacing, list and card sizing/alignment, typography hierarchy, contrast/readability, tab active state alignment, and form consistency.
- Validation MUST be Android-first (Android emulator/device before other platforms).
- The comparison MUST treat OpenDesign files as read-only references and MUST NOT require pixel-perfect background fidelity.

#### Scenario: Android-first visual parity check

- GIVEN the polish change is under review
- WHEN visual validation is executed against the required local OpenDesign files
- THEN Android views show practical parity for spacing rhythm, hierarchy, contrast, tabs, and forms
- AND validation records the comparison outcomes for each required reference screen

### Requirement: Expo Go compatibility and dependency safety

The system MUST remain compatible with Expo Go for this change and MUST NOT introduce dev-client-only or native-only dependency requirements.

#### Acceptance Criteria

- No newly introduced dependency SHALL require custom native builds for this visual polish scope.
- Existing app flows used by Movimientos, Categorías, and Balance MUST run in Expo Go.

#### Scenario: Managed workflow compatibility preserved

- GIVEN the visual polish changes are applied
- WHEN the app is run through the managed Expo Go path
- THEN the polished screens are usable without requiring a custom dev client or native module integration

### Requirement: Navigation visibility and tab behavior constraints

The bottom navigation MUST expose exactly three visible tabs: Movimientos, Categorías, and Balance. Detail routes MUST remain hidden from tab navigation.

#### Acceptance Criteria

- Only Movimientos, Categorías, and Balance are visible in the tab bar.
- Category and transaction detail routes SHALL NOT appear as tab options.
- Tab active-state styling MUST preserve icon-label alignment and readable contrast.

#### Scenario: Detail routes remain hidden

- GIVEN a user navigates into category or transaction detail/edit routes
- WHEN the tab bar is rendered
- THEN no additional tabs are shown for detail routes
- AND only the three approved tabs remain visible

### Requirement: Visual polish scope boundaries

This change MUST be limited to Android-first visual polish of card rhythm/sizing, typography hierarchy, tab active state/icon-label alignment, form consistency, and contrast/alignment. The change MUST NOT include background redesign beyond preserving the accepted `src/components/ui/AppBackground.tsx` behavior.

#### Acceptance Criteria

- Polish edits are constrained to the approved visual categories (rhythm, sizing, hierarchy, tab alignment, forms, contrast/alignment).
- `src/components/ui/AppBackground.tsx` behavior is preserved and background rework is out of scope.
- `Cashi-Mobile-UX-Polish/` remains unmodified and uncommitted.

#### Scenario: Scope guard for visual-only polish

- GIVEN implementation review for this change
- WHEN touched files and behavior are inspected
- THEN edits map to the approved visual polish scope
- AND no background strategy redesign is introduced
- AND reference assets under `Cashi-Mobile-UX-Polish/` remain unchanged

### Requirement: Review workload budget guard

The implementation SHOULD target a review workload of no more than 300 changed lines for this polish pass.

#### Acceptance Criteria

- The final change set SHOULD stay at or below 300 changed lines.
- If the change exceeds 300 lines, the review notes MUST justify why the excess was necessary to satisfy the approved polish scope.

#### Scenario: Review workload evaluation

- GIVEN the change is prepared for review
- WHEN the changed-line count is computed
- THEN the patch is at or below the 300-line target
- OR an explicit justification is provided for any overage
