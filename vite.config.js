import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            // 여러 진입점은 객체 또는 배열로 지정할 수 있습니다.
            entry: resolve(__dirname, "core/script/index.ts"),
            name: "editor",
            // 적절한 확장자가 추가됩니다.
            fileName: "index",
            // "./core/script/index.ts",
        },
        rollupOptions: {
            input: ["./core/style/index.scss"],
            output: {
                dir: "./src/runtime/script",
                // entryFileNames: "editor.js",
                assetFileNames: "editor.[ext]",
            },
        },
        watch: {},
    },
});
