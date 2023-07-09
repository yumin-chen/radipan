import { h } from 'phy-react';
import { FunctionComponent, ReactNode } from 'react';
import { css, cva, cx } from 'styled-system/css';
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from 'styled-system/types/recipe';
import { SystemStyleObject } from 'styled-system/types';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';

const EXPORT_FOLDER = 'node_modules/styled-system/exported';

interface RecipeProps {
  className?: string;
  css?: RecipeDefinition<RecipeVariantRecord>;
}
interface CssProps extends RecipeProps {
  css?: SystemStyleObject | RecipeDefinition<RecipeVariantRecord>;
}

const getVariantProps = (props: RecipeProps) => {
  const { css: cssProp, ...restProps } = props;
  return Object.keys(cssProp?.variants || {}).reduce(
    (prev, variantName) => ({
      ...prev,
      [variantName]: restProps?.[variantName as keyof typeof restProps],
    }),
    {}
  );
};

export const parseCssProp = (props: CssProps) => {
  const { css: cssProp } = props;
  const exportFile = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.css.js`;
  console.debug('Writing to file:', exportFile);
  if (process.env.CSSGEN === 'pregen' && !!process.env.CSSGEN_FILE) {
    const fileDirIndex = process.env.CSSGEN_FILE.lastIndexOf('/');
    const fileDir = process.env.CSSGEN_FILE.substring(0, fileDirIndex);
    const exportFileDir = `${EXPORT_FOLDER}/${fileDir}`;
    if (!existsSync(exportFileDir)) {
      mkdirSync(exportFileDir, { recursive: true });
      console.debug('Created folder:', exportFileDir);
    }
    if (!existsSync(exportFile)) {
      writeFileSync(
        exportFile,
        '"use strict";\nimport {css, cva, cx} from "../css"\n\n'
      );
      console.debug('Created file:', exportFile);
    }
  }
  // Recipes
  const isRecipe = Object.hasOwn(cssProp || {}, 'variants');
  if (isRecipe) {
    const variantProps = getVariantProps(props);
    appendFileSync(
      exportFile,
      `cva(${JSON.stringify(cssProp)})(${JSON.stringify(variantProps)});\n`
    );
    console.debug('Generated a `cva` function in ', exportFile);
    return cva(cssProp as RecipeDefinition<RecipeVariantRecord>)(variantProps);
  } else {
    appendFileSync(exportFile, `css(${JSON.stringify(cssProp)});\n`);
    console.debug('Generated a `css` function in ', exportFile);
    return css(cssProp as SystemStyleObject);
  }
};

interface Creatable extends FunctionComponent {
  create: (
    props?: Object | null,
    children?: ReactNode | ReactNode[] | null
  ) => ReactNode;
}

const createComponent = (component: any) => {
  return (props: any, children: any) => {
    console.debug('Analysing component: ', component?.name || component?.displayName || component);

    if (typeof props?.css === 'object') {
      const { css: cssProp, className, ...restProps } = props;

      console.debug('Found css prop used with comopnent: ', component, props.css);
      const cssClasses = parseCssProp(props);
      Object.keys(cssProp?.variants || []).forEach(
        variantName => delete restProps[variantName]
      );

      return h(
        component,
        {
          ...restProps,
          // Merge class names with generated styles
          className: !className ? cssClasses : cx(cssClasses, className),
        },
        children
      );
    } else {
      console.debug(
        'No css prop found used with comopnent: ',
        component?.name || component?.displayName || component,
        props
      );
    }

    // Exhaustively instantiate components for CSS extraction
    if (typeof component === 'function') {
      component({ ...props, children });
    }

    return children === undefined
      ? h(component, props)
      : h(component, props, children);
  };
};

export const withCreate = (component: any): Creatable => {
  if (typeof component === 'string') {
    return { create: createComponent(component) } as unknown as Creatable;
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
