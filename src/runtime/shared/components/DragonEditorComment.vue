<template>
    <div class="dragon-editor">
        <p class="d-text-block" :class="data.classList" contenteditable v-html="data.content" @keydown="textKeyboardEvent"
            @paste="pasteEvent" ref="$block"></p>
    </div>
</template>

<script setup lang="ts">
import { ref, unref } from "#imports";
import {
    keyboardEvent,
    setCursor,
    pasteText,
    styleSettings,
    getArrangementCursorData,
    getClipboardData,
    getCursor,
    findEditableElement
} from "../../core/utils/index";
import { commentBlock } from "../../../types/index";

const $block = ref();
const data = ref<commentBlock>({
    type: "comment",
    classList: [],
    content: "",
});
const props = defineProps<{ modelValue: commentBlock }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: commentBlock): void;
}>();

data.value = unref(props.modelValue) as commentBlock;

function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("comment", e, emit);
}

function pasteEvent(e: ClipboardEvent) {
    e.preventDefault();
    const data = getClipboardData(e.clipboardData as DataTransfer);

    if (data.type === "text") {
        pasteText("text", data.value as string);
    }
}

// export event
function updateBlockData() {
    // 데이터 정규화 및 검수
    const blockClassList = [...$block.value.classList];
    blockClassList.splice(0, 1);
    const pushList = blockClassList.filter(
        (item) => data.value.classList.indexOf(item) === -1
    );

    data.value.classList = data.value.classList.concat(pushList);

    // 커서위치 재지정
    if ($block.value.innerHTML.length > 0) {
        const cursorData = getArrangementCursorData();

        data.value.content = $block.value.innerHTML;
        emit("update:modelValue", data.value);

        setTimeout(() => {
            setCursor(
                $block.value.childNodes[cursorData.childCount],
                cursorData.length
            );

            // 빈 태그 삭제
            $block.value.childNodes.forEach((child: ChildNode) => {
                if (
                    child.constructor.name !== "Text" &&
                    child.textContent === ""
                ) {
                    child.remove();
                }
            });
        }, 100);
    } else {
        emit("update:modelValue", data.value);
    }
}

function focus() {
    setCursor($block.value, 0);
}

function setStyles(kind: string) {
    data.value = styleSettings(kind, data.value, $block.value);
    setTimeout(() => {
        updateBlockData();
    }, 250);
}

function getCursorClassList(className: string) {
    const cursorData = getCursor();
    let value: string[] = [];

    if (cursorData.type === "Caret") {
        const type = (cursorData.startNode as Node).constructor.name;
        const editableElement = findEditableElement(cursorData.startNode as Node);
        let $target = cursorData.startNode as HTMLElement;

        if (type === "Text") {
            $target = (cursorData.startNode as HTMLElement).parentNode as HTMLElement;
        }

        if ($target !== editableElement) {
            value = [...$target.classList];
        }
    }

    return value;
}

defineExpose({
    updateBlockData,
    focus,
    setStyles,
    getCursorClassList
});
</script>

<style>
@import "../../core/style/common.css";
</style>
