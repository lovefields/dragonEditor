import { defineNuxtModule, createResolver, addComponent } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "dragon-editor",
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addComponent({
            name: "DragonEditor",
            filePath: resolver.resolve("./runtime/components/DragonEditor"),
        });

        addComponent({
            name: "DragonEditorComment",
            filePath: resolver.resolve("./runtime/components/DragonEditorComment"),
        });

        addComponent({
            name: "DragonEditorViewer",
            filePath: resolver.resolve("./runtime/components/DragonEditorViewer"),
        });
    },
});
