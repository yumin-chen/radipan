import { ComponentType, Fragment, ReactElement } from "react";
import { createElement } from "radipan";

export function jsx(
  type: string | ComponentType,
  props: Record<string, any>,
  key: string | undefined,
  _isStaticChildren: unknown,
  _source: unknown,
  _self: unknown
): ReactElement {
  const { children } = props;
  return createElement(type, { ...props, key }, children);
}

export function jsxDEV(
  type: string | ComponentType,
  props: Record<string, any>,
  key: string | undefined,
  _isStaticChildren: unknown,
  _source: unknown,
  _self: unknown
): ReactElement {
  const { children } = props;
  const process = (typeof global !== "undefined" && global?.process) || {
    env: {},
  };
  if (process.env?.CSSGEN === "pregen" && !!process.env?.CSSGEN_FILE) {
    import("radipan/css-extractor").then(
      ({ createElement: extractorCreateElement }) => {
        return extractorCreateElement(
          type,
          { ...props, key, _source },
          children
        );
      }
    );
  }
  return createElement(type, { ...props, key }, children);
}

export { jsx as jsxs, Fragment };
