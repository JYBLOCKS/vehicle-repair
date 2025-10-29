import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: "jsdom",
        },
      },
    ],
  },
});
