<template>
    <p class="d-text-block" :class="data.classList" contenteditable v-html="data.content" @keydown="textKeyboardEvent" ref="$block"></p>
</template>

<script setup lang="ts">
import { ref, unref } from "#imports";
import { keyboardEvent, setCursor, pasteText, styleSettings, getArrangementCursorData } from "../../utils/index";
import { textBlock, styleFunctionArgument, cursorSelection } from "../../../../types/index";

const $block = ref();
const data = ref<textBlock>({
    type: "",
    id: "",
    classList: [],
    content: "",
});
const props = defineProps<{ modelValue: textBlock; cursorData: cursorSelection }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: textBlock): void;
    (e: "addBlock", {}: { name: string; value: object }): void;
    (e: "deleteBlockLocal", index?: number): void;
}>();

data.value = unref(props.modelValue) as textBlock;

// 키보드 이벤트 할당
function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("text", e, emit, updateBlockData);
}

/**
 * 외부용 함수
 */

// 데이터 정규화 및 검수
function updateBlockData() {
    const blockClassList = [...$block.value.classList];
    blockClassList.splice(0, 1);
    const pushList = blockClassList.filter((item) => data.value.classList.indexOf(item) === -1);

    data.value.classList = data.value.classList.concat(pushList);

    // 커서위치 재지정
    if ($block.value.innerHTML.length > 0) {
        const cursorData = getArrangementCursorData(props.cursorData);

        data.value.content = $block.value.innerHTML;
        emit("update:modelValue", data.value);

        setTimeout(() => {
            if ($block.value) {
                setCursor($block.value.childNodes[cursorData.childCount], cursorData.length);

                // 구조 검수
                $block.value.childNodes.forEach((child: ChildNode) => {
                    const $child = child as HTMLElement;

                    if (child.constructor.name !== "Text") {
                        // 텍스트가 아닐경우
                        if (child.constructor.name !== "HTMLBRElement") {
                            // br 태그 유지
                            if (child.textContent === "") {
                                // 빈 태그 삭제
                                child.remove();
                            } else if ($child.classList.length === 0) {
                                // 클레스 없는 엘리먼트 처리
                                $child.insertAdjacentHTML("afterend", $child.innerHTML);
                                child.remove();
                            }
                        } else {
                            $child.removeAttribute("class");
                        }
                    }
                });
            }
        }, 100);
    } else {
        emit("update:modelValue", data.value);
    }
}

// 포커스
function focus(type: string = "first") {
    if (type === "first") {
        setCursor($block.value, 0);
    } else {
        const childCount = $block.value.childNodes.length;
        const targetChild = $block.value.childNodes[childCount - 1];

        setCursor(targetChild, 0);
    }
}

// 블럭 위치 주기
function getBoundingClientRect() {
    return $block.value.parentNode.getBoundingClientRect();
}

// 타입 전달
function getType() {
    return data.value.type;
}

// 붙여넣기 이벤트
function pasteEvent(text: string) {
    pasteText("text", text);
}

// 텍스트 스타일 지정
function setStyles({ type, url }: styleFunctionArgument) {
    data.value = styleSettings({
        kind: type,
        blockData: data.value,
        $target: $block.value,
        url: url,
        cursorData: props.cursorData,
    });
    setTimeout(() => {
        updateBlockData();
    }, 250);
}

defineExpose({
    updateBlockData,
    focus,
    getType,
    pasteEvent,
    setStyles,
    getBoundingClientRect,
});
</script>
