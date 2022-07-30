/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "GithubStorage",
      fileName: "github-storage",
    },
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
    setupFiles: ["src/testing/setup-vitest.ts"],
  },
});
