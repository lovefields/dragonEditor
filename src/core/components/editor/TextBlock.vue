<template>
    <p class="d-text-block" :class="data.classList" contenteditable v-html="data.content" @keydown="textKeyboardEvent"
       ref="$block"
    ></p>
</template>

<script setup lang="ts">
import {ref, unref} from "#imports";
import {keyboardEvent, setCursor, pasteText, styleSettings, getArrangementCursorData} from "../../utils/index";
import {textBlock} from "../../../types/index";

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
    keyboardEvent("text", e, emit);
}


// export event
function updateBlockData() {
    data.value.classList = [...$block.value.classList];
    data.value.content = $block.value.innerHTML;


    // FIXME : 텍스트 노드 병합 전 커서 위치를 병합 후 동일하게 맞추기
    // if ($block.value.innerHTML.length > 0) {
    //     const cursorData = getArrangementCursorData();
    //
    //
    //     console.log(cursorData);
    //     console.log($block.value.childNodes);
    // }

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
