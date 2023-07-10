# Radipan

Inline `css` prop parser built using [PandaCSS](https://panda-css.com).

## How to use

Add below scripts into your node `package.json`:

```json
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,css}\"",
    "cssgen": "npx radipan cssgen",
    "design": "npx radipan design",
    "prepare": "npx radipan prepare",
    "dev": "npx radipan prepare --watch & next dev",
    "build": "npx radipan cssgen & tsc && next build",
    ...
  }
```
