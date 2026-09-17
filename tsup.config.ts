import { defineConfig } from 'tsup';

const shared = {
  tsconfig: 'tsconfig.json',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  splitting: false,
} as const;

export default defineConfig([
  {
    ...shared,
    entry: { index: 'src/index.ts' },
    clean: true,
  },
  {
    ...shared,
    entry: { react: 'src/react/index.tsx' },
    external: ['react', 'react-dom'],
    banner: { js: "'use client';" },
  },
  {
    ...shared,
    entry: { preact: 'src/preact/index.tsx' },
    external: ['preact', 'preact/hooks'],
    banner: { js: "'use client';" },
    esbuildOptions(options) {
      options.jsx = 'automatic';
      options.jsxImportSource = 'preact';
    },
  },
  {
    ...shared,
    entry: { vue: 'src/vue/index.ts' },
    external: ['vue'],
  },
  {
    ...shared,
    entry: { svelte: 'src/svelte/index.ts' },
    external: ['svelte'],
  },
  {
    ...shared,
    entry: { solid: 'src/solid/index.ts' },
    external: ['solid-js'],
  },
  {
    ...shared,
    entry: { angular: 'src/angular/index.ts' },
    external: ['@angular/core'],
  },
]);
