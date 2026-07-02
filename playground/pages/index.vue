<template>
    <div
        class="area-page"
        :class="[`--${theme}`]"
    >
        <div
            class="editor-area"
            :class="{ '--sort': isChangeLayout === true, '--transform': isTransformLayout === true }"
        >
            <DragonEditor
                v-model="contentData"
                :theme="theme"
                ref="$editor"
                @uploadImageEvent="pasteImageProcess"
            />
        </div>

        <div class="list-menu">
            <button @click="setContent">Set Data</button>
            <button @click="clearContent">Clear Data</button>

            <button @click="addImage">Add Image</button>
            <button @click="addCustomBlock">Add Custom Block</button>
            <button @click="changeData">change data</button>
            <button @click="changeLayout">Change Layout</button>
            <button @click="changeLayout2">Change transform Layout</button>
            <button @click="checkEmpty">Check Empty</button>
            <button @click="checkEmpty2">Check Empty2</button>
            <button @click="changeTheme">Change Theme</button>
        </div>

        <p class="data">{{ contentData }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "#imports";
const contentData = ref<DEContentData>([]);
const isChangeLayout = ref<boolean>(false);
const isTransformLayout = ref<boolean>(false);
const theme = ref<"dark" | "white">("white");
const $editor = ref<DragonEditor>();
let isChange: boolean = true;

function changeTheme(): void {
    theme.value = theme.value === "white" ? "dark" : "white";
}

function setContent() {
    contentData.value = [
        { type: "text", classList: [], textContent: "1", id: "QT28ss" },
        { type: "text", classList: [], textContent: "2", id: "JP68kL" },
        { type: "heading", level: 1, id: "NPdq5F", classList: [], textContent: "2" },
        { type: "divider", id: "NjTdEf" },
        { type: "divider", id: "gmSApo" },
        { type: "divider", id: "FkbMXd" },
        { type: "heading", level: 2, id: "jGhtze", classList: [], textContent: "3" },
        { type: "heading", level: 3, id: "ekGfGF", classList: [], textContent: "4" },
        { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, caption: "", classList: [], id: "b7EwiK" },
        { type: "list", element: "ol", child: [{ classList: ["de-item"], textContent: "1", id: "PVfrgk" }], id: "vQdO2I" },
        { type: "list", element: "ul", child: [{ classList: ["de-item"], textContent: "1", id: "7DV3G2" }], id: "OWeCvb" },
        { type: "list", element: "ul", child: [{ classList: ["de-item"], textContent: "1", id: "OIcEVV" }], id: "9fLd38" },
        { type: "divider", id: "hvEMVO" },
        { type: "list", element: "ol", child: [{ classList: ["de-item"], textContent: "1", id: "sEVrGr" }], id: "AWIhj3" },
        { type: "list", element: "ol", child: [{ classList: ["de-item"], textContent: "1", id: "WU04nx" }], id: "ViLzZc" },
        { type: "list", element: "ol", child: [{ classList: ["de-item"], textContent: "1", id: "FlucL7" }], id: "y6Hzvv" },
        { type: "list", element: "ol", child: [{ classList: ["de-item"], textContent: "1", id: "Wb7gkV" }], id: "A4WGlp" },
        { type: "custom", textContent: '<div class="my-custom-block">123</div>', id: "GJZcXD" },
        { type: "code", filename: "123", language: "text", textContent: "332213231232132131313", id: "tLIvOl" },
    ];
}

function clearContent() {
    contentData.value = [];
}

function checkEmpty2(): void {
    console.log($editor.value?.checkDataEmpty(contentData.value));
}

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
            { type: "text", classList: [], textContent: "123" },
        ];
    }

    isChange = !isChange;
    contentData.value = data;
}

function addImage() {
    $editor.value?.addImageBlock("https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg");
}

function addCustomBlock() {
    $editor.value?.addBlock("custom", `<div class="my-custom-block">123</div>`);
}

async function pasteImageProcess(files: File[]) {
    for (let file of files) {
        const url = URL.createObjectURL(file);

        await $editor.value?.addImageBlock(url);
    }
}

function changeLayout(): void {
    isChangeLayout.value = !isChangeLayout.value;
    $editor.value?.updateLayout();
}

function changeLayout2(): void {
    isTransformLayout.value = !isTransformLayout.value;
    $editor.value?.updateLayout();
}

function checkEmpty(): void {
    console.log($editor.value?.checkDataEmpty());
}
</script>

<style lang="scss">
body {
    margin: 0;
}

.area-page {
    &.--dark {
        background: #09090b;
        color: #dfdfe1;

        .list-menu button {
            background: #555;
            color: #f1f1f1;
            border-color: #555;
        }
    }

    &.--white {
        background: #f9f9f9;
        color: #333;
    }

    &.--transform {
        height: 100vh;
        overflow: auto;

        .editor-area {
            height: 300vh;
        }
    }
}

.editor-area {
    max-width: 800px;
    padding: 50px 0;
    margin: 0 auto;
    font-size: 15px;

    &.--sort {
        height: 200vh;
        overflow: hidden;
    }

    &.--transform {
        margin-top: 200px;
        transform: translate(0, 0);
    }
}

.data {
    min-height: 1000px;
    word-break: break-all;
}
</style>
