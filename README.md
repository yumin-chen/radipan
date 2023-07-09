# Radipan

Inline `css` prop parser built using [PandaCSS](https://panda-css.com).

## How to use

Add below scripts into your node `package.json`:

```json
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,css}\"",
    "cssgen": "CSSGEN=pregen npx tsx --tsconfig node_modules/radipan/extractor.tsconfig.json node_modules/radipan/dist/css-extractor/radipan.ts & npm run cssgen-build",
    "cssgen-watch": "CSSGEN=pregen npx tsx watch --tsconfig node_modules/radipan/extractor.tsconfig.json node_modules/radipan/dist/css-extractor/radipan.ts & npm run cssgen-build --watch",
    "cssgen-build": "panda cssgen",
    "design": "panda studio",
    "prepare": "panda codegen & npm run cssgen",
    "dev": "panda codegen & npm run cssgen-watch & next dev",
    "build": "panda cssgen-build & tsc && next build",
    ...
  }
```
