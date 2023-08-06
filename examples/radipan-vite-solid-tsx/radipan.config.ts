import { defineConfig } from "radipan/config";

export default defineConfig({
  include: ["src"], // Source paths to include for CSS processing
  exclude: [""], // Source paths to exclude from scanning
  includeNames: ["*.tsx"], // Source files to include for CSS processing
  excludeNames: ["index.tsx", "*.init.tsx", "*.lite.tsx", "*.d.tsx"], // Source files to exclude from scanning
  jsxFramework: "solid", // "react" | "solid" | "preact" | "vue" | "qwik"
  outdir: "@design-system", // The output directory in /node_modules
  preflight: true, // Whether to use css reset
  recipeShaking: true, // Whether to trim unused recipe variants
  sourceTranspile: {
    // Whether to transform `css` prop to corresponding `className`
    enabled: true,
    // File extension for the transpiled output files
    extension: ".lite.tsx",
  },
  theme: {
    // Useful for theme customization
    extend: {},
  },
});
