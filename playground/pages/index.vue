<template>
    <div>
        Editor!

        <!-- <div class="editor">
            <DragonEditor v-model="contentData" :option="option" ref="editor" />
        </div>
        <button @click="test">업데이트</button>
        <button @click="change">변경!</button>
        <button @click="addImage">이미지1!</button>
        <button @click="checkData">Check Data</button> -->
    </div>
</template>

<script setup lang="ts">
// import { ref, onMounted } from "#imports";

// const editor = ref();
// const contentData = ref<any>([
//     // {
//     //     type: "ol",
//     //     classList: [],
//     //     childList: [
//     //         {
//     //             classList: [],
//     //             content: "123<span>3333</span>",
//     //         },
//     //     ],
//     // },
//     // {
//     //     type: "text",
//     //     classList: [],
//     //     content: "",
//     // },
// ]);
// const option = {
//     // blockMenu: ["text", "ol", "ul"],
//     customBlockMenu: [
//         {
//             name: "Image",
//             icon: "ImageBlock",
//             action: addImage,
//         },
//         {
//             name: "Image",
//             icon: "ImageBlock",
//             action: addImage2,
//         },
//     ],
// };

// function checkData() {
//     console.log(editor.value.getContent());
// }

// function change() {
//     contentData.value = [
//         {
//             classList: [],
//             key: "kvBLnhT4zW5Jdc7Gi0DJ",
//             textContent: "83123921783712893718928912739173918937",
//             type: "text",
//         },
//     ];
// }

// function addImage() {
//     editor.value.addImageBlock({
//         src: "https://worldanimalfoundation.org/wp-content/uploads/2022/12/Choose-the-Proper-Location-at-First-review.jpg",
//         width: 700,
//         height: 474,
//     });
// }

// function addImage2() {
//     editor.value.addImageBlock({
//         src: "https://c.pxhere.com/images/37/e4/22c0adf08932049eb1b8af36cbd7-1622414.jpg!d",
//         width: 1200,
//         height: 1739,
//     });
// }

// function test() {
//     editor.value.dataUpdateAction();
// }

// onMounted(() => {
//     // console.log(editor);
//     // console.log(editor.value.setContent(test));
// });
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
