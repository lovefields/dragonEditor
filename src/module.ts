import { defineNuxtModule, createResolver, addComponent } from "@nuxt/kit"

export default defineNuxtModule({
    meta: {
        name: "dragon-editor",
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        // addComponentsDir(resolver.resolve("./shared/components"));
        addComponent({
            name: 'DragonEditorComment',
            filePath: resolver.resolve('./runtime/shared/components/DragonEditorComment')
        });
    }
})
