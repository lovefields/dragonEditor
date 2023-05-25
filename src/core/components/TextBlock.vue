<template>
    <p class="d-text-block" :class="data.classList" contenteditable v-html="data.content" @keydown="textKeyboardEvent"
       ref="$block"
    ></p>
</template>

<script setup lang="ts">
import {ref, unref, watch} from "#imports";
import {keyboardEvent, setCursor, pasteText, styleSettings} from "../utils/index";
import {textBlock, cursorSelection} from "../../types/index";

const $block = ref();
const data = ref<textBlock>({
    type: "",
    id: "",
    classList: [],
    content: "",
});
const props = defineProps<{ modelValue: textBlock }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: textBlock): void;
    (e: "addBlock", name: string): void;
}>();

data.value = unref(props.modelValue) as textBlock;

function textKeyboardEvent(e: KeyboardEvent) {
    const windowObject = window;

    keyboardEvent("text", e, emit);
}

function blockHasClass(className: string) {
    const idx = data.value.classList.indexOf(className);
    return {
        result: idx > -1,
        index: idx
    };
}


// export event
function updateBlockData() {
    data.value.content = $block.value.innerHTML;
    emit("update:modelValue", data.value);
}

function focus() {
    setCursor($block.value, 0);
}

function getType() {
    return data.value.type;
}

function pasteEvent(text: string) {
    pasteText("text", text);
}

function setStyles(kind: string) {
    data.value = styleSettings(kind, data.value, $block.value);
    updateBlockData();
}

defineExpose({
    updateBlockData,
    focus,
    getType,
    pasteEvent,
    setStyles
});
</script>
