import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const test = "test";

    console.log("Plugin injected by dragon-editor!");
    return {
        provide: {
            test,
        },
    };
});
