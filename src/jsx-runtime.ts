import { ComponentType, Fragment, ReactElement } from 'react';
import { createElement } from './radipan';

export function jsx(
  type: string | ComponentType,
  props: Record<string, any>,
  key: string | undefined,
  _isStaticChildren: unknown,
  _source: unknown,
  _self: unknown
): ReactElement {
  return createElement(type, { ...props, key });
}

export { jsx as jsxs, jsx as jsxDEV, Fragment };
