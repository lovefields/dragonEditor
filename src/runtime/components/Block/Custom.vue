<template>
    <div v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]" v-html="props.data.textContent" class="de-block de-custom-block" :class="[...props.data.classList]" @click="setEdit"></div>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import type { DECustomBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DECustomBlock; isEdit: boolean; index: number }>();

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}
</script>
