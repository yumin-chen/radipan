# Radipan

_The missing `css` prop API for [🐼 PandaCSS](https://panda-css.com)._

Radipan is an all-in-JS CSS-in-JS engine. With Radipan, you can write all your styles in JavaScript without the need for HTML or CSS.

## How it works

Radipan runs your code during build time and scan the entry component and its child nodes for inline `css` props and transforms these props into intermediate PandaCSS code (`css`, `cva`, etc.), which generates static CSS code.

### • Why?

Radipan supports the widely adopted inline `css` prop syntax that made popular by libraries like [Emotion.js](https://emotion.sh/docs/css-prop), [Stitches.js](https://stitches.dev/docs/overriding-styles#the-css-prop) and [Mitosis](https://mitosis.builder.io/), etc...

## Features

- [HyperScript](https://github.com/hyperhype/hyperscript)-compatible API
  - `h(tag, attrs, [text?, Elements?,...])`
- JSX-compatible API
- Built-in transpiler that transforms `css` prop into its resulting `className` prop at build time, and generates `.lite.ts` files (coming soon...)
- Recipe Shaking Optimization (coming soon...)

## Setup

To set up Radipan in your project, follow these steps:

### Installation

Use your preferred package manager to install Radipan:

```bash
npm install --save-dev radipan@latest
```

### Configure Radipan

Create a file named `radipan.config.ts` (or `.js`) file in the root of your project and add these configuration options for Radipan:

```javascript
import { defineConfig } from 'radipan/config';

export default defineConfig({
  appEntry: 'src/App.ts', // Path to app entry point
  jsxFramework: 'react', // 'react' | 'solid' | 'preact' | 'vue' | 'qwik'
  preflight: true, // Whether to use css reset
  recipeShaking: true, // Whether to trim unused recipe variants
  theme: {
    // Useful for theme customization
    extend: {},
  },
  outdir: '@design-system', // The output directory in /node_modules
});
```

The available Radipan options are as follows:

- `appEntry`: Specify the path to the entry point component(s) of your application, considering the routing structure. For a single entry point, use a string value (e.g., `'src/App.ts'`). For multiple entry points, use an array (e.g., `['src/App.ts', 'src/page-1.ts', 'src/page-2.ts']`).
- `jsxFramework`: Specify the UI framework being used in your project.
- `recipeShaking`: Enable this option to automatically remove unused recipe variants during build time. Disable it if you need to dynamically change a recipe variant.
- `outdir`: Specify the output directory within `/node_modules` where Radipan will generate its output. Default is `@design-system`.

### Update package.json scripts

Update your `package.json` scripts to work with Radipan:

```json
  "scripts": {
    "cssgen": "npx radipan cssgen",
    "prepare": "npx radipan prepare",
    "dev": "npx radipan prepare --watch & next dev",
    "build": "npx radipan cssgen & tsc && next build",
  }
```

The `prepare` script runs codegen after dependency installation and regenerates the output directory.

### Configure the entry CSS with layers

Create an entry CSS file or replace the existing one named `index.css` (or `global.css`), usually under the `src` or `src/app` folder, with this code:

```css
@layer reset, base, tokens, recipes, utilities;

/* Import generated Radipan static CSS */
@import 'radipan/styles.css';
```

When you run `npx radipan cssgen`, it scans all `css` props in your app and statically generates the corresponding CSS code at build time.

### JSX Configuration for TypeScript

Follow the below steps to use Radipan with JSX in TypeScript if you prefer to use JSX syntax. You can skip this step if you don't use JSX.

Configure the `compilerOptions` in TSConfig (usually `tsconfig.json`) with the following settings:

```json
"jsx": "react-jsx",
"jsxImportSource": "radipan"
```

This requires the new JSX transform and the `jsxImportSource` option, which are available in TS 4.1 or later.

If you are using a UI framework other than React, you also need to change the `jsxFramework` setting in your `radipan.config.ts` file to match your framework. For example, if you are using Solid.js, you should set `jsxFramework: 'solid'`. This ensures that your JSX code is transpiled correctly for your framework.

With this configuration, you can now use the object syntax to define styles and pass them to your components using the `css` prop!

```javascript
function App() {
  return (
    <main
      css={{
        width: '100%',
        height: '100vh',
        color: { base: 'black', _osDark: 'white' },
        background: { base: 'white', _osDark: 'black' },
      }}
    >
      <div css={{ fontSize: '2xl', fontWeight: 'bold' }}>Hello Radip🐼n!</div>
    </main>
  );
}
```

#### With the old JSX transform

If you're on an older version of React / TypeScript and unable to use the newer `react-jsx` transform, you will need to set the `jsxFactory` TSConfig option to `"radipan.h"`, or specify the JSX factory at the top of every file:

```javascript
/** @jsx h */
import { h } from 'radipan';
```

## Usage

Radipan comes with HyperScript-compatible API, which you can import and use like `h(tag, attrs, [text?, Elements?,...])`:

```javascript
import { h } from 'radipan';

function App() {
  return h('div', { css: { color: 'red' } }, 'whee!')); // Red whee!
}

```

You can also use Radipan's own `withCreate` function, which comes with a more verbose `create` method:

```javascript
import { withCreate } from 'radipan';

function App() {
  return withCreate('div').create({ css: { color: 'red' } }, 'whee!')); // Red whee!
}
```

### HTML Tags

You can import HTML tags from `radipan/tags` for convenience:

```javascript
import { div, form, input, span } from 'radipan/tags';

function App() {
  return form.create({css: { display: 'flex' }}, [
    div.create({ css: { color: 'green' } }, 'green div'));
    span.create({ css: { color: 'red' } }, 'red span'));
    input.create({ css: { color: 'blue' }, placeholder: 'blue input' }));
  ]);
}
```

### Recipes

Recipes are a way to define styles for different variants of a component. They offer better performance, developer experience, and composability.

You can use recipes directly within the `css` prop. A recipe consists of four properties:

- `base`: The base styles for the component
- `variants`: The different visual styles for the component
- `compoundVariants`: The different combinations of variants for the component
- `defaultVariants`: The default variant values for the component

A recipe must have at least `variants` to be recognized as a recipe. Use a nested object to specify the variant name and the corresponding style in variants. For example:

```javascript
import { withCreate } from 'radipan';

const Badge = ({
  as = 'span',
  size = 'md', // 'size' is a recipe variant
  variant = 'solid', // 'variant' is also a recipe variant
  children = undefined,
  ...props
} = {}) => {
  return withCreate(as).create(
    { size, variant, ...props, css: badgeRecipe },
    children
  );
};

const badgeRecipe = {
  base: {
    borderRadius: 'xs',
    textTransform: 'uppercase',
  },
  variants: {
    size: {
      sm: { fontSize: 'xs', padding: '0 2px' },
      md: { fontSize: 'sm', padding: '0 var(--spacing-1x)' },
      lg: { fontSize: 'md', padding: '1px var(--spacing-1x)' },
    },
    variant: {
      solid: {
        /* solid style CSS code */
      },
      subtle: {
        /* subtle style CSS code */
      },
      outline: {
        /* outline style CSS code */
      },
    },
  },
};

export default withCreate(Badge);
```

## Examples

Radipan works with various frameworks and tools, such as React, Preact, Vite, Next.js, etc.

- [Radipan + Vite + React + TypeScript Starter (radipan-vite-react-ts)](https://github.com/yumin-chen/radipan/tree/main/examples/radipan-vite-react-ts)
- [Radipan + Vite + React + TypeScript + JSX Starter (radipan-vite-react-tsx)](https://github.com/yumin-chen/radipan/tree/main/examples/radipan-vite-react-tsx)
- [Radipan + Vite + Solid + TypeScript Starter (radipan-vite-solid-ts)](https://github.com/yumin-chen/radipan/tree/main/examples/radipan-vite-solid-ts)
- [Radipan + Vite + Solid + TypeScript + JSX Starter (radipan-vite-solid-tsx)](https://github.com/yumin-chen/radipan/tree/main/examples/radipan-vite-solid-tsx)

(More coming soon...)

## Troubleshooting

To enable debug logging, run the Radipan CLI with `DEBUG=true`.
