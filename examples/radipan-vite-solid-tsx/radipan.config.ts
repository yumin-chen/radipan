import { defineConfig } from 'radipan/config';

export default defineConfig({
  appEntry: 'src/App.tsx', // Path to app entry point
  jsxFramework: 'solid', // 'react' | 'solid' | 'preact' | 'vue' | 'qwik'
  outdir: '@design-system', // The output directory in /node_modules
  preflight: true, // Whether to use css reset
  recipeShaking: true, // Whether to trim unused recipe variants
  theme: {
    // Useful for theme customization
    extend: {},
  },
});