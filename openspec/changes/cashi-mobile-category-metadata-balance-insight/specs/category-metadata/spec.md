# Category Metadata and Balance Insight Specification

## ADDED Requirements

### Requirement: Category type and color metadata

The system MUST store every category with a transaction type and a fixed Cashi palette color.

#### Scenario: Valid category metadata

- GIVEN a category form submission
- WHEN the user provides a non-empty name, a type of `income` or `expense`, and an allowed color
- THEN the category is accepted and persisted with that metadata

#### Scenario: Invalid category metadata

- GIVEN a category form submission
- WHEN the type or color is missing or outside the allowed values
- THEN submission is rejected with inline validation feedback

### Requirement: CLP money formatting

The system MUST display money amounts in Chilean pesos with no decimals and dot thousands separators.

#### Scenario: Balance and movement display

- GIVEN amount `1250000`
- WHEN it is displayed as money
- THEN the UI shows `$1.250.000`

### Requirement: Principal expense category insight

The balance summary MUST identify the expense category with the highest total spending.

#### Scenario: Demo data principal category

- GIVEN demo transactions include Supermercado for `Comida` with `$42.000`, Transporte with `$11.500`, and Ocio with `$12.000`
- WHEN the balance summary is computed
- THEN the principal category is `Comida`
- AND its amount is `$42.000`

### Requirement: Backward-compatible category defaults

The system SHOULD tolerate previously persisted categories missing type/color by applying safe defaults at read/use boundaries.

#### Scenario: Legacy category data

- GIVEN a persisted category only has `id` and `name`
- WHEN categories are loaded
- THEN the app does not crash
- AND display/logic can fall back to expense type and a default Cashi color
