# Proposal: OpenDesign UX Polish

## Intent

Translate the approved Android-first OpenDesign reference into Cashi Mobile's React Native UI while preserving existing product scope and hook-first architecture.

## Scope

### In Scope

- Dark fintech visual system tokens.
- Login visual refresh.
- Movimientos, Categorías, Balance screen polish.
- Category and transaction form polish.
- Bottom tab/header styling with three tabs only.
- CLP formatting and category metadata already implemented as foundation.

### Out of Scope

- New features: QR, cards, contacts, savings goals, profile, payment methods, backend sync, investments.
- Copying OpenDesign HTML/CSS directly.
- iOS-specific implementation beyond avoiding Android-only breakage.

## Success Criteria

- UI visually follows the OpenDesign Android reference.
- App remains implementable with React Native primitives and StyleSheet.
- Existing tests, typecheck, and Android bundle pass.
- Components remain render-only.
