<template>
    <div
        v-memo="memoData"
        v-html="props.data.textContent"
        class="de-block de-custom-block"
        :class="[...props.data.classList]"
        @click="setEdit"
    ></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEditorStore } from "../../store/editor";
import type { DECustomBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DECustomBlock; isEdit: boolean; index: number }>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockIndex === props.index;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}
</script>
