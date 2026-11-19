# Data apps

Source for the Tableau data apps (viz extensions) that demos in this repo embed. Each folder is a
workspace that packages into a `.twbx` and is published to the `embeddingplaybook` site.

| App | Used by | Published to |
|---|---|---|
| `superstore-customer-loyalty` | `src/app/demo/superstore/customer-loyalty` (embeds the *Customer Loyalty Dashboard* view) | superstore › Superstore Data Apps › *Superstore Customer Loyalty* |

## Layout

```
<app>/
  <App Name>.twb                       workbook: one worksheet hosting the extension + wired datasource
  Packages/<package id>/
    manifest.json                      requestedOrigins (external hosts the app may call)
    extensions/data-app.trex           extension manifest
    content/index.html
    content/src/app.js                 the app: live VDS query, rendering, editor settings, host bridge
    content/src/styles.css
    content/src/tableau.extensions.1.latest.min.js   vendored Extensions API (no CDN in the sandbox)
  Resources/.agents/                   spec, design and decision notes for whoever edits it next
```

`Resources/.agents/design.md` describes the queries, loyalty tiers, the `postMessage` contract
with the demo page and the version history. Read it before changing the app.

## Edit, package, publish

1. Edit `content/src/app.js` / `styles.css`.
2. Package: `node data-apps/package.mjs superstore-customer-loyalty` (writes `data-apps/dist/*.twbx`, git-ignored).
3. Publish the `.twbx` over the existing workbook in **Superstore Data Apps** (Tableau MCP
   `publish-workbook` with `overwrite: true`, or upload in Tableau Cloud). Keep the same name so
   the demo's embed URL doesn't change.

Notes:
- Only fields listed in the `.twb`'s datasource can be queried. To add one, re-wire the workbook
  (the Tableau plugin's `wire_datasource.py`) rather than hand-editing the XML.
- The demo's embed JWT must include `tableau:packages:read`, or the app shows
  "sign-in wasn't accepted".
- The site's allowed-origins list is empty, so the app can't fetch external URLs.
