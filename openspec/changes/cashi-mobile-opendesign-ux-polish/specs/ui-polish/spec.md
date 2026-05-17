# UI Polish Specification

## ADDED Requirements

### Requirement: Dark fintech visual system

The app MUST use a cohesive dark fintech visual system derived from the OpenDesign Android reference and Cashi palette.

#### Scenario: Shared tokens

- GIVEN UI components render
- WHEN colors, spacing, radius, and surfaces are inspected
- THEN they use shared design tokens rather than scattered literals where practical

### Requirement: Android-first screen polish

The app SHALL polish Login, Movimientos, Categorías, Balance, Category Form, and Transaction Form for Android demo presentation.

#### Scenario: Demo walkthrough

- GIVEN the user logs in with demo credentials
- WHEN they navigate through the three tabs and forms
- THEN screens show dark surfaces, rounded cards, readable CLP amounts, and clear primary actions

### Requirement: Scope preservation

The app MUST NOT add features outside the existing product scope.

#### Scenario: No extra fintech features

- GIVEN the polished UI
- WHEN the screens are reviewed
- THEN there are no QR, cards, contacts, savings goals, profile, payment methods, backend sync, or investment features
