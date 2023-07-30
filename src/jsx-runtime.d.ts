import { ComponentType, ReactElement } from "react";

export declare function jsx(
  type: string | ComponentType,
  props: Record<string, any>,
  key: string | undefined,
  _isStaticChildren: unknown,
  _source: unknown,
  _self: unknown
): ReactElement;

export { jsx as jsxs, jsx as jsxDEV };
