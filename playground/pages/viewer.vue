<template>
    <div>
        <div class="editor">
            <DragonEditorViewer :content="contentData" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const contentData = ref([
    { type: "text", id: "qhwAteZgDrnXEtHlVWoX", classList: [], content: 'ㅇㄴㅁㄹ<span class="d-deco-bold">ㄴㅇㄹㄴㅇㅁㄹㄴㅁㅇ</span>ㄹㄹㄴㅁ' },
    { type: "text", id: "V2etWRGSgYFE7ZxbLdtX", classList: [], content: 'ㅇㄹㅁ<span class="d-deco-underline">ㄴㅇㄹㅁㄴ</span>ㄹㄴㄹ' },
    { type: "text", id: "Nibhm2YQSNCSkXLEShmB", classList: [], content: "ㄴㅁㅇㄹㄴㅇㄹㄴㅁㄹㅇㄴㄹㅁ" },
    { type: "text", id: "11htrwpCeBW3rW4iZYCX", classList: [], content: 'ㄴㄹ<span class="d-deco-through">ㄴㅁㅇㄹㄴㅇㅁ</span>ㄹㄴ<code class="d-deco-code">ㅁㄹㄴㅁ</code>ㅇ' },
    { type: "text", id: "P2uhezqPyZgojNq4aggR", classList: [], content: 'ㄹ<span class="d-deco-bold">ㄴㅁㄹㄴㅁㅇ</span><span class="d-deco-italic d-deco-bold">ㄹㄴㅁㄹ</span><span class="d-deco-italic">ㄴㄹ</span>ㄴㅁㄹ' },
    { type: "text", id: "D3ubnFyQIjYfI9YWs4x6", classList: [], content: "" },
    { type: "image", id: "FgCpjlXNZVx7KgHKjEzO", classList: ["d-align-center", "--10"], src: "https://c.pxhere.com/images/37/e4/22c0adf08932049eb1b8af36cbd7-1622414.jpg!d", width: 1200, height: 1739, webp: false, caption: undefined },
    { type: "text", id: "0ygjWGTB4V6O2dAOgkPJ", classList: [], content: 'sadfasdfsa<a href="sdafsadfsadf" rel="nofollow" class="d-deco-link">dfsdfsadfsafsafsa</a>fsafsafsafasd' },
    { type: "ol", id: "ksadgjkl3", classList: [], childList: [{ classList: [], content: "1233333" }] },
    {
        type: "ul",
        id: "YyocAhurpA4eQ5fAxlTe",
        classList: [],
        childList: [
            { classList: [], content: "sdafsfksdfjkaslfj" },
            { classList: [], content: "saklfjsaldfjsklafs" },
            { classList: [], content: "skalfjsaklfjsadklfsafj" },
            { classList: [], content: "afkjsladf" },
            { classList: [], content: "jsadklfjsakldf" },
        ],
    },
    { type: "text", id: "B1akIdmWYW7vshudsRMN", classList: [], content: "" },
]);
</script>

<style>
.editor {
    width: 800px;
}
</style>
