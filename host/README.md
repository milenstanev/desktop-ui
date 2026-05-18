# Host App (Module Federation Demo)

Minimal host application that consumes the desktop-ui remote via Webpack Module Federation.

## Usage

1. Start the remote (desktop-ui) on port 3000:
   ```bash
   cd .. && npm run build && npx serve -s build -l 3000
   ```

2. Start the host on port 3001:
   ```bash
   npm run start
   ```

3. Open http://localhost:3001 — the host loads and renders the full desktop-ui App from the remote.

## Environment

- `REMOTE_URL` or `DESKTOP_UI_REMOTE_URL` — public URL of the **deployed desktop-ui** app (no trailing slash). The host loads `{URL}/remoteEntry.js`.
- Local dev default: `http://localhost:3000` (when `webpack serve` runs in development).
- Production builds **fail** if this is missing or points at localhost.

Set via `host/.env.production`, Vercel env vars, or the deploy script below.

## Vercel Deploy (Host)

Create a **separate Vercel project** for the host:

1. **Root Directory:** `host`
2. **Environment variable (Production):**  
   `REMOTE_URL` = `https://your-desktop-ui.vercel.app`  
   (same URL as the main desktop-ui deployment that exposes `remoteEntry.js`)

Redeploy after changing `REMOTE_URL` — it is baked into the HTML at build time.

**CLI from repo root:**

```bash
npm run host:deploy:vercel -- --remote-url https://desktop-ui-eight.vercel.app
```

Preview:

```bash
npm run host:deploy:vercel:preview -- --remote-url https://desktop-ui-eight.vercel.app
```
