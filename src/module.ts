import { defineNuxtModule, createResolver, addComponent, addTypeTemplate, importModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "dragon-editor",
        compatibility: {
            nuxt: ">=3.0.0",
        },
    },
    async setup() {
        const { resolve } = createResolver(import.meta.url);
        const typeContent = await readFile(resolve("./runtime/type.d.mts"));

        await importModule("@pinia/nuxt");
        await importModule("@vueuse/nuxt");

        addComponent({
            name: "DragonEditor",
            filePath: resolve("./runtime/components/DragonEditor"),
        });

        addComponent({
            name: "DragonEditorViewer",
            filePath: resolve("./runtime/components/DragonEditorViewer"),
        });

        addTypeTemplate({
            filename: "types/dragon-editor.d.ts",
            getContents: () => `
                declare global {
                    ${typeContent}
                }

                export {}
            `,
        });
    },
});

async function readFile(path: string): Promise<string> {
    if (typeof Bun !== "undefined" && Bun.file) {
        // Bun 환경이면
        const file = Bun.file(path);

        return await file.text();
    } else {
        // Node.js 환경이면
        const { promises: fs } = await import("fs");

        return await fs.readFile(path, "utf-8");
    }
}
