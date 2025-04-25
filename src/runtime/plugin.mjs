import hljs from "highlight.js";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide("hljs", hljs);
    nuxtApp.provide("hljs", hljs);
});
