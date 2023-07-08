import { defineConfig as definePandaConfig } from '@pandacss/dev';

export const defineConfig = (config: object) => definePandaConfig({
  // Where to look for your css declarations
  include: ['./node_modules/styled-system/exported/**/*.css.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: './node_modules/styled-system',

  // Whether to emit the artifacts to node_modules as a package.
  // Will generate a package.json file that contains exports for each of the generated
  // outdir entrypoints
  emitPackage: true,

  ...config
});

export default defineConfig;
