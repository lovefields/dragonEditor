<template>
    <p v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]" :class="['de-block', 'de-text-block', ...data.classList]" :data-depth="data.depth" :contenteditable="isEdit" v-html="props.data.textContent" @focus="setEdit" @blur="abortEdit" @input="updateData"></p>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { DETextBlock } from "../../type.d.mts";
import { useEditorStore } from "../../store/editor";
const editorStore = useEditorStore();

const props = defineProps<{ data: DETextBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DETextBlock, index: number): void;
}>();

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data));
    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData, props.index);
}

// watch(
//     () => props.data,
//     () => {
//         if (editValue.value[0] !== editValue.value[1]) {
//             editValue.value[1] -= 1;
//         }
//     },
//     {
//         deep: true,
//     }
// );

// const $paragraph = document.createElement("p");

// if (data.depth !== undefined && data.depth !== 0) {
//     $paragraph.dataset["depth"] = String(data.depth);
// }

// $paragraph.classList.add("de-block", "de-text-block", ...data.classList);
// $paragraph.setAttribute("contenteditable", "true");
// $paragraph.innerHTML = data.textContent;

// return $paragraph;
</script>
