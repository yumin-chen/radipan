import { h } from 'phy-react';
import { FunctionComponent, ReactNode } from 'react';
import { css, cva, cx } from 'radipan/design-system';
import { RecipeProps, CssProps, Creatable } from './radipan.d';
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from '@radipan-design-system/types/recipe';
import { SystemStyleObject } from '@radipan-design-system/types';

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
  // Recipes
  const isRecipe = Object.hasOwn(cssProp || {}, 'variants');
  if (isRecipe) {
    const variantProps = getVariantProps(props);
    return cva(cssProp as RecipeDefinition<RecipeVariantRecord>)(variantProps);
  } else {
    return css(cssProp as SystemStyleObject);
  }
};

export function jsx(component, props, ...children) {
  if (typeof props?.css === 'object') {
    const { css: cssProp, className, ...restProps } = props;
    const cssClasses = parseCssProp(props);
    // const variantProps = typeof cssProp?.variants === 'object' && getVariantProps(props) || null;
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
  }

  return children === undefined
    ? h(component, props)
    : h(component, props, children);
};

const createComponent = (component: any) => {
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
