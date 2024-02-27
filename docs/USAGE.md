# Usage

## Scripts
This section covers "builds"

## Importing UI Components from shadcn

This is what the `components.json` file should contain when interacting with [shadcn](https://ui.shadcn.com/) via CLI such as when installing new UI components or updating existing ones.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "global.css",
    "baseColor": "stone",
    "cssVariables": false,
    "prefix": ""
  },
  "aliases": {
    "components": "components/",
    "utils": "utils/"
  }
}
```
