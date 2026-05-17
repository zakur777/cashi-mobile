# OpenDesign Prompts — Cashi Mobile UX Polish

## Source References

Reference screenshots show a premium dark fintech wallet style. We will borrow interface patterns, not features.

## Extracted Interface Elements

- Deep near-black mobile background with subtle purple/blue radial glow.
- Large rounded hero cards with violet/lavender gradient.
- Glassy elevated surfaces, soft borders, inner shadows, and high radius.
- Strong numeric hierarchy for balances and transaction amounts.
- Compact top app bars with centered title and circular icon buttons.
- Floating rounded bottom tab bar with one active pill/icon emphasis.
- Transaction/list rows as dark rounded cards with icon/avatar, title, metadata, and signed amount.
- Gradient primary CTA buttons.
- Empty states with centered icon, short title, helper copy, and CTA.
- Segmented controls/chips for filtering or selecting type.

## Cashi Personalization Rules

- Keep Cashi palette: `#281C59`, `#4E8D9C`, `#85C79A`, `#EDF7BD`.
- Cashi should feel warmer and simpler than the reference, less crypto/card-heavy.
- Preserve current app scope only: login, transactions, categories, balance, category form, transaction form.
- Do not introduce QR, cards, savings goals, contacts, profile, or payment-method features.
- Prioritize readable Spanish fintech UX.
- Preserve React Native implementation constraints: token-based styles, render-only components, hook-first logic.

## Prompt 0 — Shared Design System Direction

Use this first in OpenDesign to establish the shared visual language.

```text
Design a premium but approachable mobile fintech UI direction for an app named Cashi Mobile. Use the provided references as inspiration only: dark near-black surfaces, subtle violet/blue glow, glassy rounded cards, gradient CTAs, floating bottom navigation, and strong numeric hierarchy.

Create a cohesive visual system for the existing app screens only: login, transactions list, categories list, balance summary, category form, and transaction form. Do not add new features like QR, cards, contacts, savings goals, or profile.

Brand palette to adapt and modernize:
- Deep purple: #281C59
- Teal: #4E8D9C
- Green success: #85C79A
- Soft lime accent: #EDF7BD

Output a mobile app UI concept with:
- dark background tokens
- card/surface tokens
- gradient button style
- typography hierarchy
- spacing/radius/touch target rules
- bottom tab style
- list row/card style
- form field style
- empty/loading/error state patterns

The result should feel trustworthy, clean, financial, and demo-ready, with Spanish UI copy and no extra product scope.
```

## Prompt 1 — Login Screen

```text
Create a single mobile login screen for Cashi Mobile, a small personal finance app. Use a premium dark fintech style inspired by the references: near-black background, subtle purple/teal glow, large rounded glass card, gradient primary CTA, and calm trustworthy typography.

Screen content must remain exactly within current scope:
- App title: Cashi Mobile
- Subtitle: Ingresá con tus credenciales
- Email input with placeholder demo@cashi.com
- Password input
- Inline validation/error area
- Primary CTA: Ingresar

Use Cashi palette (#281C59, #4E8D9C, #85C79A, #EDF7BD), but make it feel more polished than the current flat card. Do not add signup, forgot password, social login, biometrics, or backend concepts.

Include clear spacing, safe-area awareness, accessible contrast, and a layout that works on a Pixel-style Android phone frame.
```

## Prompt 2 — Transactions Home/List

```text
Design the Cashi Mobile transactions tab. This is the main home/list screen after login. Use the reference wallet home screen as inspiration, but adapt it to our simpler app scope.

Required content:
- Header greeting or page title for Movimientos / Transacciones
- A compact financial summary card showing balance, income, and expenses using demo data
- Primary action to add a transaction
- Transaction history list with rows showing description, category name, date, signed amount, and income/expense visual distinction
- Empty/loading/error state pattern, but focus on populated demo state
- Bottom tab bar with Transacciones active, Categorías, Balance

Visual direction:
- dark fintech background with soft Cashi purple/teal glow
- rounded gradient summary card
- dark list cards with subtle borders
- income in #85C79A, expense in a clear but not harsh danger tone
- strong numeric hierarchy and readable Spanish labels

Do not add send/request/top-up/cards/account features.
```

