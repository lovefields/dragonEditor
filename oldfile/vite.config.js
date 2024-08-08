import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" assert { type: "json" };
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            rollupTypes: true,
            insertTypesEntry: true,
        }),
    ],
    build: {
        // TODO : build option check
        outDir: ".output",
        sourcemap: true,
        minify: true,
        lib: {
            entry: resolve(__dirname, "src/main.ts"),
            name: pkg.name,
            fileName: "index",
            formats: ["es", "umd", "cjs"],
        },
        target: "modules",
    },
});
