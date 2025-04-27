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

        addComponent({
            name: "DragonEditor",
            filePath: resolver.resolve(__dirname, "./runtime/components/DragonEditor"),
        });

        addComponent({
            name: "DragonEditorViewer",
            filePath: resolver.resolve(__dirname, "./runtime/components/DragonEditorViewer"),
        });

        addTypeTemplate({
            filename: "types/dragon-editor.d.ts",
            src: resolver.resolve(__dirname, "./types.d.ts"),
            write: true,
        });
    },
});
