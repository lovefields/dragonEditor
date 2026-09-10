export default defineNuxtConfig({
    compatibilityDate: "2024-08-08",
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        [
            "dragon-editor",
            {
                componentNameList: ["MyComponent"],
            },
        ],
    ],
    devtools: {
        enabled: false,
    },
});
