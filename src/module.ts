import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'DragonEditor',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addComponent({
      name: 'DragonEditor',
      filePath: resolver.resolve('runtime/components/DragonEditor.vue')
    })

    addComponent({
      name: 'DragonEditorViewer',
      filePath: resolver.resolve('runtime/components/DragonEditorViewer.vue')
    })
  }
})
