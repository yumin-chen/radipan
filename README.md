# Radipan

Inline `css` prop parser built on top of [PandaCSS](https://panda-css.com). All-in-JS template engine for you to write everything in JavaScript. No more HTML. No more CSS. Only JavaScript!

## Setup

Install radipan to your existing project:

```sh
  npm install radipan
```

Add below scripts into your `package.json`:

```json
  "scripts": {
    "cssgen": "npx radipan cssgen",
    "design": "npx radipan design",
    "prepare": "npx radipan prepare",
    "dev": "npx radipan prepare --watch & next dev",
    "build": "npx radipan cssgen & tsc && next build",
  }
```
