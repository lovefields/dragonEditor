<template>
    <div>
        <div class="editor">
            <button @click="changeData">test</button>
            <DragonEditorViewer :content="contentData" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const number = ref<number>(1);
const contentData = ref([
    { type: "text", classList: [], content: 'ㅇㄴㅁㄹ<span class="d-deco-bold">ㄴㅇㄹㄴㅇㅁㄹㄴㅁㅇ</span>ㄹㄹㄴㅁ' },
    { type: "text", classList: [], content: 'ㅇㄹㅁ<span class="d-deco-underline">ㄴㅇㄹㅁㄴ</span>ㄹㄴㄹ' },
    { type: "text", classList: [], content: "ㄴㅁㅇㄹㄴㅇㄹㄴㅁㄹㅇㄴㄹㅁ" },
    { type: "text", classList: [], content: 'ㄴㄹ<span class="d-deco-through">ㄴㅁㅇㄹㄴㅇㅁ</span>ㄹㄴ<code class="d-deco-code">ㅁㄹㄴㅁ</code>ㅇ' },
    { type: "text", classList: [], content: 'ㄹ<span class="d-deco-bold">ㄴㅁㄹㄴㅁㅇ</span><span class="d-deco-italic d-deco-bold">ㄹㄴㅁㄹ</span><span class="d-deco-italic">ㄴㄹ</span>ㄴㅁㄹ' },
    { type: "text", classList: [], content: "" },
    { type: "image", classList: ["d-align-center", "--10"], src: "https://c.pxhere.com/images/37/e4/22c0adf08932049eb1b8af36cbd7-1622414.jpg!d", width: 1200, height: 1739, webp: false, caption: undefined },
    { type: "text", classList: [], content: 'sadfasdfsa<a href="sdafsadfsadf" rel="nofollow" class="d-deco-link">dfsdfsadfsafsafsa</a>fsafsafsafasd' },
    { type: "ol", classList: [], childList: [{ classList: [], content: "1233333" }] },
    {
        type: "ul",
        classList: [],
        childList: [
            { classList: [], content: "sdafsfksdfjkaslfj" },
            { classList: [], content: "saklfjsaldfjsklafs" },
            { classList: [], content: "skalfjsaklfjsadklfsafj" },
            { classList: [], content: "afkjsladf" },
            { classList: [], content: "jsadklfjsakldf" },
        ],
    },
    { type: "text", classList: [], content: "" },
]);

function changeData() {
    contentData.value = [
        { type: "text", classList: [], content: `${number.value}` },
        { type: "text", classList: [], content: "2" },
        { type: "text", classList: [], content: "3" },
        { type: "text", classList: [], content: "4" },
        { type: "text", classList: [], content: "5" },
        { type: "text", classList: [], content: "6" },
        { type: "image", classList: ["d-align-center", "--10"], src: "https://c.pxhere.com/images/37/e4/22c0adf08932049eb1b8af36cbd7-1622414.jpg!d", width: 1200, height: 1739, webp: false, caption: undefined },
        { type: "text", classList: [], content: "1" },
        { type: "ol", classList: [], childList: [{ classList: [], content: "3322" }] },
        {
            type: "ul",
            classList: [],
            childList: [
                { classList: [], content: "11" },
                { classList: [], content: "22" },
                { classList: [], content: "44" },
                { classList: [], content: "55" },
            ],
        },
    ];

    number.value += 1;
}
</script>

<style>
.editor {
    width: 800px;
}
</style>
