import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: clientRoot,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000"
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: resolve(clientRoot, "src/test/setup.js"),
    include: ["src/**/*.test.{js,jsx}"]
  }
});