## Prompt 3 — Categories List

```text
Design the Cashi Mobile categories tab. It should feel consistent with the transactions screen and premium fintech references, but focused only on managing transaction categories.

Required content:
- Page title: Categorías
- Short helper text explaining categories organize movements
- Add category CTA
- List of category cards using demo categories: Ingresos, Comida, Transporte, Ocio
- Each row should have a small icon/badge area, category name, and edit/delete actions
- Empty/loading/error state pattern
- Bottom tab bar with Categorías active

Visual direction:
- dark background
- glassy rounded category cards
- subtle colored category badges using Cashi palette
- clear touch targets for edit/delete
- avoid visual clutter; categories should be simpler than transaction rows

Do not add budgets, analytics, or category spending charts in this screen.
```

## Prompt 4 — Balance Summary

```text
Design the Cashi Mobile balance tab. Use the reference savings/wealth screens as inspiration, but adapt to our current balance-only scope.

Required content:
- Page title: Balance
- Large hero balance card with current balance
- Two supporting metric cards: Total ingresos and Total egresos
- A short insight/helper message based on demo data
- Optional recent summary list, but only if it does not add new functionality
- Empty state for no transactions: centered icon, short text, CTA-like hint to add a transaction
- Bottom tab bar with Balance active

Visual direction:
- premium dark background with soft glow
- large rounded gradient financial card
- strong number typography
- income green, expense controlled red/danger, balance prominent
- calm and trustworthy, not gamified

Do not add savings goals, investments, charts requiring new data, or account/profile features.
```

## Prompt 5 — Category Create/Edit Form

```text
Design the Cashi Mobile category create/edit form in the same premium dark fintech style.

Required content:
- Header with back action and title: Nueva categoría or Editar categoría
- Single input: Nombre
- Inline validation message area
- Primary CTA: Guardar categoría
- Optional destructive delete action only for edit state

Visual direction:
- form inside a rounded glass card
- clear label/input/error hierarchy
- gradient primary CTA
- generous touch targets
- Spanish copy
- consistent with Cashi tokens and the list screens

Do not add icon pickers, color pickers, budgets, or advanced category settings.
```

## Prompt 6 — Transaction Create/Edit Form

```text
Design the Cashi Mobile transaction create/edit form. Use the reference dark fintech forms/cards as inspiration, but keep the current app scope.

Required content:
- Header with back action and title: Nueva transacción or Editar transacción
- Amount input with strong numeric emphasis
- Type selector for Ingreso / Egreso using segmented pill control
- Description input
- Date input
- Category selector/list field
- Inline validation messages
- Primary CTA: Guardar movimiento
- Optional delete action for edit state

Visual direction:
- dark premium background
- grouped form sections in rounded cards
- amount field visually prominent
- type selector uses Cashi green for income and clear expense styling
- category selector feels like a tappable row/card
- gradient CTA, accessible contrast, mobile-friendly spacing

Do not add recurring payments, attachments, contacts, payment methods, or backend sync.
```

## Prompt 7 — Bottom Navigation / App Shell

```text
Design the shared Cashi Mobile app shell for the three-tab app: Transacciones, Categorías, Balance.

Required content:
- Floating rounded bottom tab bar
- Three tabs only: Transacciones, Categorías, Balance
- Active tab with Cashi purple/teal gradient emphasis
- Inactive tabs low-contrast but readable
- Header/top bar pattern for list screens and form screens
- Safe-area aware layout

Visual direction:
- inspired by premium fintech wallet references
- no extra Account/Cards/Savings/Profile tabs
- keep navigation simple and academic-project friendly
- React Native friendly: achievable with View/Text/Pressable/StyleSheet and optional built-in icons only if already available
```
