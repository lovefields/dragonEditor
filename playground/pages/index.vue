<template>
    <div>
        <div class="editor-area" :class="{ '--sort': isChangeLayout === true }">
            <DragonEditor v-model="contentData" ref="$editor" @uploadImageEvent="pasteImageProcess" />
        </div>

        <button @click="setContent">set data</button>
        <button @click="addImage">Add Image</button>
        <button @click="addCustomBlock">Add Custom Block</button>
        <button @click="changeData">change data</button>
        <button @click="changeLayout">Change Layout</button>
        <button @click="checkEmpty">Check Empty</button>
        <p class="data">{{ contentData }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "#imports";
const contentData = ref<DEContentData>([]);
const isChangeLayout = ref<boolean>(false);
const $editor = ref<DragonEditor>();
let isChange: boolean = true;

function changeData() {
    let data: DEContentData = [];

    if (isChange === true) {
        data = [
            { type: "text", classList: [], textContent: "1" },
            { type: "heading", level: 1, id: "NPdq5F", classList: [], textContent: "2" },
            { type: "heading", level: 2, id: "jGhtze", classList: [], textContent: "3" },
            { type: "heading", level: 3, id: "ekGfGF", classList: [], textContent: "4" },
            { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, width: 379, height: 250, caption: "", classList: [] },
            { type: "list", element: "ol", style: "decimal", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "disc", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "square", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "lower-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "lower-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "upper-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "upper-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "custom", classList: ["de-custom-block", "new-data"], textContent: '<div class="my-custom-block">123</div>' },
            { type: "code", theme: "github-light", filename: "123", language: "text", textContent: "332213231232132131313" },
        ];
    } else {
        data = [
            { type: "code", theme: "github-light", filename: "123", language: "text", textContent: "332213231232132131313" },
            { type: "custom", classList: ["de-custom-block", "new-data"], textContent: '<div class="my-custom-block">123</div>' },
            { type: "list", element: "ol", style: "upper-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "upper-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "lower-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "lower-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "square", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "disc", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "decimal", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, width: 379, height: 250, caption: "", classList: [] },
            { type: "heading", level: 3, id: "ekGfGF", classList: [], textContent: "4" },
            { type: "heading", level: 2, id: "jGhtze", classList: [], textContent: "3" },
            { type: "heading", level: 1, id: "NPdq5F", classList: [], textContent: "2" },
            { type: "text", classList: [], textContent: "1" },
        ];
    }

    isChange = !isChange;
    $editor.value?.changeEditorData(data);
}

function setContent() {
    (
        [
            { type: "text", classList: [], textContent: "1" },
            { type: "heading", level: 1, id: "NPdq5F", classList: [], textContent: "2" },
            { type: "heading", level: 2, id: "jGhtze", classList: [], textContent: "3" },
            { type: "heading", level: 3, id: "ekGfGF", classList: [], textContent: "4" },
            { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, width: 379, height: 250, caption: "", classList: [] },
            { type: "list", element: "ol", style: "decimal", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "disc", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ul", style: "square", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "divider" },
            { type: "list", element: "ol", style: "lower-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "lower-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "upper-roman", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "list", element: "ol", style: "upper-alpha", child: [{ classList: ["de-item"], textContent: "1" }] },
            { type: "custom", classList: ["de-custom-block", "new-data"], textContent: '<div class="my-custom-block">123</div>' },
            { type: "code", theme: "github-light", filename: "123", language: "text", textContent: "332213231232132131313" },
        ] as DEBlockData[]
    ).forEach((data: DEBlockData) => {
        $editor.value?.addBlock(data);
    });
}

function addImage() {
    $editor.value?.addBlock({
        type: "image",
        maxWidth: 100,
        src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
        width: 1365,
        height: 899,
        caption: "",
        classList: [],
    });
}

function addCustomBlock() {
    $editor.value?.addBlock({
        type: "custom",
        classList: ["new-data"],
        textContent: `<div class="my-custom-block">123</div>`,
    });
}

function pasteImageProcess(file: File) {
    const url = URL.createObjectURL(file);
    const $img = document.createElement("img");

    $img.src = url;
    $img.onload = () => {
        $editor.value?.addBlock({
            type: "image",
            maxWidth: 100,
            src: url,
            width: $img.width,
            height: $img.height,
            caption: "",
            classList: [],
        });
    };
}

function changeLayout(): void {
    isChangeLayout.value = !isChangeLayout.value;
    $editor.value?.updateLayout();
}

function checkEmpty(): void {
    console.log($editor.value?.checkDataEmpty());
}
</script>

<style lang="scss">
.editor-area {
    max-width: 800px;
    margin: 0 auto;
    font-size: 15px;

    &.--sort {
        height: 200px;
        overflow: auto;
    }
}

.data {
    height: 2500px;
}
</style>
