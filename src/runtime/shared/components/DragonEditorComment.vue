<template>
    <div class="dragon-editor --comment">
        <p class="d-text-block" :class="data.classList" contenteditable v-html="data.content" @keydown="textKeyboardEvent" @paste="pasteEvent" ref="$block"></p>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, unref } from "#imports";
import { keyboardEvent, setCursor, pasteText, styleSettings, getArrangementCursorData, getClipboardData, getCursor, findEditableElement } from "../../core/utils/index";
import { commentBlock, cursorSelection } from "../../../types/index";

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
const blockCursorData = ref<cursorSelection>({
    type: "",
    startNode: null,
    startOffset: null,
    endNode: null,
    endOffset: null,
});

data.value = unref(props.modelValue) as commentBlock;

function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("comment", e, emit, updateBlockData);
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
    const pushList = blockClassList.filter((item) => data.value.classList.indexOf(item) === -1);

    data.value.classList = data.value.classList.concat(pushList);

    // 커서위치 재지정
    if ($block.value.innerHTML.length > 0) {
        const cursorData = getArrangementCursorData(blockCursorData.value);

        data.value.content = $block.value.innerHTML;
        emit("update:modelValue", data.value);

        setTimeout(() => {
            setCursor($block.value.childNodes[cursorData.childCount], cursorData.length);

            // 구조 검수
            $block.value.childNodes.forEach((child: ChildNode) => {
                if (child.constructor.name !== "Text") {
                    // 텍스트가 아닐경우
                    if (child.constructor.name !== "HTMLBRElement") {
                        // br 태그 유지
                        if (child.textContent === "") {
                            // 빈 태그 삭제
                            child.remove();
                        } else if ((child as HTMLElement).classList.length === 0) {
                            // 클레스 없는 엘리먼트 처리
                            (child as HTMLElement).insertAdjacentHTML("afterend", child.textContent as string);
                            child.remove();
                        }
                    } else {
                        (child as HTMLElement).removeAttribute("class");
                    }
                }
            });
        }, 100);
    } else {
        emit("update:modelValue", data.value);
    }
}

function focus() {
    setCursor($block.value, 0);
    blockCursorData.value = getCursor();
}

function setStyles(kind: string, url?: string) {
    data.value = styleSettings({
        kind: kind,
        blockData: data.value,
        $target: $block.value,
        url: url,
        cursorData: blockCursorData.value,
    });
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
    getCursorClassList,
});
</script>

<style>
@import "../../core/style/common.css";
</style>
