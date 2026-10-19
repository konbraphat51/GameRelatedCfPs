// Vite build configuration; base path matches the GitHub Pages project URL.
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/GameRelatedCfPs/",
  plugins: [vue()],
  test: {
    environment: "jsdom",
    include: ["Tests/**/*.test.ts"],
  },
});
