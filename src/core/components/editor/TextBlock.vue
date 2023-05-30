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
function updateBlockData() { // 데이터 정규화 및 검수
    const blockClassList = [...$block.value.classList];
    blockClassList.splice(0, 1);
    const pushList = blockClassList.filter(item => data.value.classList.indexOf(item) === -1);

    data.value.classList = data.value.classList.concat(pushList);

    // 커서위치 재지정
    if ($block.value.innerHTML.length > 0) {
        const cursorData = getArrangementCursorData();
        const preChildCount = $block.value.childNodes.length;

        data.value.content = $block.value.innerHTML;
        emit("update:modelValue", data.value);

        setTimeout(() => {
            const $target = $block.value.childNodes[cursorData.childCount];
            const childCount = $block.value.childNodes.length;

            setCursor($block.value.childNodes[cursorData.childCount], cursorData.length);
        }, 100)
    } else {
        emit("update:modelValue", data.value);
    }
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
    setTimeout(() => {
        updateBlockData();
    }, 250);
}

defineExpose({
    updateBlockData,
    focus,
    getType,
    pasteEvent,
    setStyles
});
</script>
