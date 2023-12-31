import { ComponentType, ReactNode } from "react";
import { css, cva, cx } from "radipan/design-system";
import { RecipeProps, CssProps, Creatable } from "./radipan.d";
import { h as _h } from "radipan/framework";
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from "@radipan-design-system/types/recipe";
import { SystemStyleObject } from "@radipan-design-system/types";

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
  const isRecipe = Object.hasOwn(cssProp || {}, "variants");
  if (isRecipe) {
    const variantProps = getVariantProps(props);
    return cva(cssProp as RecipeDefinition<RecipeVariantRecord>)(variantProps);
  } else {
    return css(cssProp as SystemStyleObject);
  }
};

export function createElement(
  component: string | ComponentType,
  props: Readonly<Record<string, any>> | undefined,
  ...children: JSX.Element[] | ReactNode[]
) {
  // @ts-ignore
  const kids = children.every(item => !item) ? undefined : children;
  if (typeof props?.css === "object") {
    const { css: cssProp, className, ...restProps } = props;
    const otherProps = { ...restProps };
    const cssClasses = parseCssProp(props);
    // const variantProps = typeof cssProp?.variants === 'object' && getVariantProps(props) || null;
    Object.keys(cssProp?.variants || []).forEach(
      variantName => delete otherProps[variantName]
    );

    return _h(
      component,
      {
        ...otherProps,
        // Merge class names with generated styles
        className: !className ? cssClasses : cx(cssClasses, className),
      },
      kids
    );
  }

  return _h(component, props, kids);
}

function createComponent(component: string | ComponentType) {
  return (props: CssProps | undefined, children: ReactNode | ReactNode[]) =>
    createElement(component, props, children);
}

export const withCreate = (component: string | ComponentType): Creatable => {
  if (typeof component === "string") {
    return { create: createComponent(component) } as unknown as Creatable;
  }
  (component as Creatable).create = createComponent(component);
  return component as Creatable;
};

export { withCreate as default, createElement as h };
