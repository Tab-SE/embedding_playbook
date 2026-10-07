# Hosted Tableau MCP — OAuth 2.1 Architecture

## What this branch does

The `hosted-mcp-oauth` branch replaces the self-hosted Tableau MCP passthrough server with Tableau's own hosted MCP service at `mcp.tableau.com`. The key difference is authentication: the self-hosted server accepted a Tableau REST session token (`X-Tableau-Auth`), while `mcp.tableau.com` requires a proper OAuth 2.1 Bearer token issued by Tableau's SSO service.

---

## How the self-hosted approach worked (before this branch)

```
Browser → Next.js app → TABLEAU_MCP_URL (your Railway MCP server) → Tableau Cloud REST API
```

The Next.js app forwarded the user's existing Tableau REST session token (`rest_key`) as `X-Tableau-Auth` to your self-hosted MCP server. That server called Tableau's REST API on behalf of the user. No separate OAuth flow needed — the user was already authenticated to Tableau via the Connected App JWT during demo login.

---

## How the hosted approach works (this branch)

```
Browser → Next.js app → https://mcp.tableau.com → Tableau Cloud REST API
```

`mcp.tableau.com` is Tableau's own MCP infrastructure. It only accepts OAuth 2.1 Bearer tokens issued by `sso.online.tableau.com`. The Connected App REST token from demo login is a different credential and is rejected.

---

## OAuth 2.1 with CIMD (Client ID Metadata Documents)

Instead of pre-registering an OAuth client app in Tableau Cloud (which would give you a `client_id` and secret), this implementation uses **CIMD** — a newer MCP spec feature where the `client_id` is a URL pointing to a publicly hosted JSON document containing the client's metadata.

**How CIMD works:**

1. The Next.js app hosts a metadata document at:
   ```
   https://hostedmcp.up.railway.app/api/tableau/oauth/client-metadata.json
   ```

2. The `client_id` sent in the OAuth authorization request **is that URL itself**.

3. When Tableau's SSO server receives an authorization request with a URL-shaped `client_id`, it fetches the document from that URL to discover the client's allowed redirect URIs and other metadata.

4. If the document's `client_id` matches the URL it was fetched from, and the `redirect_uri` in the request matches one in the document — the OAuth flow proceeds.

5. No manual registration in Tableau Cloud admin required. The metadata document IS the registration.

```json
{
  "client_id": "https://hostedmcp.up.railway.app/api/tableau/oauth/client-metadata.json",
  "client_name": "Tableau Embedded Analytics Demo",
  "redirect_uris": ["https://hostedmcp.up.railway.app/api/tableau/oauth/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "none"
}
```

---

## Full OAuth flow

```
User opens chat panel
        ↓
WelcomeMessage fetches /api/tableau/oauth/status
        ↓
Status: required=true, ready=false
        ↓
"Connect to Tableau" button appears
        ↓
User clicks → browser navigates to /api/tableau/oauth?return_to=/demo/xxx
        ↓
Server generates PKCE code_verifier + code_challenge, stores state in cookie
        ↓
Server redirects to:
https://sso.online.tableau.com/oauth2/authorize
  ?client_id=https://hostedmcp.up.railway.app/api/tableau/oauth/client-metadata.json
  &redirect_uri=https://hostedmcp.up.railway.app/api/tableau/oauth/callback
  &scope=tableau:mcp:datasource:read tableau:mcp:workbook:read ...
  &code_challenge=<S256 hash>
  &resource=https://mcp.tableau.com
        ↓
Tableau SSO fetches CIMD document from client_id URL ✓
Validates redirect_uri matches document ✓
        ↓
User authenticates with their Tableau Cloud credentials
        ↓
Tableau SSO redirects to:
https://hostedmcp.up.railway.app/api/tableau/oauth/callback?code=...&state=...
        ↓
Callback validates state cookie, exchanges code for access_token + refresh_token
Tokens stored in server memory
        ↓
Callback redirects user back to /demo/xxx (original page)
        ↓
User is back on the demo — chat now works
```

---

## Token storage and lifecycle

- **In memory**: The access token and refresh token live in a module-level variable in `tableau-oauth.ts`. They survive for the lifetime of the Railway server process.
- **Refresh**: Access tokens expire (~1 hour). The `getAccessToken()` function automatically refreshes using the stored refresh token before expiry.
- **Persistence across restarts**: Set `TABLEAU_MCP_OAUTH_REFRESH_TOKEN` as a Railway environment variable. On startup, `seedFromEnv()` pre-populates the token cache so no OAuth flow is needed after a restart.
- **Per-server, not per-user**: One OAuth token covers all demo users on the same server. The token authenticates the server as the Tableau user who completed the OAuth flow (the demo admin), not as individual demo users.

---

## Why localhost can't complete the flow

The CIMD document at `hostedmcp.up.railway.app` lists only the Railway callback URL. When a user clicks "Connect to Tableau" from `localhost:3000`, the OAuth flow redirects through Tableau SSO and back to `hostedmcp.up.railway.app/api/tableau/oauth/callback` — not back to localhost. The state cookie (set on localhost) can't be read by the Railway callback, causing a state mismatch error.

**For local development**, use one of:
1. Test directly at `hostedmcp.up.railway.app`
2. Complete OAuth there once, copy `TABLEAU_MCP_OAUTH_REFRESH_TOKEN` to `.env.development`
3. Register a Tableau OAuth 2.0 Connected App with `localhost` redirect URI and set `TABLEAU_MCP_OAUTH_CLIENT_ID`

---

## Key env vars

| Variable | Where | Purpose |
|---|---|---|
| `TABLEAU_MCP_URL` | Railway pr-244 | Set to `https://mcp.tableau.com` |
| `TABLEAU_MCP_CIMD_BASE_URL` | Local `.env.development` | Set to `https://hostedmcp.up.railway.app` for local dev |
| `TABLEAU_MCP_OAUTH_REFRESH_TOKEN` | Railway pr-244 | Persist the OAuth refresh token across restarts |
| `TABLEAU_MCP_OAUTH_CLIENT_ID` | Local `.env.development` (optional) | Pre-registered client ID for local OAuth |

---

## Key files

| File | Purpose |
|---|---|
| `src/app/api/chat/agent/tableau-oauth.ts` | Token management: exchange, refresh, cache |
| `src/app/api/tableau/oauth/route.ts` | Initiates PKCE OAuth flow |
| `src/app/api/tableau/oauth/callback/route.ts` | Receives auth code, exchanges for tokens |
| `src/app/api/tableau/oauth/client-metadata.json/route.ts` | Serves the CIMD document |
| `src/app/api/tableau/oauth/status/route.ts` | Returns `{ready, required}` for the chat UI |
| `src/app/api/chat/agent/mcp.ts` | Routes demos to MCP servers, detects `mcp.tableau.com` and uses OAuth mode |
| `src/components/Agent/ui/MiniThread.jsx` | Shows "Connect to Tableau" button when OAuth is needed |

---

## How `mcp.tableau.com` auth differs from the self-hosted server

| | Self-hosted (`embeddingplaybook-mcp-passthrough`) | Hosted (`mcp.tableau.com`) |
|---|---|---|
| Auth header | `X-Tableau-Auth: <REST session token>` | `Authorization: Bearer <OAuth access token>` |
| Token source | Connected App JWT → Tableau REST signin → `rest_key` | PKCE OAuth flow → `sso.online.tableau.com` |
| Client registration | None needed | CIMD (self-hosted metadata doc) |
| Per-user auth | Yes (each user's own REST token) | No (server-level OAuth token) |
| Local dev | Works out of the box | Requires CIMD base URL or pre-registered client |
