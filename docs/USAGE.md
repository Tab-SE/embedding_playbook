# Usage

## Scripts

This project relies on [Nodejs](https://nodejs.org/en), the backend used by [React](https://react.dev/). Therefore,
operations such as installing dependencies, starting a development server, running a production build, etc., use
the [Node Package Manager](https://www.npmjs.com/) `npm`. To use `npm` you must use a terminal or shell. These instructions
assume that you are working on a UNIX system. If you are using Windows consider using something like [Gitbash](https://gitforwindows.org/).

Project scripts are declared in a file called [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) located in the root of the project under a section called "scripts":
```json
"scripts": {
  "dev": "next lint && next dev",
  "build": "next build",
  "export": "next export",
  "start": "next start",
  "lint": "next lint",
  "info": "next info",
  "demo": "next build && next start",
  "save": "git add pages public && git commit -m 'saving content (/public & /pages)'",
  "revert": "git reset HEAD -- .",
  "upload": "git push"
},
```

To run these scripts you would type in your shell:
```sh
npm run dev
```

### Demo Scripts
- `demo` creates a production build and starts the server, useful for a demo with local config (uses `env.production.local`)
- `dev` runs a development server to demo changes live (uses `env.development.local`)

### Developer Scripts
- `dev` runs a development server to write new code or test what your article would look like (uses `env.development.local`)
- `build` creates a local production build to simulate what this would look like in production (uses `env.production.local`)
- `start` runs the local production build which is useful for demos
- `lint` runs the Javascript code through [eslint](https://eslint.org/)
- other scripts are not as useful to describe
  
### Writing Scripts
- `save` saves changes made to the `public/` and `pages/` folder containing markdown and images
- `revert` removes the last change that was saved
- `upload` pushes your changes to your remote branch on Github or similar
  

## Importing UI Components from shadcn

This is what the `components.json` file should contain when interacting with [shadcn](https://ui.shadcn.com/) via CLI such as when installing new UI components or updating existing ones.

> NOTE: Placed in the project root only when running CLI operations, delete once done. 
> Otherwise it will interfere with imports from components/ folder:

`components.json`
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
