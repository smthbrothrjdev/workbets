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

### Managing the Convex URL securely (local + CI)

Use a secret manager or CI secrets to provide `VITE_CONVEX_URL` so it is not
committed to the repo. Prefer a dedicated local key store (1Password CLI,
Doppler, or your OS keychain) over plaintext `.env` files.

**Local development**
1. Store the Convex deployment URL in your secret manager (1Password, Doppler,
   etc.).
2. Populate `VITE_CONVEX_URL` before starting the app (or write it to
   `.env.local`, which is ignored by Git):
   ```bash
   export VITE_CONVEX_URL="https://<your-deployment>.convex.cloud"
   ```
   **zsh users:** add this to your session or `.zshrc`:
   ```zsh
   export VITE_CONVEX_URL="https://<your-deployment>.convex.cloud"
   ```
3. Run the app as usual:
   ```bash
   npm run dev
   ```

**CI / production builds**
1. Add `VITE_CONVEX_URL` as a CI secret in your provider settings (e.g., GitHub
   Actions → Repository settings → Secrets and variables → Actions → New
   repository secret).
2. Export it in the build step of your CI workflow so Vite can inline it:
   ```bash
   export VITE_CONVEX_URL="$VITE_CONVEX_URL"
   npm run build
   ```
3. For Fly Docker builds, pass it as a build arg in the deploy step:
   ```bash
   fly deploy --build-arg VITE_CONVEX_URL="$VITE_CONVEX_URL"
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
