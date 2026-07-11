import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "server-only" throws outside an RSC bundler — stub it in tests
      "server-only": path.resolve(__dirname, "src/test/server-only-stub.ts"),
    },
  },
});
