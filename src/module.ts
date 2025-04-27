import { defineNuxtModule, createResolver, addComponent, addTypeTemplate, installModule } from "@nuxt/kit";

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
            filename: "type.d.ts",
            src: resolver.resolve(__dirname, "./runtime/type.d.ts"),
            write: true,
        });
    },
});
