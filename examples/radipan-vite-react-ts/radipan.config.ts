import { defineConfig } from "radipan/config";

export default defineConfig({
  appEntry: "src/App.ts", // Path to app entry point
  jsxFramework: "react", // 'react' | 'solid' | 'preact' | 'vue' | 'qwik'
  outdir: "@design-system", // The output directory in /node_modules
  preflight: true, // Whether to use css reset
  recipeShaking: true, // Whether to trim unused recipe variants
  sourceTranspile: {
    // Whether to transform `css` prop to corresponding `className`
    enabled: true,
    // File extension for the transpiled output files
    extension: ".lite.ts",
  },
  theme: {
    // Useful for theme customization
    extend: {},
  },
});
