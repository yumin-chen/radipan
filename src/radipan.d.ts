import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import {
  RecipeDefinition,
  RecipeVariantRecord,
} from '@radipan-design-system/types/recipe';
import { SystemStyleObject } from '@radipan-design-system/types';

export interface RecipeProps extends Readonly<Record<string, any>> {
  className?: string;
  css?: RecipeDefinition<RecipeVariantRecord>;
}

export interface CssProps extends RecipeProps {
  css?: SystemStyleObject | RecipeDefinition<RecipeVariantRecord>;
}

declare const parseCssProp: (props: CssProps) => string;

export declare function createElement(
  component: (string | ComponentType)[]
): ReactElement;
export declare function createElement(
  comopnent: string | ComponentType,
  ...children: ReactNode[]
): ReactElement;
export declare function createElement(
  comopnent: string | ComponentType,
  props: Readonly<Record<string, any>> | undefined,
  ...children: ReactNode[]
): ReactElement;

export interface Creatable extends FunctionComponent {
  create: (
    props?: CssProps,
    children?: ReactNode | ReactNode[]
  ) => ReactElement;
}

declare const withCreate: (component: string | ComponentType) => Creatable;
export default withCreate;
