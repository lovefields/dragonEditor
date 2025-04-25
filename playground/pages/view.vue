<template>
    <div class="view-area">
        <DragonEditorViewer :content="data" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const data = ref<DEContentData>([
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
    { type: "code", theme: "github", filename: "123", language: "text", textContent: "332213231232132131313" },
]);
</script>

<style lang="scss">
.view-area {
    max-width: 800px;
    margin: 0 auto;
    font-size: 15px;
}
</style>
