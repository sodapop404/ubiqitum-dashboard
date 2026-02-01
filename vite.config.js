import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        keyBrandMetric_ringChart: "src/entries/ringChart.entry.js"
      },
      output: {
        entryFileNames: "[name].bundle.js"
      }
    }
  }
});
