<template>
    <component :is="renderHeading()" />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { h, withMemo } from "vue";
import { _sliceAndNewTextBlock, _blockTabEvent, _moveBlockDefaultEvent, _defaultBackspaceEvent, _defaultDeleteEvent } from "../../utils/event";
import type { VNode } from "vue";
import type { DEHeadingBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEHeadingBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEHeadingBlock): void;
}>();
const memoCache: any[] = [];

function setEdit() {
    editorStore.selectedBlockId = props.data.id;
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockId = "";
    editorStore.selectedBlockIndex = -1;
}

function keydownEvent(event: KeyboardEvent): void {
    switch (event.key) {
        case "Enter":
            // 엔터 이벤트
            if (event.shiftKey === false) {
                if (event.isComposing === false) {
                    _sliceAndNewTextBlock(event, props.data, props.index);
                } else {
                    event.preventDefault();
                }
            } else {
                // 쉬프트 엔터 이벤트
            }

            break;

        case "Tab":
            _blockTabEvent(event, props.data, props.index, setEdit, abortEdit);
            break;

        case "ArrowUp":
            _moveBlockDefaultEvent(event, "up");
            break;

        case "ArrowDown":
            _moveBlockDefaultEvent(event, "down");
            break;

        case "Backspace":
            _defaultBackspaceEvent(event);
            break;

        case "Delete":
            _defaultDeleteEvent(event, setEdit, abortEdit);
            break;

        case " ":
            break;
    }
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEHeadingBlock;

    newData.textContent = (event.target as HTMLHeadingElement).innerHTML;

    emit("update", newData);
}

function renderHeading(): VNode {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return withMemo(
        [memoKey],
        () =>
            h(`h${props.data.level}`, {
                class: ["de-block", "de-heading-block"],
                id: props.data.id,
                contenteditable: props.isEdit === true,
                "data-depth": props.data.depth,
                "data-level": props.data.level,
                innerHTML: props.data.textContent,
                onFocus: setEdit,
                onInput: updateData,
                onkeydown: keydownEvent,
            }),
        memoCache,
        0
    );
}
</script>
