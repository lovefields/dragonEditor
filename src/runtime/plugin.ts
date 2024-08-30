import hljs from "highlight.js";

export default (nuxtApp: any): void => {
    nuxtApp.vueApp.provide("hljs", hljs);
    nuxtApp.provide("hljs", hljs);
};
