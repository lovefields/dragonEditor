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
]);
</script>

<style lang="scss">
.view-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
