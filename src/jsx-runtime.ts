import { ComponentType, Fragment, ReactElement } from 'react';
import { createElement } from './radipan';
import { createElement as extractorCreateElement } from './css-extractor/radipan';

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
  return extractorCreateElement(type, { ...props, key }, children);
}

export { jsx as jsxs, Fragment };
