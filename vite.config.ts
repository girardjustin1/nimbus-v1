/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Pre-bundle the CommonJS deps pulled in by @storybook/addon-vitest's setup
  // (via @testing-library) so their named/default exports resolve as proper ESM
  // in the browser test environment.
  optimizeDeps: {
    include: [
      "aria-query",
      "lz-string",
      "dom-accessibility-api",
      "@testing-library/dom",
      "@testing-library/jest-dom",
      "@testing-library/user-event",
      "chai"
    ]
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }, {
      // Fast Node tests for data, pacing logic and the prototype version registry.
      extends: true,
      test: {
        name: 'unit',
        environment: 'node',
        include: ['src/**/*.test.{ts,tsx}', 'prototypes/**/*.test.{ts,tsx}']
      }
    }]
  }
});