import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

export default [
  {
    input: `src/panda-config.ts`,
    external: [ '@pandacss/dev'],
    plugins: [esbuild()],
    output: [
      {
        file: `dist/panda-config.js`,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `src/panda-config.ts`,
    external: [ '@pandacss/dev'],
    plugins: [dts()],
    output: {
      file: `dist/panda-config.d.ts`,
      format: 'es',
    },
  },
  {
    input: `src/raw-html-tag.ts`,
    external: [ /styled-system/],
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
    input: `src/raw-html-tag.ts`,
    external: [ /styled-system/],
    plugins: [dts()],
    output: {
      file: `dist/raw-html-tag.d.ts`,
      format: 'es',
    },
  },
  {
    input: `src/raw-html-tag-css-extractor.ts`,
    external: [ /styled-system/],
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
    input: `src/raw-html-tag-css-extractor.ts`,
    external: [ /styled-system/],
    plugins: [dts()],
    output: {
      file: `dist/raw-html-tag-css-extractor.d.ts`,
      format: 'es',
    },
  },
]
