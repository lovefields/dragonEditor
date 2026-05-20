<template>
    <p v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]" v-html="props.data.textContent" class="de-block de-text-block" :class="[...props.data.classList]" :data-depth="props.data.depth" :contenteditable="props.isEdit === true" @focus="setEdit" @blur="abortEdit" @input="updateData"></p>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import type { DETextBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DETextBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DETextBlock): void;
}>();

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DETextBlock;

    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
