import { defineConfig } from "vite";

// Bundling only - actually pushing to Screeps is a separate, explicit step
// (see scripts/deploy.mjs) so a plain `npm run build` can never push code.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: "node18",
    sourcemap: false,
    // Unminified: this bundle is read (and sometimes debugged) directly in
    // Screeps' in-browser code editor, where a minifier's renamed
    // identifiers and collapsed whitespace make it unreadable.
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
      fileName: () => "main.js",
    },
  },
});
