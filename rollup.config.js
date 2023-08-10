import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const esbuildOptions = {
  // All options are optional
  include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  exclude: /(node_modules|dist)/, // default
  sourceMap: true, // default
  minify: true,
  target: "es2022",
  jsx: "transform", // default, or 'preserve'
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  // Like @rollup/plugin-replace
  define: {
    // __VERSION__: '"x.y.z"',
  },
  tsconfig: "tsconfig.json", // default
  // Add extra loaders
  loaders: {
    // Add .json files support
    // require @rollup/plugin-commonjs
    ".json": "json",
    // Enable JSX in .js files too
    ".js": "jsx",
  },
};

export default [
  {
    input: "src/cli/bin.ts",
    external: ["child_process"],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        banner: "#!/usr/bin/env node",
        file: "dist/bin.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
  {
    input: "src/cli/copy-artifacts.ts",
    external: ["child_process", "fs", "radipan/radipan.config.json"],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs(), json()],
    output: [
      {
        file: "dist/copy-artifacts.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: "src/cli/config.ts",
    external: ["@pandacss/dev"],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: "dist/config.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
  {
    input: "src/cli/config.ts",
    external: ["@pandacss/dev"],
    plugins: [dts()],
    output: {
      file: "dist/config.d.ts",
      format: "es",
    },
  },
  {
    input: "src/core/radipan.ts",
    external: [
      "react",
      "preact",
      "solid-js/h",
      "svelte-hyperscript",
      "radipan/design-system",
      "radipan/framework",
      "radipan/radipan.config.json",
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: "dist/radipan.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
  {
    input: "src/core/radipan.ts",
    plugins: [dts()],
    output: {
      file: "dist/radipan.d.ts",
      format: "es",
    },
  },
  {
    input: "src/core/html-tags.ts",
    external: ["radipan"],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: "dist/html-tags.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
  {
    input: "src/core/html-tags.d.ts",
    plugins: [dts()],
    output: {
      file: "dist/html-tags.d.ts",
      format: "es",
    },
  },
  {
    input: "src/jsx-runtime.ts",
    external: [
      "react",
      "preact",
      "solid-js/h",
      "svelte-hyperscript",
      "radipan",
      "radipan/css-extractor",
      "radipan/design-system",
      "radipan/framework",
      "radipan/radipan.config.json",
    ],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: "dist/jsx-runtime.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: "src/jsx-runtime.ts",
    plugins: [dts()],
    output: {
      file: "dist/jsx-runtime.d.ts",
      format: "es",
    },
  },
  {
    input: "src/css-extractor/html-tags.ts",
    external: [
      "fs",
      "react",
      "preact",
      "solid-js/h",
      "svelte-hyperscript",
      "radipan/radipan.config.json",
      "radipan/design-system",
      "radipan/framework",
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: "dist/css-extractor/html-tags.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: "src/css-extractor/radipan.ts",
    external: [
      "fs",
      "react",
      "preact",
      "solid-js/h",
      "svelte-hyperscript",
      "radipan/radipan.config.json",
      "radipan/design-system",
      "radipan/framework",
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs()],
    output: [
      {
        file: "dist/css-extractor/radipan.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: "src/css-extractor/css-extractor.ts",
    external: [
      "fs",
      "child_process",
      "radipan/css-extractor",
      "radipan/radipan.config.json",
    ],
    plugins: [esbuild(esbuildOptions)],
    output: [
      {
        file: "dist/css-extractor/css-extractor.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
  {
    input: "src/css-extractor/extract.ts",
    external: [
      "fs",
      "child_process",
      "radipan/css-extractor",
      "radipan/radipan.config.json",
    ],
    plugins: [esbuild(esbuildOptions), nodeResolve(), commonjs(), json()],
    output: [
      {
        file: "dist/css-extractor/extract.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
  },
];
