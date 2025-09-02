import { defineNuxtModule, createResolver, addComponent, addTypeTemplate } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "dragon-editor",
        compatibility: {
            nuxt: ">=3.0.0",
        },
    },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);
        const typeContent = await readFile(resolver.resolve("./runtime/type.d.mts"));

        addComponent({
            name: "DragonEditor",
            filePath: resolver.resolve("./runtime/components/DragonEditor"),
        });

        addComponent({
            name: "DragonEditorViewer",
            filePath: resolver.resolve("./runtime/components/DragonEditorViewer"),
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
