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
3. Set environment variables for Convex (if needed):
   ```bash
   fly secrets set VITE_CONVEX_URL=<your-convex-url>
   ```
4. Deploy:
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
3. Copy the production URL and set it in Fly.io:
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
