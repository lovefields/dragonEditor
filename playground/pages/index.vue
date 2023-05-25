<template>
    <div>
        Editor!

        <div class="editor">
            <DragonEditor v-model="contentData" :option="option" ref="editor"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "#imports";

const editor = ref();
const contentData = ref([]);
const option = {
    blockMenu: ["text", "ol", "ul"],
    customBlockMenu: [
        {
            name: "Image",
            icon: "imageBlock",
            action: addImage
        }
    ]
};

function addImage() {
    editor.value.addImageBlock();
}

onMounted(() => {
    console.log(editor);
    // console.log(editor.value.setContent(test));
});
</script>

<style>
.editor {
    width: 800px;
}
</style>
