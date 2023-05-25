<template>
    <p class="d-text-block" contenteditable v-html="data.content" @keydown="textKeyboardEvent" ref="$block"></p>
</template>

<script setup lang="ts">
import {ref, unref, watch} from "#imports";
import {keyboardEvent} from "../utils/index";
import {textBlock, cursorSelection} from "../../types/index";

const $block = ref();
const data = ref<textBlock>({
    type: "",
    id: "",
    classList: [],
    content: "",
});
// const curosr = ref<cursorSelection>({
//     type: "",
//     startNode: null,
//     startOffset: null,
//     endNode: null,
//     endOffset: null,
// })
const props = defineProps<{ modelValue: textBlock }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: textBlock): void;
    (e: "addBlock", name: string): void;
}>();

data.value = unref(props.modelValue) as textBlock;


// var timer = null;
// window.addEventListener('scroll', function() {
//     if(timer !== null) {
//         clearTimeout(timer);
//     }
//     timer = setTimeout(function() {
//         // do something
//     }, 150);
// }, false);
// let event: ReturnType<typeof setTimeout>;

function textKeyboardEvent(e: KeyboardEvent) {
    const windowObject = window;

    keyboardEvent("text", e, emit);
}

function updateBlockData() {
    data.value.content = $block.value.innerHTML;
    emit("update:modelValue", data.value);
}

function focus() {
    const select = window.getSelection() as Selection;
    const range = document.createRange();

    range.setStart($block.value, 0);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);
}

defineExpose({
    updateBlockData,
    focus
});
</script>
