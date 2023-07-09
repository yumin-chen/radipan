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
  target: 'es2017', // default, or 'es20XX', 'esnext'
  jsx: 'transform', // default, or 'preserve'
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  // Like @rollup/plugin-replace
  // define: {
  //   __VERSION__: '"x.y.z"',
  // },
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
    input: 'src/config.ts',
    external: ['@pandacss/dev'],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: 'dist/config.js',
        format: 'esm',
        sourcemap: true,
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
    input: 'src/raw-html-tag.ts',
    external: [/styled-system/, 'react'],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/raw-html-tag.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/raw-html-tag.ts',
    external: [/styled-system/, 'react'],
    plugins: [dts(), nodeResolve(), commonjs()],
    output: {
      file: 'dist/raw-html-tag.d.ts',
      format: 'es',
    },
  },
  {
    input: 'src/raw-html-tag-css-extractor.ts',
    external: [/styled-system/, 'react', 'fs'],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: 'dist/raw-html-tag-css-extractor.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
  },
  {
    input: 'src/raw-html-tag-css-extractor.ts',
    external: [/styled-system/, 'react', 'fs'],
    plugins: [dts(), nodeResolve(), commonjs()],
    output: {
      file: 'dist/raw-html-tag-css-extractor.d.ts',
      format: 'es',
    },
  },
];
