import { ComponentType, ReactNode } from "react";
import { css, cva, cx } from "../cli/get-design-system";
import { outdir } from "../cli/get-config";
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from "@radipan-design-system/types/recipe";
import { SystemStyleObject } from "@radipan-design-system/types";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { RecipeProps, CssProps, Creatable } from "../core/radipan.d";
import { transpile } from "./transpiler/transpiler";

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
const process = (typeof global !== "undefined" && global?.process) || {
  env: { DEBUG: false, CSSGEN: "", CSSGEN_FILE: "" },
};
const DEBUG = process?.env?.DEBUG;

const _h = (component, props, children) => ({ component, props, children });

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
  DEBUG && console.debug("Writing to file:", exportFile);
  if (process.env.CSSGEN === "pregen" && !!process.env.CSSGEN_FILE) {
    const fileDirIndex = process.env.CSSGEN_FILE.lastIndexOf("/");
    const fileDir = process.env.CSSGEN_FILE.substring(0, fileDirIndex);
    const exportFileDir = `${EXPORT_FOLDER}/${fileDir}`;
    if (!existsSync(exportFileDir)) {
      mkdirSync(exportFileDir, { recursive: true });
      DEBUG && console.debug("Created folder:", exportFileDir);
    }
    if (!existsSync(exportFile)) {
      writeFileSync(
        exportFile,
        '"use strict";\nimport {css, cva, cx} from "../css"\n\n'
      );
      DEBUG && console.debug("Created file:", exportFile);
    }
  }
  // Recipes
  const isRecipe = Object.hasOwn(cssProp || {}, "variants");
  if (isRecipe) {
    const variantProps = getVariantProps(props);
    appendFileSync(
      exportFile,
      `cva(${JSON.stringify(cssProp)})(${JSON.stringify(variantProps)});\n`
    );
    DEBUG && console.debug("Generated a `cva` function in ", exportFile);
    return cva(cssProp as RecipeDefinition<RecipeVariantRecord>)(variantProps);
  } else {
    appendFileSync(exportFile, `css(${JSON.stringify(cssProp)});\n`);
    DEBUG && console.debug("Generated a `css` function in ", exportFile);
    return css(cssProp as SystemStyleObject);
  }
};

export async function createElement(
  component: string | ComponentType,
  props: Readonly<Record<string, any>> | undefined,
  ...children: JSX.Element[] | ReactNode[]
) {
  // @ts-ignore
  const kids = children.every(item => !item) ? undefined : children;

  // Exhaustively instantiate components for CSS extraction
  if (typeof component === "function") {
    // @ts-ignore
    await component({ ...props, children: kids });
  } else {
    DEBUG && console.debug("Non-function component, skipping: ", component);
  }

  if (typeof props?.css === "object") {
    const { css: cssProp, className, _source, ...restProps } = props;
    const otherProps = { ...restProps };

    DEBUG &&
      console.debug(
        "Found css prop used within comopnent: ",
        component,
        props.css,
        _source
      );

    const cssClasses = parseCssProp(props);
    Object.keys(cssProp?.variants || []).forEach(
      variantName => delete otherProps[variantName]
    );

    if (process.env?.CSSGEN === "pregen") {
      if (props.radipanId) {
        await transpile(props.radipanId, className, cssClasses);
      } else {
        DEBUG && console.error("radipanId is missing: ", component, props.css);
      }
    }

    return _h(
      component,
      {
        ...otherProps,
        // Merge class names with generated styles
        className: !className ? cssClasses : cx(cssClasses, className),
      },
      kids
    );
  } else {
    DEBUG &&
      console.debug(
        "No css prop found used with comopnent: ",
        component?.name || component?.displayName || component,
        props
      );
  }

  return _h(component, props, kids);
}

function createComponent(component: any) {
  DEBUG &&
    console.debug(
      "Analysing component: ",
      component?.name || component?.displayName || component
    );

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
