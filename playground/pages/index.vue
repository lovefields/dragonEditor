<template>
    <div>
        Editor!

        <div class="editor">
            <DragonEditor v-model="contentData" :option="option" ref="editor" />
        </div>
        <button @click="test">업데이트</button>
        <button @click="addImage">이미지1!</button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const editor = ref();
const contentData = ref([
    {
        type: "ol",
        id: "ksadgjkl3",
        classList: [],
        childList: [
            {
                classList: [],
                content: "123<span>3333</span>",
            },
        ],
    },
]);
const option = {
    // blockMenu: ["text", "ol", "ul"],
    customBlockMenu: [
        {
            name: "Image",
            icon: "imageBlock",
            action: addImage,
        },
        {
            name: "Image",
            icon: "imageBlock",
            action: addImage2,
        },
    ],
};

function addImage() {
    editor.value.addImageBlock({
        src: "https://worldanimalfoundation.org/wp-content/uploads/2022/12/Choose-the-Proper-Location-at-First-review.jpg",
        width: 700,
        height: 474,
        webp: true,
    });
}

function addImage2() {
    editor.value.addImageBlock({
        src: "https://c.pxhere.com/images/37/e4/22c0adf08932049eb1b8af36cbd7-1622414.jpg!d",
        width: 1200,
        height: 1739,
        webp: false,
    });
}

function test() {
    editor.value.dataUpdateAction();
}

onMounted(() => {
    // console.log(editor);
    // console.log(editor.value.setContent(test));
});
</script>

<style>
body {
    background: #ccc;
}

.editor {
    width: 800px;
    margin: 100px auto;
}
</style>
