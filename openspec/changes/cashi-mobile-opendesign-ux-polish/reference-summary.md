# OpenDesign Reference Summary — Android Artifact

## Source

Exported OpenDesign artifact stored locally at:

```text
Cashi-Mobile-UX-Polish/
```

Primary Android reference files:

- `Cashi-Mobile-UX-Polish/screens/android-login.html`
- `Cashi-Mobile-UX-Polish/screens/android-transactions.html`
- `Cashi-Mobile-UX-Polish/screens/android-categories.html`
- `Cashi-Mobile-UX-Polish/screens/android-balance.html`
- `Cashi-Mobile-UX-Polish/screens/android-category-form.html`
- `Cashi-Mobile-UX-Polish/screens/android-transaction-form.html`
- `Cashi-Mobile-UX-Polish/css/cashi.css`

The user only has Android available, so implementation should be Android-first. iOS files exist in the export but are non-primary.

## Visual Direction to Adopt

- Premium dark fintech style.
- Near-black backgrounds with subtle purple/teal glow.
- Rounded glassy surfaces with thin borders.
- Cashi palette: `#281C59`, `#4E8D9C`, `#85C79A`, `#EDF7BD`.
- Gradient primary CTA: teal → violet → lime.
- Floating rounded 3-tab bottom navigation.
- Strong mono-style money hierarchy.
- Cards for transactions/categories with icon badge, title, metadata, amount/action.

## CSS Tokens Extracted

```text
--cashi-purple: #281c59
--cashi-teal: #4e8d9c
--cashi-green: #85c79a
--cashi-lime: #edf7bd
--bg: #05060b
--bg-2: #0a0b13
--surface: rgba(21,22,33,0.82)
--surface-strong: rgba(35,31,59,0.9)
--surface-soft: rgba(255,255,255,0.055)
--fg: #f8f8fc
--muted: #a9a9bc
--muted-2: #777891
--border: rgba(255,255,255,0.11)
--border-strong: rgba(237,247,189,0.24)
--success: #85c79a
--danger: #ff6b7d
--warning: #f3ad5d
--radius-xs: 10
--radius-sm: 14
--radius-md: 20
--radius-lg: 28
--radius-pill: 9999
--space-1: 4
--space-2: 8
--space-3: 12
--space-4: 16
--space-5: 20
--space-6: 24
--space-8: 32
--touch: 48
```

## Screen Patterns

### Login

- Top bar with brand mark and “Demo offline” badge.
- Hero copy: “Control financiero simple.”
- Decorative abstract orbit card.
- Email/password fields.
- Primary CTA `Ingresar`.
- Footer note about local-only data.

Implementation notes:

- Keep real credentials `demo@cashi.com` / `Cashi1234` in behavior.
- OpenDesign sample password is `cashi123`; do not adopt it.

### Movimientos

- Header: month + title `Movimientos`.
- Add icon button.
- Period result card with income/expense summary.
- Transaction rows with icon badge, title, category/date metadata, signed CLP amount.
- Bottom tabs: Movimientos, Categorías, Balance.

### Categorías

- Header: `Organización` + `Categorías` + add button.
- Category cards include type (`Ingreso`/`Egreso`), color accent, name, count + signed amount summary, edit/delete actions.
- Requires new category metadata (`type`, `color`) before full UI implementation.

### Balance

- Summary hero card with balance, total ingresos, total egresos.
- Principal category card: highest expense category, amount, progress bar.
- OpenDesign includes a visible “Patrones de estado” block. Treat as reference for states, not permanent product UI.

### Category Form

- Back button + `Local` badge.
- Fields: Nombre, Tipo segmented control, Color fixed palette, Guardar categoría.
- Requires new category metadata (`type`, `color`).

### Transaction Form

- Back button + `CLP` badge.
- Fields: Monto, Tipo segmented control, Descripción, Fecha, Categoría, Guardar movimiento.
- Amount input is visually formatted as `$42.000`; implementation may choose display formatting while preserving numeric state.

## Product Decisions Confirmed by User

- Currency is CLP.
- Category `type`: `income` / `expense`.
- Category `color`: fixed Cashi palette.
- Balance “categoría principal”: highest expense category.
- Android is the primary target.

## Implementation Caveats

- Do not copy HTML/CSS directly; translate into React Native `StyleSheet` and components.
- Do not add out-of-scope features from references: QR, cards, contacts, savings goals, profile, payment methods, backend sync.
- Preserve hook-first architecture and render-only components.
- Split implementation: first data/model behavior, then UI polish.
