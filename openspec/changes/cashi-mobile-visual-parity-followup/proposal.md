# Proposal: Visual Parity Follow-up

## Intent
Close the main visual gaps found during Android emulator review after OpenDesign polish.

## Problems Found
- Bottom tabs showed placeholder/missing icons instead of real navigation icons.
- Android status bar content (time, battery, signal) appeared black over a black app background.
- Font loading import was fragile through the root `@expo-google-fonts/inter` export.
- Native app is close to OpenDesign, but exact parity is limited by missing proprietary display fonts and CSS-only effects.

## Scope
- Add explicit Ionicons tab icons.
- Set Android status bar to light content on dark background.
- Use direct Inter `.ttf` font requires via `expo-font`.
- Verify typecheck, tests, and Android export.

## Out of Scope
- Pixel-perfect parity with proprietary OpenDesign fonts unless font files/licensing are provided.
- Replacing Expo Router tabs with a fully custom tab bar in this slice.
