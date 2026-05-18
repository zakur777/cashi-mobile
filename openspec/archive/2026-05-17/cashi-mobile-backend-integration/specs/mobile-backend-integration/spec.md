# Mobile Backend Integration Specification

## Purpose

Define a mobile-side API integration layer that is testable without running backend infrastructure, preserves Expo Go simplicity, and prepares Cashi Mobile for incremental backend adoption without replacing current local storage screens in this slice.

## Acceptance Criteria

- The mobile API layer is configurable for Android runtime environments and does not require hardcoded localhost.
- Typed DTOs and mapping logic exist for categories, transactions, balance, and API errors.
- A fetch-based API client can construct requests for health, categories, transactions, and balance flows (including CRUD where applicable).
- Tests validate mapping and request construction using mocked fetch with no live backend calls.
- No new native dependencies are introduced.
- Existing local storage-driven screens remain the active UX path in this slice.
- No backend/PostgreSQL/Docker/watcher startup is required for this slice.

## Requirements

### Requirement: Configurable API Base URL

The mobile API layer MUST support a configurable backend base URL suitable for Android emulator and physical-device runtime, and MUST NOT depend on hardcoded localhost defaults at runtime.

#### Scenario: Runtime configuration for Android

- GIVEN the app runs on Android emulator or a physical device
- WHEN the API layer resolves its backend endpoint
- THEN it uses configured base URL input and not a hardcoded localhost value

### Requirement: Typed Backend DTO Contract

The mobile API layer MUST define typed DTOs for backend categories, transactions, balance responses, and API error payloads/status mapping.

#### Scenario: Category, transaction, balance, and error typing exists

- GIVEN API response and request shapes for categories, transactions, balance, and error cases
- WHEN the API layer is compiled and tested
- THEN DTO types exist for each shape and are used by the client and mapper boundaries

### Requirement: DTO-to-Domain Mapping

The mobile integration layer MUST provide mappers between backend DTOs and current mobile domain models.

#### Scenario: Numeric and string identifier conversion

- GIVEN backend DTOs with numeric ids
- WHEN data is mapped into mobile domain models
- THEN ids are represented as strings for existing mobile usage
- AND outbound write requests map mobile string ids back to numeric ids

#### Scenario: Date and nullable description mapping

- GIVEN backend transaction DTOs with ISO date strings and nullable descriptions
- WHEN mapping to mobile domain
- THEN date values remain valid for current mobile date handling
- AND null descriptions are mapped to the mobile-safe nullable/empty representation used by current domain logic

#### Scenario: Category type and color mapping

- GIVEN backend category DTOs include type and color fields
- WHEN mapping to mobile category domain objects
- THEN type and color are preserved without lossy transformation

### Requirement: Fetch-based API Client Construction

The mobile integration layer MUST expose a fetch-based API client that constructs requests for health, categories, transactions, and balance endpoints, including CRUD request construction for categories and transactions.

#### Scenario: Endpoint request construction

- GIVEN client calls for health, categories, transactions, and balance operations
- WHEN each call is prepared
- THEN method, path, body, and headers are constructed according to the backend contract

#### Scenario: Error normalization

- GIVEN backend responses with error statuses (including 400, 404, 409, 422, and 500-class failures)
- WHEN the client processes responses
- THEN errors are normalized into predictable typed mobile error outcomes

### Requirement: Mocked-Fetch Test Isolation

The mobile API layer MUST be covered by automated tests that mock fetch and MUST NOT require backend network calls.

#### Scenario: Tests run without backend services

- GIVEN backend, PostgreSQL, Docker, and watchers are not running
- WHEN API-layer tests are executed
- THEN tests pass using mocked fetch and local fixtures only

### Requirement: Expo Go Compatibility

The API-layer slice MUST preserve Expo Go/simple delivery and MUST NOT add new native dependencies.

#### Scenario: Dependency footprint remains JavaScript-only

- GIVEN package and runtime changes in this slice
- WHEN dependency impact is reviewed
- THEN no new native modules are required for API-layer functionality

### Requirement: Local-first UI Preservation for Slice One

This first backend-integration slice MUST NOT replace current local storage screens as the active application behavior.

#### Scenario: Existing local screens remain active

- GIVEN the new API DTO/client/mapper layer exists
- WHEN users navigate current transaction/category/balance screens
- THEN local storage-driven behavior remains the default in this slice

### Requirement: No Backend Startup During API-Layer Slice

Implementation and validation of this slice MUST proceed without starting backend API, PostgreSQL, Docker, or file watchers.

#### Scenario: Offline API-layer preparation

- GIVEN the backend runtime is intentionally stopped
- WHEN the team develops and verifies this slice
- THEN work is completed through typed contracts, mappers, and mocked-fetch tests only
