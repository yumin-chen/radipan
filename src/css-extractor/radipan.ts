import { h } from 'phy-react';
import { FunctionComponent, ReactNode } from 'react';
import { css, cva, cx } from 'radipan/design-system';
import { outdir } from 'radipan/radipan.config.json';
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from '@radipan-design-system/types/recipe';
import { SystemStyleObject } from '@radipan-design-system/types';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { RecipeProps, CssProps, Creatable } from '../radipan.d';

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;

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
  process.env.DEBUG && console.debug('Writing to file:', exportFile);
  if (process.env.CSSGEN === 'pregen' && !!process.env.CSSGEN_FILE) {
    const fileDirIndex = process.env.CSSGEN_FILE.lastIndexOf('/');
    const fileDir = process.env.CSSGEN_FILE.substring(0, fileDirIndex);
    const exportFileDir = `${EXPORT_FOLDER}/${fileDir}`;
    if (!existsSync(exportFileDir)) {
      mkdirSync(exportFileDir, { recursive: true });
      process.env.DEBUG && console.debug('Created folder:', exportFileDir);
    }
    if (!existsSync(exportFile)) {
      writeFileSync(
        exportFile,
        '"use strict";\nimport {css, cva, cx} from "../css"\n\n'
      );
      process.env.DEBUG && console.debug('Created file:', exportFile);
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
    process.env.DEBUG && console.debug('Generated a `cva` function in ', exportFile);
    return cva(cssProp as RecipeDefinition<RecipeVariantRecord>)(variantProps);
  } else {
    appendFileSync(exportFile, `css(${JSON.stringify(cssProp)});\n`);
    process.env.DEBUG && console.debug('Generated a `css` function in ', exportFile);
    return css(cssProp as SystemStyleObject);
  }
};

export const jsx = (component, props, children) => {
  if (typeof props?.css === 'object') {
    const { css: cssProp, className, ...restProps } = props;

    process.env.DEBUG &&
      console.debug(
        'Found css prop used with comopnent: ',
        component,
        props.css
      );
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
    process.env.DEBUG &&
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

const createComponent = (component: any) => {
  process.env.DEBUG &&
    console.debug(
      'Analysing component: ',
      component?.name || component?.displayName || component
    );

  return (props: any, children: any) => jsx(component, props, children);
};

export const withCreate = (component: any): Creatable => {
  if (typeof component === 'string') {
    return { create: createComponent(component) } as unknown as Creatable;
  }
  (component as Creatable).create = createComponent(component);
  return component as Creatable;
};

export default withCreate;
