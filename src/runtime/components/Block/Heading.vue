<template>
    <component
        v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]"
        v-html="props.data.textContent"
        :is="tagName"
        class="de-block de-heading-block"
        :class="[...props.data.classList]"
        :id="props.data.id"
        :contenteditable="props.isEdit === true"
        :data-depth="props.data.depth"
        :data-level="props.data.level"
        @focus="setEdit"
        @blur="abortEdit"
        @input="updateData"
    />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { computed } from "vue";
import type { DEHeadingBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEHeadingBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEHeadingBlock): void;
}>();
const tagName = computed(() => `h${props.data.level}`);

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEHeadingBlock;

    newData.textContent = (event.target as HTMLHeadingElement).innerHTML;

    emit("update", newData);
}
</script>
