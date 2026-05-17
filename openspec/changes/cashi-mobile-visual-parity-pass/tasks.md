# Tasks: Visual Parity Pass

- [x] 1. Add shared gradient/glow app background.
- [x] 2. Replace default Expo Router tab visuals with a custom Cashi tab bar.
- [x] 3. Move Balance ingresos/egresos inside the main balance card.
- [x] 4. Apply transparent containers to tab screens and form screens.
- [x] 5. Fix Android safe-area/status overlap and form back navigation.
- [x] 6. Replace hard circular background glows with layered linear washes closer to OpenDesign.
- [x] 7. Install `react-native-svg` and implement OpenDesign-style radial background gradients.
- [x] 8. Generate optimized WebP background asset from OpenDesign-inspired layered gradients.
- [x] 9. Switch `AppBackground` to image-backed `cover` rendering for more stable visual parity.
- [x] 10. Replace lossy WebP background with cleaner PNG gradient asset and retune balance surfaces.
- [x] 11. Trial Skia-rendered gradients for closer native control.
- [x] 12. Revert Skia/Reanimated because dev-client requirement complicates Expo Go delivery.
- [x] 13. Implement Expo Go-compatible top wash background: subtle blue/purple header glow with black body.
- [x] 14. Verify typecheck, tests, and Android export.

## Remaining Limits

- Exact OpenDesign typography still requires licensed `Aeonik Pro` / `Söhne` font assets.
- Backdrop-filter remains approximated by translucent surfaces; background glow uses Expo-compatible linear gradient washes to preserve simple Expo Go delivery.
