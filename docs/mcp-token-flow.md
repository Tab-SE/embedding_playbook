# MCP Auth Token Flow

How a user's identity becomes the auth header sent to the Tableau MCP server.

We use **one auth mode — passthrough** — for every Tableau site, wired up in
`src/app/api/chat/agent/mcp.ts`:

| Mode | Header sent to MCP | Token is… | Used by |
|------|--------------------|-----------|---------|
| **passthrough** | `X-Tableau-Auth: <rest_key>` | A live Tableau REST **session credentials token** (`rest_key`) | main, eacanada, ubl |

---

## What is the token?

### `rest_key`
**Not a JWT.** It's the opaque **REST session token** Tableau hands back from
`POST /api/<v>/auth/signin`. It looks like `xxxxxx|siteId|userId|...` (pipe-delimited),
is tied to a live ~2 hr Tableau session, and is what `X-Tableau-Auth` headers normally carry.
The MCP server uses it as-is to act as that user.

---

## Sequence: how `rest_key` reaches the `X-Tableau-Auth` header

```mermaid
sequenceDiagram
    autonumber
    actor U as User (browser)
    participant NA as NextAuth<br/>[...nextauth]/options.ts
    participant SM as SessionModel / handleJWT<br/>models/Session/controller.ts
    participant CR as jwtSign<br/>libs/crypto.js
    participant TAB as Tableau Cloud<br/>/api/v/auth/signin
    participant JWT as NextAuth JWT cookie
    participant API as Chat route<br/>api/chat/route.ts
    participant MCPB as getTableauMcpTools<br/>agent/mcp.ts
    participant MCP as Tableau MCP server

    U->>NA: sign in (demo id + demo name)
    NA->>SM: authorize() → session.jwt(email, scopes, uaf)
    SM->>CR: jwtSign(email, restOptions, restScopes, uaf)
    CR-->>SM: Connected App JWT (HS256, 9 min)
    SM->>TAB: POST /auth/signin { credentials.jwt }
    TAB-->>SM: credentials.token  ← this IS the rest_key
    SM-->>NA: { rest_key, site_id, expires, ... }
    NA->>JWT: jwt callback stores token.tableau.rest_key
    JWT-->>U: signed session cookie (rest_key inside)

    Note over U,MCP: ── later: user sends a chat message ──

    U->>API: POST /api/chat (cookie)
    API->>MCPB: getTableauMcpTools(demo, token)
    MCPB->>MCPB: site = DEMO_SITE[demo]; wiring = siteWiring(site)
    MCPB->>MCPB: restKey = token[tokenKey].rest_key
    MCPB->>MCPB: headers["X-Tableau-Auth"] = restKey
    MCPB->>MCP: MultiServerMCPClient { url, http, headers }
    MCP->>TAB: uses rest_key to act as the user
```

---

## Caveat: on-demand (ODA) users

Passthrough works for all users **except on-demand access (ODA) users.** The MCP server
validates the `rest_key` by calling Tableau's `/sessions/current`, and Tableau Cloud
returns **HTTP 500** for ODA-ephemeral sessions (an undocumented upstream bug). For ODA
users the session can't be validated, so MCP calls fail.

Provisioned (non-ODA) users — including non-admins — pass `/sessions/current` validation
fine, so passthrough is the right mode for them.

---

## File map

| Step | File | Symbol |
|------|------|--------|
| User login / providers | `src/app/api/auth/[...nextauth]/options.ts` | `CredentialsProvider`, `jwt` callback |
| Orchestrates signin | `src/models/Session/controller.ts` | `handleJWT()` |
| Mints Connected App JWT | `src/libs/crypto.js` | `jwtSign()` |
| Calls Tableau `/auth/signin` | `src/libs/requests.js` | `tabAuthJWT()` → `rest_key` |
| Builds MCP header + client | `src/app/api/chat/agent/mcp.ts` | `getTableauMcpTools()` |
| MCP server URL | `.env.*` | `TABLEAU_MCP_URL[_EACANADA/_UBL]` |
