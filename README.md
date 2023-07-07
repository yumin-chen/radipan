# Radipan

Inline `css` prop parser built using [PandaCSS](https://panda-css.com).

## How to use

Add below scripts into your node `package.json`:

```json
  "scripts": {
    "cssgen": "CSSGEN=pregen npx tsx --tsconfig node_modules/radipan/extractor.tsconfig.json css-extractor.ts",
    "cssgen-watch": "CSSGEN=pregen npx tsx watch --ignore *.css.js --tsconfig node_modules/radipan/extractor.tsconfig.json css-extractor.ts",
    "cssgen-build": "panda cssgen -c ./node_modules/radipan/panda.config.ts",
    "prepare": "panda codegen -c ./node_modules/radipan/panda.config.ts & npm run cssgen",
    "dev": "npm run cssgen-watch & next dev",
    "build": "npm run cssgen-build & next build",
    ...
  }
```

