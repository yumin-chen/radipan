# Radipan

_The missing `css` prop API for [🐼 PandaCSS](https://panda-css.com)._

Radipan is an all-in-JS CSS-in-JS engine. With Radipan, you can write all your styles in JavaScript without the need for HTML or CSS.

## How it works

Radipan operates by running a script during the build process. This script scans the entry component and its child nodes, searching for inline `css` props. It then transforms these props into intermediate PandaCSS code (`css`, `cva`, etc.), which ultimately generates static CSS code.

## FAQ

### • Why use Radipan?

Radipan supports the widely adopted inline `css` prop syntax that made popular by libraries like [Emotion.js](https://emotion.sh/docs/css-prop) and [Stitches.js](https://stitches.dev/docs/overriding-styles#the-css-prop). This means you can easily migrate to Radipan, enabling static extraction of CSS at build time, while requiring minimal changes to your existing codebase.

### • Why not just use PandaCSS directly?

In addition to the inline `css` prop API, Radipan's CSS extractor script also executes your code and builds your application's virtual DOM tree during the build process. This additional context allows Radipan to provide additional features like _Recipe Shaking_ and better handle dynamic values within `css` prop, such as referenced values, including runtime references (e.g., values from hooks), which PandaCSS cannot handle very well.

## Setup

To set up Radipan in your project, follow these steps:

### Installation

Use your preferred package manager to install Radipan:

```bash
npm install radipan
```

### Configure Radipan

Create a file named `radipan.config.ts` (or `.js`) file in the root of your project and add these configuration options for Radipan:

```javascript
import { defineConfig } from 'radipan/config';

export default defineConfig({
  appEntry: 'src/App.ts', // Path to app entry point
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

### Configure to use with JSX in TypeScript

The easiest way to use Radipan with JSX in TypeScript is with the new JSX transform and the `jsxImportSource` TSConfig option (available since TS 4.1). For this approach, your TSConfig `compilerOptions` should contain:

```
"jsx": "react-jsx",
"jsxImportSource": "radipan"
```

You can now define styles using the object syntax and pass them to your components via the `css` prop.

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

If you're on an older version of React / TypeScript and unable to use the newer `react-jsx` transform, you will need to set the `jsxFactory` TSConfig option to `"radipan.jsx"`, or specify the JSX factory at the top of every file:

```javascript
/** @jsx jsx */
import { jsx } from 'radipan';
```

## Usage

To create a component with Radipan, you can use the `withCreate` function and pass in the element type as an argument. For example:

```javascript
import { withCreate } from 'radipan';

function App() {
  return withCreate('div').create({ css: { color: 'red' } }, 'whee!')); // Red whee!
}
```

This returns an object that has a `create` method. Use this method to specify the `props` and `children` of your component.

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

- [Radipan + Vite + React + TypeScript Starter (radipan-vite-react-ts)](https://github.com/yumin-chen/radipan-vite-react-ts)

(More coming soon...)

## Troubleshooting

To enable debug logging, run the Radipan CLI with `DEBUG=true`.
