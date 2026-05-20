<template>
    <div v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]" class="de-block de-divider-block" @click="setEdit"></div>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import type { DEDividerBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEDividerBlock; isEdit: boolean; index: number }>();

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}
</script>
