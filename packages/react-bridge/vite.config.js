import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": {},
  },
  build: {
    watch: true,
    lib: {
      entry: "src/index.ts",
      name: "umd",
      fileName: "index",
    },
  },
});
