import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/config.ts',
    external: ['@pandacss/dev'],
    plugins: [esbuild()],
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
    external: [/styled-system/],
    plugins: [esbuild(), nodeResolve()],
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
    external: [/styled-system/],
    plugins: [dts(), nodeResolve()],
    output: {
      file: 'dist/raw-html-tag.d.ts',
      format: 'es',
    },
  },
  {
    input: 'src/raw-html-tag-css-extractor.ts',
    external: [/styled-system/, 'fs'],
    plugins: [esbuild(), nodeResolve()],
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
    external: [/styled-system/, 'fs'],
    plugins: [dts(), nodeResolve()],
    output: {
      file: 'dist/raw-html-tag-css-extractor.d.ts',
      format: 'es',
    },
  },
];
