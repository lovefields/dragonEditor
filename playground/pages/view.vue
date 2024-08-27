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
    { type: "ul", child: [{ classList: ["de-item"], textContent: "5" }] },
    { type: "ol", pattern: "1", child: [{ classList: ["de-item"], textContent: "6" }] },
    { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", maxWidth: 50, width: 758, height: 499, caption: "", classList: [] },
]);
</script>

<style lang="scss">
.view-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
