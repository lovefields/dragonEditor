import hljs from "highlight.js/lib/common";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide("hljs", hljs);
    nuxtApp.provide("hljs", hljs);
});
