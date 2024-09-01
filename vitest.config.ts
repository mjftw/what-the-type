import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    alias: {
      "~": "./src",
    },
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
