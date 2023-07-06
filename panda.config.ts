import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./node_modules/radipan/styled-system/exported/**/*.css.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},

    // Design tokens
    tokens: {
      colors: {
        // primary: { value: '#0FEE0F' },
        // secondary: { value: '#EE0F0F' },
        blue: {
          50: { value: 'hsl(212, 100%, 95%)' },
          100: { value: 'hsl(212, 100%, 90%)' },
          200: { value: 'hsl(212, 100%, 80%)' },
          300: { value: 'hsl(212, 100%, 70%)' },
          400: { value: 'hsl(212, 100%, 60%)' },
          500: { value: 'hsl(212, 100%, 50%)' },
          600: { value: 'hsl(212, 100%, 40%)' },
          700: { value: 'hsl(212, 100%, 30%)' },
          800: { value: 'hsl(212, 100%, 20%)' },
          900: { value: 'hsl(212, 100%, 10%)' },
        },
        green: {
          50: { value: 'hsl(129, 67.3%, 95%)' },
          100: { value: 'hsl(129, 67.3%, 90%)' },
          200: { value: 'hsl(129, 67.3%, 80%)' },
          300: { value: 'hsl(129, 67.3%, 70%)' },
          400: { value: 'hsl(129, 67.3%, 60%)' },
          500: { value: 'hsl(129, 67.3%, 50%)' },
          600: { value: 'hsl(129, 67.3%, 40%)' },
          700: { value: 'hsl(129, 67.3%, 30%)' },
          800: { value: 'hsl(129, 67.3%, 20%)' },
          900: { value: 'hsl(129, 67.3%, 10%)' },
        },
        red: {
          50: { value: 'hsl(3, 100%, 95%)' },
          100: { value: 'hsl(3, 100%, 90%)' },
          200: { value: 'hsl(3, 100%, 80%)' },
          300: { value: 'hsl(3, 100%, 70%)' },
          400: { value: 'hsl(3, 100%, 60%)' },
          500: { value: 'hsl(3, 100%, 50%)' },
          600: { value: 'hsl(3, 100%, 40%)' },
          700: { value: 'hsl(3, 100%, 30%)' },
          800: { value: 'hsl(3, 100%, 20%)' },
          900: { value: 'hsl(3, 100%, 10%)' },
        },
        gray: {
          25: { value: 'hsl(240, 40%, 98%)' },
          50: { value: 'hsl(240, 24%, 96%)' },
          100: { value: 'hsl(240, 11%, 91%)' },
          150: { value: 'hsl(240, 6%, 83%)' },
          200: { value: 'hsl(240, 5%, 79%)' },
          300: { value: 'hsl(240, 3%, 69%)' },
          400: { value: 'hsl(240, 2%, 57%)' },
          500: { value: 'hsl(240, 1%, 49%)' },
          600: { value: 'hsl(240, 1%, 39%)' },
          700: { value: 'hsl(240, 1%, 29%)' },
          750: { value: 'hsl(240, 2%, 23%)' },
          800: { value: 'hsl(240, 2%, 18%)' },
          900: { value: 'hsl(240, 3%, 11%)' },
          950: { value: 'hsl(240, 6%, 7%)' },
        },
      },
      sizes: {
        md: { value: '28rem' },
        lg: { value: '32rem' },
        xl: { value: '36rem' },
        '2xl': { value: '42rem' },
        '3xl': { value: '48rem' },
        '4xl': { value: '56rem' },
        '5xl': { value: '64rem' },
        '6xl': { value: '72rem' },
        '7xl': { value: '80rem' },
        '8xl': { value: '90rem' },
        full: { value: '100%' },
      },
      spacing: {
        gutter: { value: '32px' },
        gap: { value: '16px' },
        '0x': { value: '0px' },
        '1x': { value: '4px' },
        '2x': { value: '8px' },
        '3x': { value: '12px' },
        '4x': { value: '16px' },
        '5x': { value: '20px' },
        '6x': { value: '24px' },
        '7x': { value: '28px' },
        '8x': { value: '32px' },
        '9x': { value: '36px' },
      },
      radii: {
        xs: { value: '2px' },
        sm: { value: '4px' },
        md: { value: '6px' },
        lg: { value: '8px' },
        xl: { value: '12px' },
        '2xl': { value: '24px' },
        '3xl': { value: '36px' },
        full: { value: '9999px' },
      },
      fonts: {
        sans: {
          value: `Helvetica, Helvetica Neue, Roboto, Open Sans, Ubuntu,
          -apple-system, sans-serif, Droid Sans, 'Segoe UI', Tahoma, Arial,
          'Apple Color Emoji', 'Segoe UI Emoji', system-ui`,
        },
        mono: {
          value: `SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
          Courier, 'Courier New', monospace`,
        },
      },
      fontSizes: {
        '2xs': { value: '0.625rem' },
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
        '6xl': { value: '3.75rem' },
        '7xl': { value: '4.5rem' },
        '8xl': { value: '6rem' },
        '9xl': { value: '8rem' },
      },
    },
    semanticTokens: {
      colors: {
        danger: {
          value: { base: '{colors.red.500}', _dark: '{colors.red.400}' },
        },
        success: {
          value: { base: '{colors.green.500}', _dark: '{colors.green.400}' },
        },
        border: {
          DEFAULT: {
            value: { base: '{colors.gray.600}', _dark: '{colors.gray.300}' },
          },
          highlighted: {
            value: { base: '{colors.gray.650}', _dark: '{colors.gray.200}' },
          },
          muted: {
            value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: './node_modules/radipan/styled-system',
});
