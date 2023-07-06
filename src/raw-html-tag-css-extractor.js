import { createElement as h } from 'react';
import { css, cva } from '../../styled-system/css/index.mjs';

export const parseCssProp = props => {
  const { css: cssProp, className, ...restProps } = props;

  let fs = null;
  const exportFile = `./node_modules/radipan/styled-system/exported/${process.env.CSSGEN_FILE}.css.js`;
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.CSSGEN === 'pregen' &&
    !!process.env.CSSGEN_FILE
  ) {
    fs = require('fs');
    const fileDirIndex = process.env.CSSGEN_FILE.lastIndexOf('/');
    const fileDir = process.env.CSSGEN_FILE.substring(0, fileDirIndex);
    const exportFileDir = `styled-system/exported/${fileDir}`;
    if (!fs.existsSync(exportFileDir)) {
      fs.mkdirSync(exportFileDir, { recursive: true });
    }
    if (!fs.existsSync(exportFile)) {
      fs.writeFileSync(
        exportFile,
        '"use strict";\nimport {css, cva, cx} from "../css"\n\n'
      );
    }
  }

  // Recipes
  if (typeof cssProp?.variants === 'object') {
    const variantProps = Object.keys(cssProp.variants).reduce(
      (prev, variantName) => ({
        ...prev,
        [variantName]: restProps[variantName],
      }),
      {}
    );
    !!fs &&
      fs.appendFileSync(
        exportFile,
        `cva(${JSON.stringify(cssProp)})(${JSON.stringify(variantProps)});\n`
      );
    return cva(cssProp)(variantProps);
  } else {
    !!fs && fs.appendFileSync(exportFile, `css(${JSON.stringify(cssProp)});\n`);
    return css(cssProp);
  }
};

const createComponent = component => {
  return (props, children) => {
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
            : StyledSystem.cx(cssClasses, className),
        },
        children
      );
    }

    return children === undefined
      ? h(component, props)
      : h(component, props, children);
  };
};

export const withCreate = component => {
  if (typeof component === 'string') {
    return { create: createComponent(component) };
  }
  component.create = createComponent(component);
  return component;
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
