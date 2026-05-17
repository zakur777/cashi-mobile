# Proposal: Gradient Fidelity Polish

## Intent
Improve visual fidelity against the OpenDesign Android reference by adding native gradient support and applying it to key Cashi surfaces.

## Scope
- Install Expo-compatible `expo-linear-gradient`.
- Apply gradient treatment to brand mark, primary buttons, login hero art, balance hero, and high-emphasis cards/actions.
- Preserve existing screens, flows, data model, and tests.

## Out of Scope
- New product features.
- Pixel-perfect CSS parity where React Native lacks radial gradients/backdrop filters.
- iOS-specific tuning.

## Success Criteria
- Login and core app screens visually move closer to OpenDesign.
- Android export succeeds.
- Typecheck and Jest pass.
