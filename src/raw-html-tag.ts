import { FunctionComponent, ReactElement, ReactNode, createElement as h } from 'react';
import { css, cva, cx } from '../styled-system/css/index.mjs';

export const parseCssProp = (props: any) => {
  const { css: cssProp, className, ...restProps } = props;
  // Recipes
  if (typeof cssProp?.variants === 'object') {
    const variantProps = Object.keys(cssProp.variants).reduce(
      (prev, variantName) => ({
        ...prev,
        [variantName]: restProps[variantName],
      }),
      {}
    );
    return cva(cssProp)(variantProps);
  } else {
    return css(cssProp);
  }
};

const createComponent = (component: any) => {
  return (props: any, children: any) => {
    if (typeof props?.css === 'object') {
      const { css: cssProp, className, ...restProps } = props;
      const cssClasses = parseCssProp(props);
      typeof cssProp?.variants === 'object' &&
        Object.keys(cssProp.variants).forEach(
          variantName => delete restProps[variantName]
        );
      return h(
        component,
        {
          ...restProps,
          // Merge class names with generated styles
          className: !className
            ? cssClasses
            : cx(cssClasses, className),
        },
        children
      );
    }

    return children === undefined
      ? h(component, props)
      : h(component, props, children);
  };
};

interface Creatable extends FunctionComponent {
  create: (props?: Object | null, children?: ReactNode | ReactNode[] | null) => ReactElement;
}

export const withCreate = (component: any): Creatable => {
  if (typeof component === 'string') {
    return { create: createComponent(component) } as Creatable;
  }
  (component as Creatable).create = createComponent(component);
  return component as Creatable;
};

export const anchor = withCreate('a');
export const body = withCreate('body');
export const br = withCreate('br');
export const button = withCreate('button');
export const code = withCreate('code');
export const div = withCreate('div');
export const fieldset = withCreate('fieldset');
export const footer = withCreate('footer');
export const form = withCreate('form');
export const header = withCreate('header');
export const h1 = withCreate('h1');
export const h2 = withCreate('h2');
export const h3 = withCreate('h3');
export const h4 = withCreate('h4');
export const h5 = withCreate('h5');
export const html = withCreate('html');
export const input = withCreate('input');
export const label = withCreate('label');
export const main = withCreate('main');
export const paragraph = withCreate('p');
export const pre = withCreate('pre');
export const span = withCreate('span');
export const strong = withCreate('strong');
export const title = withCreate('title');
export const meta = withCreate('meta');
export const link = withCreate('link');

const tags = {
  anchor,
  body,
  br,
  button,
  code,
  div,
  fieldset,
  footer,
  form,
  header,
  h1,
  h2,
  h3,
  h4,
  h5,
  html,
  input,
  label,
  main,
  paragraph,
  pre,
  span,
  strong,
  title,
  meta,
  link,
};


export default tags;
