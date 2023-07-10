# Radipan

Radipan is an _"all-in-JS"_ CSS-in-JS engine that allows you to write all your styles in JavaScript. All-in-JS. No HTML. No CSS. Just JavaScript!

Radipan uses [PandaCSS](https://panda-css.com) as the underlying static CSS extraction framework and provides an **inline** `css` prop for styling your components.

## How it works

Radipan executes a script at built time that runs your code and constructs the virtual DOM tree of your application. It then scans the entry component and its child nodes to identify any inline `css` props. These props are subsequently parsed and transformed into intermediate PandaCSS code, which generates the static CSS code.

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
  recipeTrimming: true, // Whether to trim unused recipe variants
  theme: {
    // Useful for theme customization
    extend: {},
  },
  outdir: '@design-system', // The output directory in /node_modules
});
```

The available Radipan options are as follows:

- `appEntry`: Specify the path to the entry point component(s) of your application, considering the routing structure. For a single entry point, use a string value (e.g., `'src/App.ts'`). For multiple entry points, use an array (e.g., `['src/App.ts', 'src/page-1.ts', 'src/page-2.ts']`).
- `recipeTrimming`: Enable this option to automatically remove unused recipe variants during build time. Disable it if you need to dynamically change a recipe variant.
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
import { div, form, input, span } from 'radipan';

function App() {
  return form.create({css: { display: 'flex' }}, [
    div.create({ css: { color: 'green' } }, 'green div'));
    span.create({ css: { color: 'red' } }, 'red span'));
    input.create({ css: { color: 'blue' }, placeholder: 'blue input' }));
  ]);
}
```

## FAQ

### • Why use Radipan?

Radipan adopts the widely adopted inline `css` prop syntax, which is compatible with other libraries such as Emotion.js and Stitches.js. This means you can easily switch to Radipan and keep most of your existing APIs while enabling static extraction of CSS at build time.

### • Why not just use PandaCSS directly?

Besides the inline `css` prop syntax, Radipan's CSS extractor script also runs your code and builds your application's virtual DOM tree during build time. This additional context allows Radipan to provide additional features, such as _Recipe Trimming_. It also uses this context to infer any dynamic value within the `css` prop. For example, Radipan can handle any referenced values, including runtime reference (e.g. values from hooks), which PandaCSS cannot handle.

### • Does Radipan support JSX?

Yes, Radipan supports JSX. You can use the exported `jsx` API as the JSX factory for your project. However, we recommend using Radipan without JSX as an all-in-JS solution to avoid XML/HTML syntax in your codebase.

## Troubleshooting

To enable debug logging, run the Radipan CLI with `DEBUG=true`.
