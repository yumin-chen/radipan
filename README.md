# Radipan

_The missing `css` prop API for [🐼 PandaCSS](https://panda-css.com)._

Radipan is an all-in-JS CSS-in-JS engine. With Radipan, you can write all your styles in JavaScript without the need for HTML or CSS.

## How it works

Radipan operates by running a script during the build process. This script scans the entry component and its child nodes, searching for inline `css` props. It then transforms these props into intermediate PandaCSS code (`css`, `cva`, etc.), which ultimately generates static CSS code.

## FAQ

### • Why use Radipan?

Radipan supports the widely adopted inline `css` prop syntax, making it compatible with other libraries like Emotion.js and Stitches.js. This means you can easily migrate to Radipan, enabling static extraction of CSS at build time, while requiring minimal changes to your existing codebase.

### • Why not just use PandaCSS directly?

In addition to the inline `css` prop syntax, Radipan's CSS extractor script also executes your code and builds your application's virtual DOM tree during the build process. This additional context allows Radipan to provide additional features like _Recipe Shaking_ and better handle dynamic values within `css` prop, such as referenced values, including runtime references (e.g., values from hooks), which PandaCSS cannot handle very well.

### • Does Radipan support JSX?

Yes, Radipan fully supports JSX. You can use the exported `jsx` API as the JSX factory for your project, similar to the `jsx` API provided by `@emotion/react`. However, we recommend using Radipan without JSX as an all-in-JS solution to avoid XML/HTML syntax in your codebase.

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

## Examples

Radipan works with various frameworks and tools, such as React, Preact, Vite, Next.js, etc.

- [Radipan + Vite + React + TypeScript Starter (radipan-vite-react-ts)](https://github.com/yumin-chen/radipan-vite-react-ts)

(More coming soon...)

## Usage

To create a component with Radipan, you can use the `radipan` function and pass in the element type as an argument. For example:

```javascript
import radipan from 'radipan';

function App() {
  return radipan('div').create({ css: { color: 'red' } }, 'whee!')); // Red whee!
}
```

This returns an object that has a `create` method. You can use this method to specify the `props` and `children` of your component.

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


## Troubleshooting

To enable debug logging, run the Radipan CLI with `DEBUG=true`.
