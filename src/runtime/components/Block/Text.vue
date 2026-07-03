<template>
    <p
        v-memo="memoData"
        v-html="props.data.textContent"
        class="de-block de-text-block"
        :class="props.data.classList"
        :contenteditable="props.isEdit === true"
        :data-depth="props.data.depth"
        @focus="setEdit"
        @keydown="keydownEvent"
        @input="updateData"
        @paste="_allDataPasteEvent($event, setEdit, abortEdit)"
    ></p>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { computed } from "vue";
import { _sliceAndNewTextBlock, _blockTabEvent, _moveBlockDefaultEvent, _defaultBackspaceEvent, _defaultDeleteEvent, _allDataPasteEvent, _convertTextBlockType, _convertTextBlockToCodeBlock, _convertTextBlockToDividerBlock, _updateCursorData } from "../../utils/event";
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
    _updateCursorData();
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
    editorStore.selectedBlockId = "";
}

function keydownEvent(event: KeyboardEvent): void {
    if (event.isComposing === false) {
        switch (event.key) {
            case "Enter":
                // 엔터 이벤트
                if (event.shiftKey === false) {
                    _sliceAndNewTextBlock(event, props.data, props.index);
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

            case "`":
                _convertTextBlockToCodeBlock(event, props.data, props.index);
                break;

            case "-":
                _convertTextBlockToDividerBlock(event, props.data, props.index);
                break;

            case " ":
                _convertTextBlockType(event, props.data, props.index);
                break;
        }
    } else {
        event.preventDefault();
    }
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DETextBlock;

    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
