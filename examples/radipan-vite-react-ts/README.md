# radipan-vite-react-ts

This is a starter for [Radipan](https://github.com/yumin-chen/radipan), an _all-in-JS_ CSS-in-JS engine.

## Getting started

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
  return withCreate('div').create({ css: { color: 'blue' } }, 'whee!')); // Blue whee!
}
```

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

When you run `npx radipan cssgen`, it will parse all `css` props and generate the CSS code statically during build time.

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
- [Radipan + Vite + Solid + TypeScript Starter (radipan-vite-solid-ts)](https://github.com/yumin-chen/radipan-vite-solid-ts)

(More coming soon...)
