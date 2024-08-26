<template>
    <div>
        editor!
        <div class="editor-area">
            <ClientOnly>
                <DragonEditor ref="$editor" />
            </ClientOnly>
        </div>
        <button @click="getContent">get data</button>
        <button @click="setContent">set data</button>
        <button @click="addImage">Add Image</button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";
const $editor = ref<DragonEditor>();

function getContent() {
    console.log("data", $editor.value?.getContentData());
}

function setContent() {
    $editor.value?.setContentData([
        { type: "text", textContent: "123" },
        { type: "text", textContent: "123" },
        { type: "heading", level: 1, id: "Sgdaow", textContent: "123" },
        { type: "heading", level: 2, id: "zlfm8i", textContent: "123" },
        { type: "heading", level: 3, id: "D0ZRSP", textContent: "123" },
        { type: "ul", child: ["123"] },
        { type: "ol", pattern: "1", child: ["123"] },
    ]);
}

function addImage() {
    $editor.value?.addImageBlock({
        src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
        width: 1365,
        height: 899,
    });
}
</script>

<style lang="scss">
.editor-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
