import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [svelte({ compilerOptions: { dev: true } })],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': srcDir,
    },
    conditions: ['browser'],
  },
});
