import { defineConfig } from 'radipan/config';

export default defineConfig({
  // Path to app entry point
  appEntry: 'src/App.ts',

  // Whether to use css reset
  preflight: true,

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system in /node_modules
  outdir: '@design-system',
});
