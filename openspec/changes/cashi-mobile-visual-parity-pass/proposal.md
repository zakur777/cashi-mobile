# Proposal: Visual Parity Pass

## Intent
Bring the Android app screens closer to the OpenDesign reference after emulator review feedback.

## Issues Addressed
- Balance metrics needed to live inside the main balance card.
- Screen backgrounds needed visible glow/gradient treatment instead of flat black surfaces.
- Default Expo Router tab styling could not match the OpenDesign active gradient pill.
- Detail forms also needed the same background treatment.

## Scope
- Shared app background with glow layers for tabs and forms.
- Custom bottom tab bar with gradient active state and icons.
- Balance summary structure matching OpenDesign: header, main balance card with income/expense mini stats, principal category, state card.
- Transparent screen containers so gradient background remains visible.

## Out of Scope
- Proprietary display font exactness without font files/license.
- Pixel-perfect CSS backdrop-filter/radial-gradient parity beyond native approximations.
