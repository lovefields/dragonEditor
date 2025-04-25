import { defineNuxtModule, createResolver, addComponent, addTypeTemplate, installModule, addPlugin, addPluginTemplate } from "@nuxt/kit";

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
            filename: "types/dragonEditor.d.ts",
            src: resolver.resolve(__dirname, "./runtime/type.d.ts"),
            write: true,
        });

        addPluginTemplate({
            src: resolver.resolve(__dirname, "./runtime/plugin.mjs"),
            filename: "plugin.js",
            options: {
                name: "DragonEditor",
            },
        });

        nuxt.options.plugins.push(resolver.resolve(nuxt.options.buildDir, "plugin.js"));
        nuxt.options.build.transpile.push("highlight.js");
    },
});
