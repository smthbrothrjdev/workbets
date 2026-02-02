# Deployment

## Fly.io (Web App)

### Prerequisites
- Fly.io account and CLI installed.
- A working Vite + React build.

### Steps
1. Initialize Fly configuration:
   ```bash
   fly launch
   ```
2. Configure the builder for static assets (example):
   - Use a Dockerfile or a buildpack that runs `npm run build` and serves `dist/`.
   - Ensure `VITE_CONVEX_URL` is available at build time (Vite inlines it into the bundle):
     - Docker/Fly: add a build arg and environment variable (see `Dockerfile`) and pass it:
       ```bash
       export VITE_CONVEX_URL=<your-convex-url>
       fly deploy --build-arg VITE_CONVEX_URL="$VITE_CONVEX_URL"
       ```
       **zsh users:**
       ```zsh
       export VITE_CONVEX_URL=<your-convex-url>
       fly deploy --build-arg VITE_CONVEX_URL="$VITE_CONVEX_URL"
       ```
       Use your secret manager/CI secret to populate `VITE_CONVEX_URL` so it never lives in source control.
     - CI build: export it before running `npm run build`:
       ```bash
       export VITE_CONVEX_URL=<your-convex-url>
       npm run build
       ```
       **zsh users:**
       ```zsh
       export VITE_CONVEX_URL=<your-convex-url>
       npm run build
       ```
3. (Optional) Set runtime environment variables for Convex (if needed):
   ```bash
   fly secrets set VITE_CONVEX_URL=<your-convex-url>
   ```
4. Verify the built assets include the Convex URL:
   ```bash
   rg --no-line-number "<your-convex-url>" dist/assets
   ```
5. Deploy:
   ```bash
   fly deploy
   ```

## Convex

### Prerequisites
- Convex project created.
- Convex CLI installed.

### Steps
1. Initialize Convex in the repo:
   ```bash
   npx convex dev
   ```
2. Create a production deployment:
   ```bash
   npx convex deploy
   ```
3. Copy the production URL and set it in Fly.io (build-time and/or runtime as needed):
   ```bash
   fly secrets set VITE_CONVEX_URL=<production-convex-url>
   ```

## Porkbun (Domain + DNS)

### Steps
1. Purchase or select your domain in Porkbun.
2. Add a DNS record pointing to Fly.io:
   - Create a CNAME or A record as recommended by Fly.io.
3. In Fly.io, add the custom domain:
   ```bash
   fly certs add yourdomain.com
   ```
4. Verify the certificate:
   ```bash
   fly certs show yourdomain.com
   ```
5. Wait for DNS propagation, then confirm the site loads over HTTPS.
