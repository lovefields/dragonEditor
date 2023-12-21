import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            rollupTypes: true,
            insertTypesEntry: true,
        }),
    ],
    build: {
        outDir: ".output",
        sourcemap: true,
        lib: {
            //     // 여러 진입점은 객체 또는 배열로 지정할 수 있습니다.
            entry: resolve(__dirname, "src/main.ts"),
            name: pkg.name,
            // name: "DragonEditor",
            //     // // 적절한 확장자가 추가됩니다.
            fileName: "index",
            formats: ["es", "umd", "cjs"],
            //     // // "./core/script/index.ts",
        },
        target: "modules",
        // rollupOptions: {
        //     // input: ["./core/style/index.scss"],
        //     output: {
        //         dir: "./.dist",
        //         // entryFileNames: "editor.js",
        //         // assetFileNames: "editor.[ext]",
        //     },
        // },
        // watch: {},
    },
});
