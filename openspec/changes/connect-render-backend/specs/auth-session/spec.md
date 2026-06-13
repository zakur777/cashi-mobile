# auth-session Specification

## Purpose

Define authenticated production API sessions for Cashi Mobile.

## Requirements

### Requirement: Production API configuration

The system MUST use `EXPO_PUBLIC_API_URL` as the production API base URL and MUST document the Render URL used for manual verification.

#### Scenario: Configured base URL

- GIVEN `EXPO_PUBLIC_API_URL=https://cashi-api-pphe.onrender.com`
- WHEN the app sends an API request
- THEN the request targets that base URL
- AND no demo credential is hardcoded in app logic

### Requirement: Login session lifecycle

The system MUST authenticate with `POST /auth/login`, persist the returned JWT in SecureStore, bootstrap from it at startup, and clear it on logout.

#### Scenario: Existing login screen signs in

- GIVEN the user enters email and password in the existing login screen
- WHEN `/auth/login` returns `{ token }`
- THEN the token is saved in SecureStore
- AND the user is routed to authenticated transaction content

#### Scenario: Startup bootstrap and logout

- GIVEN a token is already saved in SecureStore
- WHEN the app opens
- THEN the app skips login after auth initialization
- WHEN the user logs out
- THEN the token is removed and login is shown

### Requirement: Authenticated API transport

The system MUST attach `Authorization: Bearer <token>` to protected requests and MUST centralize base URL, headers, and error handling in the API service boundary.

#### Scenario: Protected request headers

- GIVEN an authenticated session
- WHEN categories, transactions, balance, or upload are requested
- THEN each request includes `Authorization: Bearer <token>`

#### Scenario: Error messages

- GIVEN a network failure or HTTP error
- WHEN the API service reports the error
- THEN network failures surface `Error de conexión`
- AND HTTP errors surface `body.error` when present

### Requirement: Registration service availability

The system MUST expose a typed `POST /auth/register` service even if no registration screen exists yet.

#### Scenario: Missing screen is documented

- GIVEN no registration route is implemented
- WHEN manual verification documentation is reviewed
- THEN it states how registration is available through the typed auth service or backend tooling
