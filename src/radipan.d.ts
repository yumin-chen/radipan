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
export default withCreate;
