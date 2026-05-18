# Proposal: Backend Integration

## Intent

Connect Cashi Mobile to the Cashi backend API after aligning the backend Category contract with the mobile domain. The integration should keep Expo Go delivery, avoid starting backend services until the mobile API layer is ready, and preserve the current local-first UI behavior during incremental implementation.

## Current backend contract decision

Backend `Category` is being updated in `cashi-app` to include:

```ts
{
  id: number;
  name: string;
  type: "income" | "expense";
  color: "#281C59" | "#4E8D9C" | "#85C79A" | "#EDF7BD";
}
```

This removes the main mismatch with Cashi Mobile's category model. Mobile still needs DTO mappers because backend ids are numeric while mobile routes and local entities currently use strings.

## Scope

### In scope

- Add typed backend DTOs in Cashi Mobile.
- Add configurable API base URL for Android Expo Go.
- Add a small fetch-based API client with normalized error handling.
- Add mappers:
  - backend numeric ids -> mobile string ids
  - mobile string ids -> backend numeric ids for requests
  - ISO date strings -> current mobile date display/request strings
  - backend category `type`/`color` -> mobile category fields
- Add tests for DTO mapping and client request construction with mocked fetch.
- Prepare read integration plan for:
  - `/health`
  - `/categories`
  - `/transactions`
  - `/transactions/balance`
- Prepare mutation integration plan for category/transaction create/update/delete.

### Out of scope for the next mobile step

- Starting backend, PostgreSQL, or Docker before mobile API layer is ready.
- Auth/user scoping.
- Backend pagination/filtering.
- Replacing all local storage flows in one large diff.
- Moving away from Expo Go.

## Constraints

- Android-first Expo Go.
- Backend may not be running during implementation; use tests/mocks first.
- No hardcoded `localhost` for Android runtime.
- Keep error messages user-friendly and map backend `400/404/409/422/500` into predictable mobile states.
- Keep work in reviewable slices.

## Risks

- Android emulator and physical devices need different base URLs.
- Backend has no auth or user scope, so live data is global.
- Backend balance is global and not date-ranged.
- Numeric backend ids need careful conversion to avoid route/category lookup bugs.
- Backend migration must be applied before live mobile testing.

## Success criteria

- Backend contract includes category `type` and `color` before live mobile integration.
- Mobile API layer has typed DTOs, mappers, and tests.
- Mobile can switch to backend read flows behind a clear boundary.
- Backend is only started after the client layer and tests are ready.
