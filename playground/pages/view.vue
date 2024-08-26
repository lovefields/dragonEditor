<template>
    <div class="view-area">
        <DragonEditorViewer :content="data" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const data = ref<DEContentData>([
    { type: "text", textContent: "123" },
    { type: "text", textContent: "123" },
    { type: "heading", level: 1, id: "Sgdaow", textContent: "123" },
    { type: "heading", level: 2, id: "zlfm8i", textContent: "123" },
    { type: "heading", level: 3, id: "D0ZRSP", textContent: "123" },
    { type: "ul", child: ["123"] },
    { type: "ol", pattern: "1", child: ["123"] },
    { type: "image", src: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg", width: 758, height: 499, maxWidth: 100, caption: "" },
]);
</script>

<style lang="scss">
.view-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
