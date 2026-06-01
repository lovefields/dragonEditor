<template>
    <component :is="renderHeading()" />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { h, withMemo } from "vue";
import type { VNode } from "vue";
import type { DEHeadingBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEHeadingBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEHeadingBlock): void;
}>();

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

const memoCache: any[] = [];

function renderHeading(): VNode {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockIndex === props.index;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return withMemo(
        [memoKey],
        () =>
            h(`h${props.data.level}`, {
                class: ["de-block", "de-heading-block", ...props.data.classList],
                id: props.data.id,
                contenteditable: props.isEdit === true,
                "data-depth": props.data.depth,
                "data-level": props.data.level,
                innerHTML: props.data.textContent,
                onFocus: setEdit,
                onBlur: abortEdit,
                onInput: updateData,
            }),
        memoCache,
        0
    );
}
</script>
