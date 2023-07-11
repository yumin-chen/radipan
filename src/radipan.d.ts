import { ComponentType, FunctionComponent, ReactNode } from 'react';
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

export declare function jsx(component: (string | ComponentType)[]): JSX.Element;
export declare function jsx(
  comopnent: string | ComponentType,
  ...children: ReactNode[] | JSX.Element[]
): JSX.Element;
export declare function jsx(
  comopnent: string | ComponentType,
  props: Readonly<Record<string, any>>,
  ...children: ReactNode[] | JSX.Element[]
): JSX.Element;

export interface Creatable extends FunctionComponent {
  create: (
    props?: CssProps | null,
    children?: ReactNode | ReactNode[] | null
  ) => ReactNode;
}

declare const withCreate: (component: any) => Creatable;
export default withCreate;
