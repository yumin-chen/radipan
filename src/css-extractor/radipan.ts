import { ComponentType, FunctionComponent, ReactNode } from "react";
import { css, cva, cx } from "radipan/design-system";
import { outdir } from "radipan/radipan.config.json";
import { h as _h } from "radipan/framework";
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from "@radipan-design-system/types/recipe";
import { SystemStyleObject } from "@radipan-design-system/types";
import { format, resolveConfig, resolveConfigFile } from "prettier";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
import { RecipeProps, CssProps, Creatable } from "../radipan.d";

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
const process = (typeof global !== "undefined" && global?.process) || {
  env: {},
};
const DEBUG = process?.env?.DEBUG;

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

const COMPILED_FILES = new Map();
let transpileQueuePromise: Promise<void> | null = null;

const prettierConfigResolve = async () => {
  const prettierConfig = await resolveConfigFile();
  prettierConfig && (await resolveConfig(prettierConfig));
};

const prettierConfigResolvePromise = prettierConfigResolve();

const transpileForJSX = async (_source, cssProp, className, cssClasses) => {
  !!transpileQueuePromise && (await transpileQueuePromise);
  !!prettierConfigResolvePromise && (await prettierConfigResolvePromise);
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  const allFileContents =
    (COMPILED_FILES.has(transpileFileName) &&
      COMPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");
  const lines = allFileContents.split(/\r?\n/);
  const restOfFile =
    lines[_source.lineNumber - 1].substring(_source.columnNumber - 1) +
    "\n" +
    lines
      .slice(_source.lineNumber)
      .join("\n")
      .replaceAll(new RegExp(/\r?\n\s+/, "g"), "\n  ")
      .replaceAll(new RegExp(/\r?\n\s+}/, "g"), "\n}");

  const cssString = (
    await format(JSON.stringify(cssProp), { parser: "json5" })
  ).replace(/\r?\n+$/, "");
  const numCssLines = cssString.split(/\r?\n/).length;

  if (restOfFile.indexOf(`css={${cssString}}`) === -1) {
    console.error(
      "Failed to transpile ",
      transpileFileName,
      restOfFile,
      `css={${cssString}}`
    );
  }
  const replacement = `/* Radipan Transpiled */ ${"\n".repeat(
    numCssLines - 1
  )} className="${!className ? cssClasses : cx(cssClasses, className)}"`;
  const replaced = restOfFile.replace(`css={${cssString}}`, replacement);
  const transpiledContents =
    lines.slice(0, _source.lineNumber - 1).join("\n") +
    "\n" +
    lines[_source.lineNumber - 1].substring(0, _source.columnNumber - 1) +
    replaced;
  COMPILED_FILES.set(transpileFileName, transpiledContents);
  writeFileSync(transpileFileName, transpiledContents);
  DEBUG &&
    console.debug("Transpiled component successfully: ", cssString, replaced);
};

export function createElement(
  component: string | ComponentType,
  props: Readonly<Record<string, any>> | undefined,
  ...children: JSX.Element[] | ReactNode[]
) {
  // @ts-ignore
  const kids = children.every(item => !item) ? undefined : children;
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

    if (process.env?.CSSGEN === "pregen" && !!process.env?.CSSGEN_FILE) {
      transpileQueuePromise =
        _source &&
        _source.lineNumber &&
        _source.columnNumber &&
        transpileForJSX(_source, props.css, className, cssClasses);
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

  // Exhaustively instantiate components for CSS extraction
  if (typeof component === "function") {
    // @ts-ignore
    component({ ...props, children: kids });
  } else {
    DEBUG && console.debug("Non-function component, skipping: ", component);
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
