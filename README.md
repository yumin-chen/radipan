# Radipan

Radipan is a CSS-in-JS engine that allows you to write all your styles in JavaScript. No HTML. No CSS. Just JavaScript!

Radipan uses PandaCSS as the underlying CSS framework and provides an inline `css` prop for styling your components.

## Installation

To use Radipan in your project, you need to install it:

```sh
  npm install radipan
```

Then, create a `radipan.config.ts` (or `.js`) file in the root of your project and add the following configuration options for Radipan:

```javascript
import { defineConfig } from 'radipan/config';

export default defineConfig({
  // Path to app entry point
  appEntry: 'src/App.ts',

  // Whether to use css reset
  preflight: true,

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system in /node_modules
  outdir: '@design-system',
});

```

Finally, add these scripts to your package.json file:

```json
  "scripts": {
    "cssgen": "npx radipan cssgen",
    "design": "npx radipan design",
    "prepare": "npx radipan prepare",
    "dev": "npx radipan prepare --watch & next dev",
    "build": "npx radipan cssgen & tsc && next build",
  }
```

## Examples

Radipan works with various frameworks and tools, such as React, Preact, Vite, Next.js, etc.

- [Radipan + Vite + React + TypeScript Starter (radipan-vite-react-ts)](https://github.com/yumin-chen/radipan-vite-react-ts)

(More coming soon...)

## Usage

To create a component with Radipan, you can use the `radipan` function and pass in the element type as an argument. For example:

```javascript
radipan('div').create({ css: { color: 'red' } }, 'whee!')); // Red whee!
```

This returns a *Creatable* object that has a `create` method. You can use this method to specify the `props` and `children` of your component.

When you run npx radipan cssgen, it will scan all `css` props in your app and generate the corresponding CSS code at build time according to your [radipan.config.ts](/radipan.config.ts) file.
