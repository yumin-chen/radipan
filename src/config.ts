import { defineConfig as definePandaConfig } from '@pandacss/dev';

export const defineConfig = (config: any = {}) => {
  const {
    appEntry,
    include: includePath,
    exclude,
    outdir = '@radipan-design-system',
    jsxFramework: framework = 'react',
    ...options
  } = config;

  if (!!appEntry) {
    const fs = require('fs');
    fs.writeFileSync(
      'node_modules/radipan/radipan.config.json',
      JSON.stringify({ appEntry, framework, outdir })
    );

    if (!!outdir) {
      fs.writeFileSync(
        'node_modules/radipan/design-system.js',
        `export * from '../${outdir}/css/index.mjs';\n`
      );
      fs.writeFileSync(
        'node_modules/radipan/design-system.ts',
        `export * from '../${outdir}/css/index';\n`
      );
      fs.writeFileSync(
        'node_modules/radipan/styles.css',
        `@import '../${outdir}/styles.css';\n`
      );
    }
  }

  return definePandaConfig({
    // Where to look for your css declarations
    include: [`./node_modules/${outdir}/exported/**/*.css.{js,jsx,ts,tsx}`],

    // Files to exclude
    exclude: [],

    // The output directory for your css system
    outdir,

    // Options for the generated typescript definitions.
    // Type: 'react' | 'solid' | 'preact' | 'vue' | 'qwik'
    jsxFramework: framework,

    // Whether to emit the artifacts to node_modules as a package.
    // Will generate a package.json file that contains exports for each of the generated
    // outdir entrypoints
    emitPackage: true,

    ...options,
  });
};

export default defineConfig;
