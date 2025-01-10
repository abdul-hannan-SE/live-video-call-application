import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Allows the server to be accessed externally
    port: 5173,
    hmr: false,
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ["path"], // Add specific polyfills
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        fs: "memfs", // Use memfs package to polyfill fs module
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      src: "/src", // Simplify import paths
    },
  },
  define: {
    global: {}, // Provide a global object
  },
});
