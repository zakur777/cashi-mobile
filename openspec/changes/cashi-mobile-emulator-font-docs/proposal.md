# Proposal: Emulator Troubleshooting and Typography Alignment

## Intent

Document the emulator/Expo Go networking issue discovered during Android validation and align the app typography closer to the OpenDesign reference.

## Scope

- Update README with the problem, root cause, and repeatable solution using `adb reverse tcp:8081 tcp:8081`.
- Correct README details that became outdated after category metadata and demo credentials changes.
- Add Inter font loading as the available OpenDesign-compatible body font.
- Apply typography tokens to key UI text styles.

## Out of Scope

- Shipping proprietary fonts from OpenDesign (`Aeonik Pro`, `Söhne`) without font files/license.
- Changing product scope or flows.

## Success Criteria

- README tells future developers how to recover from black/blank Expo Go emulator screens.
- App uses loaded Inter weights instead of default platform font where practical.
- Typecheck/tests/Android export pass.
