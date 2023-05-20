import { defineNuxtModule, addComponent,addImports, addImportsDir, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'dragon-editor',
    // configKey: 'dragon-editor'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addImportsDir(resolver.resolve('runtime/composables'));
    // addImports({
    //   name:"useKeyboard",
    //   as:'useKeyboard',
    //   from: resolver.resolve('runtime/composables/useKeyboard')
    // });

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
