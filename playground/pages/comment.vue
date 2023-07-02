<template>
    <div>
        Comment!

        <button @click="addOption">옵션!</button>
        <button @click="getStatus">상태!</button>
        <div class="editor">
            <DragonEditorComment v-model="contentData" ref="editor" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const contentData = ref({
    type: "comment",
    classList: [],
    content: "123ㄹ"
});
const editor = ref();

function addOption() {
    editor.value.setStyles("font-3322");
    getStatus();
}

function getStatus() {
    console.log(editor.value.getCursorClassList());
    editor.value.updateBlockData();
}
</script>

<style>
.editor {
    width: 800px;
}
</style>
