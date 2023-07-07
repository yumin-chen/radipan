import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

export default [
  {
    input: `src/raw-html-tag.js`,
    plugins: [esbuild()],
    output: [
      {
        file: `dist/raw-html-tag.js`,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `src/raw-html-tag.js`,
    plugins: [dts()],
    output: {
      file: `dist/raw-html-tag.d.ts`,
      format: 'es',
    },
  },
  {
    input: `src/raw-html-tag-css-extractor.js`,
    plugins: [esbuild()],
    output: [
      {
        file: `dist/raw-html-tag-css-extractor.js`,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `src/raw-html-tag-css-extractor.js`,
    plugins: [dts()],
    output: {
      file: `dist/raw-html-tag-css-extractor.d.ts`,
      format: 'es',
    },
  },
]