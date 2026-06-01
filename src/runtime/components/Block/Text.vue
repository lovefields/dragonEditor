<template>
    <p
        v-memo="memoData"
        v-html="props.data.textContent"
        class="de-block de-text-block"
        :class="[...props.data.classList]"
        :contenteditable="props.isEdit === true"
        :data-depth="props.data.depth"
        @focus="setEdit"
        @blur="abortEdit"
        @keydown="keydownEvent"
        @input="updateData"
    ></p>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { computed } from "vue";
import { _sliceAndNewTextBlock } from "../../utils/event";
import type { DETextBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DETextBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DETextBlock): void;
}>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockIndex === props.index;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
}

function keydownEvent(event: KeyboardEvent): void {
    console.log(event.key);

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
            break;

        case "ArrowUp":
            break;

        case "ArrowDown":
            break;

        case "Backspace":
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
