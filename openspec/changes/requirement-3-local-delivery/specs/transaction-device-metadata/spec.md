# transaction-device-metadata Specification

## Purpose

Define local-first receipt-photo and GPS metadata capture for transactions.

## Requirements

### Requirement: Receipt photo capture

The system MUST let users attach, preview, and clear one optional receipt `photoUri` from camera or gallery before saving a transaction.

#### Scenario: Attach receipt photo

- GIVEN the transaction form is open
- WHEN the user selects or captures a permitted image
- THEN the form shows a preview
- AND saving includes the selected `photoUri`

#### Scenario: Clear receipt photo

- GIVEN a transaction form has a selected receipt photo
- WHEN the user clears the photo
- THEN the preview is removed
- AND saving omits `photoUri`

### Requirement: Foreground location capture

The system MUST let users attach and clear optional foreground coordinates as `{ latitude, longitude }` before saving a transaction.

#### Scenario: Attach current location

- GIVEN the transaction form is open
- WHEN the user grants foreground location permission
- THEN the form shows latitude and longitude
- AND saving includes the coordinates

#### Scenario: Clear location

- GIVEN a transaction form has selected coordinates
- WHEN the user clears location
- THEN coordinates are removed from the form
- AND saving omits `location`

## Acceptance Criteria

- Photo and location metadata are optional.
- Permission failures are exposed to the UI without blocking normal transaction save.
