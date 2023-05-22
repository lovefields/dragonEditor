import {defineNuxtModule, addComponentsDir, createResolver} from '@nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: 'dragon-editor',
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        addComponentsDir(resolver.resolve('./shared/components'));
    }
})
