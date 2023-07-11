import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const esbuildOptions = {
  // All options are optional
  include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  exclude: /node_modules/, // default
  sourceMap: true, // default
  minify: true,
  target: 'es2020', // default, or 'es20XX', 'esnext'
  jsx: 'transform', // default, or 'preserve'
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  // Like @rollup/plugin-replace
  define: {
    // __VERSION__: '"x.y.z"',
  },
  tsconfig: 'tsconfig.json', // default
  // Add extra loaders
  loaders: {
    // Add .json files support
    // require @rollup/plugin-commonjs
    '.json': 'json',
    // Enable JSX in .js files too
    '.js': 'jsx',
  },
};

export default [
  {
    input: 'src/bin.ts',
    external: ['child_process'],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        banner: '#!/usr/bin/env node',
        file: 'dist/bin.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/config.ts',
    external: ['@pandacss/dev'],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: 'dist/config.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/config.ts',
    external: ['@pandacss/dev'],
    plugins: [dts()],
    output: {
      file: 'dist/config.d.ts',
      format: 'es',
    },
  },
  {
    input: 'src/radipan.ts',
    external: ['react', 'radipan/design-system'],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/radipan.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/radipan.ts',
    external: ['react'],
    plugins: [dts()],
    output: {
      file: 'dist/radipan.d.ts',
      format: 'es',
    },
  },
  {
    input: 'src/html-tags.ts',
    external: ['radipan'],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/html-tags.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/html-tags.d.ts',
    external: ['radipan'],
    plugins: [dts()],
    output: {
      file: 'dist/html-tags.d.ts',
      format: 'es',
    },
  },
  {
    input: 'src/css-extractor/html-tags.ts',
    external: [
      'react',
      'fs',
      'radipan/radipan.config.json',
      'radipan/design-system',
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/css-extractor/html-tags.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/css-extractor/radipan.ts',
    external: [
      'react',
      'fs',
      'radipan/radipan.config.json',
      'radipan/design-system',
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/css-extractor/radipan.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/css-extractor/css-extractor.ts',
    external: ['fs', 'radipan/radipan.config.json'],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: 'dist/css-extractor/css-extractor.js',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
      },
    ],
  },
];
