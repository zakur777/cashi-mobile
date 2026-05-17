# Design: OpenDesign UX Polish

## Approach

Translate OpenDesign CSS/HTML patterns into React Native primitives. Prioritize token updates first, then screen-level components.

## Implementation Order

1. Update `src/design/tokens.ts` to dark fintech tokens.
2. Update Expo tabs shell to use three labels: Movimientos, Categorías, Balance.
3. Polish login screen using dark background, brand mark, card/hero copy, and gradient-like CTA approximation.
4. Polish transaction/category/balance components using rounded cards, CLP hierarchy, metadata, and color accents.
5. Polish forms with segmented controls, fixed color palette, and high-contrast inputs.

## Constraints

- No HTML/CSS copy-paste.
- Avoid new dependencies unless explicitly necessary.
- Preserve tests and data flow.
- Keep Android as primary visual target.

## Risk

Visual-only changes can accidentally break tests that assert copy/amounts. Keep labels stable where tests depend on them.
