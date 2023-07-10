import { FunctionComponent, ReactNode } from 'react';
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from '@radipan-design-system/types/recipe';
import { SystemStyleObject } from '@radipan-design-system/types';

export interface RecipeProps {
  className?: string;
  css?: RecipeDefinition<RecipeVariantRecord>;
}

export interface CssProps extends RecipeProps {
  css?: SystemStyleObject | RecipeDefinition<RecipeVariantRecord>;
}

declare const parseCssProp: (props: CssProps) => string;

export interface Creatable extends FunctionComponent {
  create: (
    props?: Object | null,
    children?: ReactNode | ReactNode[] | null
  ) => ReactNode;
}

declare const withCreate: (component: any) => Creatable;
declare const anchor: Creatable;
declare const body: Creatable;
declare const br: Creatable;
declare const button: Creatable;
declare const code: Creatable;
declare const div: Creatable;
declare const fieldset: Creatable;
declare const footer: Creatable;
declare const form: Creatable;
declare const header: Creatable;
declare const h1: Creatable;
declare const h2: Creatable;
declare const h3: Creatable;
declare const h4: Creatable;
declare const h5: Creatable;
declare const html: Creatable;
declare const input: Creatable;
declare const label: Creatable;
declare const main: Creatable;
declare const paragraph: Creatable;
declare const pre: Creatable;
declare const span: Creatable;
declare const strong: Creatable;
declare const title: Creatable;
declare const meta: Creatable;
declare const link: Creatable;
declare const tags: {
  anchor: Creatable;
  body: Creatable;
  br: Creatable;
  button: Creatable;
  code: Creatable;
  div: Creatable;
  fieldset: Creatable;
  footer: Creatable;
  form: Creatable;
  header: Creatable;
  h1: Creatable;
  h2: Creatable;
  h3: Creatable;
  h4: Creatable;
  h5: Creatable;
  html: Creatable;
  input: Creatable;
  label: Creatable;
  main: Creatable;
  paragraph: Creatable;
  pre: Creatable;
  span: Creatable;
  strong: Creatable;
  title: Creatable;
  meta: Creatable;
  link: Creatable;
};

export {
  anchor,
  body,
  br,
  button,
  code,
  tags as default,
  div,
  fieldset,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  header,
  html,
  input,
  label,
  link,
  main,
  meta,
  paragraph,
  parseCssProp,
  pre,
  span,
  strong,
  title,
  withCreate,
};
