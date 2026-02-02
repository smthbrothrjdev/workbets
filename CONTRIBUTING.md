# Contributing to Work Bets

Reminder: this project uses [Convex](https://docs.convex.dev/) for the backend
data model and queries. Use the workflow below to keep schema, data, and UI in
sync.

## Quick start

```bash
npm install
```

Start the Convex dev server (this provisions your database, watches schema and
functions, and prints your deployment URL):

```bash
npx convex dev
```

In a separate terminal, run the Vite app with the Convex URL:

```bash
export VITE_CONVEX_URL="https://<your-deployment>.convex.cloud"
npm run dev
```

## Working with Convex

### Schema updates

1. Update `convex/schema.ts` with normalized tables and indexes.
2. Run `npx convex dev` to push changes locally.
3. Use `npx convex deploy` when you are ready to promote to a production
   deployment.

### Demo data

The app seeds demo content with `seedDemoData` on first load. To re-seed from
the CLI:

```bash
npx convex run seed:seedDemoData
```

### Queries & mutations

* Add new query/mutation functions in `convex/` (e.g. `convex/queries.ts`).
* Consume them from the frontend using:

```js
import { api } from "convex/_generated/api";
```

### Recommended workflow

1. Start `npx convex dev` and keep it running.
2. Update Convex functions or schema in `convex/`.
3. Update UI logic in `src/`.
4. Confirm the app updates in the browser.
5. Run `npm run lint` and `npm run test` before opening a PR.
