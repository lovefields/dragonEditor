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
        <button @click="addCustomBlock">Add Custom Block</button>
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
        { type: "text", classList: [], textContent: "1" },
        { type: "heading", level: 1, id: "NPdq5F", classList: [], textContent: "2" },
        { type: "heading", level: 2, id: "jGhtze", classList: [], textContent: "3" },
        { type: "heading", level: 3, id: "ekGfGF", classList: [], textContent: "4" },
        { type: "ul", child: [{ classList: ["de-item"], textContent: "5" }] },
        { type: "ol", pattern: "1", child: [{ classList: ["de-item"], textContent: "6" }] },
        { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, width: 758, height: 499, caption: "", classList: [] },
        { type: "custom", classList: ["de-custom-block", "new-data"], textContent: "<div class='my-custom-block'>123</div>" },
    ]);
}

function addImage() {
    $editor.value?.addImageBlock({
        src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
        width: 1365,
        height: 899,
    });
}

function addCustomBlock() {
    $editor.value?.addCustomBlock(`<div class="my-custom-block">123</div>`, ["new-data"]);
}
</script>

<style lang="scss">
.editor-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
