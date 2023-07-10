# Radipan

Inline `css` prop parser built using [PandaCSS](https://panda-css.com).

## How to use

Add below scripts into your node `package.json`:

```json
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,css}\"",
    "cssgen": "npx radipan css-extract & npm run cssgen-build",
    "cssgen-watch": "npx radipan css-extract --watch & npm run cssgen-build --watch",
    "cssgen-build": "panda cssgen",
    "design": "panda studio",
    "prepare": "panda codegen & npm run cssgen",
    "dev": "panda codegen & npm run cssgen-watch & next dev",
    "build": "panda cssgen-build & tsc && next build",
    ...
  }
```
