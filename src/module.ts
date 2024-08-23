import { defineNuxtModule, createResolver, addComponent, addTypeTemplate, installModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "dragon-editor",
    },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addComponent({
            name: "DragonEditor",
            filePath: resolver.resolve("./runtime/components/DragonEditor"),
        });

        addComponent({
            name: "DragonEditorViewer",
            filePath: resolver.resolve("./runtime/components/DragonEditorViewer"),
        });

        addTypeTemplate({
            filename: "types/dragonEditor.d.ts",
            src: resolver.resolve("./runtime/type.d.ts"),
            write: true,
        });

        await installModule("@pinia/nuxt");
    },
});
