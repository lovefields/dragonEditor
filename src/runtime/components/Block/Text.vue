<template>
    <p
        v-memo="memoData"
        v-html="props.data.textContent"
        class="de-block de-text-block"
        :contenteditable="props.isEdit === true"
        :data-depth="props.data.depth"
        @focus="setEdit"
        @keydown="keydownEvent"
        @input="updateData"
    ></p>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { computed } from "vue";
import { _sliceAndNewTextBlock, _blockTabEvent, _moveBlockDefaultEvent,_defaultBackspaceEvent } from "../../utils/event";
import type { DETextBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DETextBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DETextBlock): void;
}>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
    editorStore.selectedBlockId = props.data.id;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
    editorStore.selectedBlockId = "";
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
            break;

        case "`":
            break;
    }
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DETextBlock;

    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
