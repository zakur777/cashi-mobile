# SDD Explore — cashi-mobile-backend-integration

## Status

explored

## Executive summary

The backend at `C:/Users/walte/Documents/Proyects/desarrollo web 2/cashi-app` was inspected read-only. The backend was not started. It is a Node.js + TypeScript ESM API built with Hono, Prisma, PostgreSQL, Zod, and Vitest.

The API exposes global, unauthenticated REST endpoints for categories, transactions, and balance. Mobile integration is feasible, but there are contract mismatches that must be handled deliberately before live backend testing.

## Backend stack

- Runtime: Node.js 20+
- Framework: Hono
- ORM/DB: Prisma + PostgreSQL
- Validation: Zod
- Tests: Vitest
- Architecture: routes -> controllers -> repositories -> Prisma/database
- Auth: none found
- CORS: no middleware found

## Endpoint summary

| Method | Path                    | Notes                                                           |
| ------ | ----------------------- | --------------------------------------------------------------- |
| GET    | `/`                     | API status: `{ name: 'cashi-api', status: 'running' }`          |
| GET    | `/health`               | Health: `{ status: 'ok' }`                                      |
| GET    | `/categories`           | Returns `Category[]`, ordered by id asc                         |
| GET    | `/categories/:id`       | Numeric id; 404 if missing                                      |
| POST   | `/categories`           | Body `{ name: string }`; 201; 400 validation; 409 duplicate     |
| PATCH  | `/categories/:id`       | Partial `{ name?: string }`; 404/409 possible                   |
| DELETE | `/categories/:id`       | 200 deleted category; 422 if referenced by transactions         |
| GET    | `/transactions`         | Returns all transactions with category; no pagination/filtering |
| GET    | `/transactions/balance` | Global totals `{ totalIncome, totalExpense, balance }`          |
| GET    | `/transactions/:id`     | Numeric id; includes category; 404 if missing                   |
| POST   | `/transactions`         | Body `{ amount, type, description?, date, categoryId }`; 201    |
| PATCH  | `/transactions/:id`     | Partial transaction update; empty description becomes undefined |
| DELETE | `/transactions/:id`     | 200 deleted transaction; 404 if missing                         |

## Contract mapping to Cashi Mobile

### Category

Backend:

```ts
{
  id: number;
  name: string;
}
```

Mobile currently:

```ts
{
  id: string;
  name: string;
  type: "income" | "expense";
  color: CategoryColor;
}
```

Mismatch: backend categories do not include `type` or `color`, and ids are numeric.

### Transaction

Backend:

```ts
{
  id: number;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string; // ISO
  categoryId: number;
  category: {
    id: number;
    name: string;
  }
}
```

Mobile currently uses string ids, string categoryId, categoryName/categoryColor projections, and CLP formatting without decimals.

### Balance

Backend:

```ts
{
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
```

Mobile can map directly for totals, but backend balance is global only: no user/account/date range.

## Integration risks and gaps

- No auth/user scope: all data is global.
- No CORS middleware: native Expo Go fetch is OK, but Expo Web would need CORS.
- Android networking needs explicit base URL strategy: emulator `10.0.2.2:3000`, LAN IP for physical device, or tunnel.
- Backend uses numeric ids; mobile currently uses strings.
- Backend categories lack `type` and `color`; mobile UI depends on both.
- No pagination/filtering/sorting for transactions.
- Money serializes as JS number from Prisma Decimal; mobile should keep display formatting centralized.
- Invalid path ids may produce backend edge errors if not validated before Prisma.

## Recommended integration strategy without starting backend

1. Add a typed mobile API contract layer using backend response/request shapes.
2. Add configurable API base URL; do not hardcode localhost.
3. Add mappers between backend DTOs and mobile domain:
   - numeric id -> string id for React keys/navigation
   - ISO date -> existing date string handling
   - nullable description -> safe display fallback
   - category type/color fallback strategy until backend supports those fields
4. Introduce a repository/service boundary so screens/hooks can switch from local storage to backend API cleanly.
5. Start with read flows: health, categories, transactions, balance.
6. Then wire mutations: create/update/delete categories and transactions.
7. Only after code is ready, start backend and validate Android network access.

## Files inspected

- Backend `README.md`, `package.json`, `.env.example`, `docker-compose.yml`
- `prisma/schema.prisma`
- `src/index.ts`
- `src/routes/*`
- `src/controllers/*`
- `src/schemas/*`
- `src/repositories/*`
- backend Vitest HTTP tests

## Next recommended

Create proposal/spec/design/tasks for `cashi-mobile-backend-integration`, then implement mobile-side API types/client/mappers with tests before starting the backend.
