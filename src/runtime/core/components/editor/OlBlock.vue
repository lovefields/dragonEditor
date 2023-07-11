<template>
    <ol class="d-ol-block" @keydown="textKeyboardEvent" ref="$ol" :key="updateCount">
        <li class="d-li-item" v-for="(row, i) in data.childList" :key="i" :class="row.classList" contenteditable ref="$item" v-html="row.content"></li>
    </ol>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, unref } from "#imports";
import { cursorSelection, liItem, listBlock, styleFunctionArgument } from "../../../../types";
import { getArrangementCursorData, setCursor, pasteText, styleSettings, keyboardEvent, getCursor, findEditableElement } from "../../utils";

const updateCount = ref<number>(0);
const $ol = ref();
const $item = ref();
const itemIdx = ref<number>(0);
const data = ref<listBlock>({
    type: "",
    id: "",
    childList: [
        {
            classList: [],
            content: "",
        },
    ],
});
const props = defineProps<{ modelValue: listBlock; cursorData: cursorSelection }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: listBlock): void;
    (e: "addBlock", {}: { name: string; value: object }): void;
    (e: "deleteBlockLocal", index?: number): void;
}>();
data.value = unref(props.modelValue) as listBlock;

if (data.value.childList.length === 0) {
}

// 키보드 이벤트 할당
function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("list", e, emit, updateBlockData);
}

/**
 * 외부용 함수
 */

// 데이터 정규화 및 검수
function updateBlockData() {
    const $block = $ol.value;
    const $childList = $block.querySelectorAll("li");
    const childData: liItem[] = [];
    const cursorData = getCursor();

    $childList.forEach((row) => {
        row.childNodes.forEach((child: ChildNode) => {
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

        childData.push({
            classList: [...row.classList].splice(1),
            content: row.innerHTML,
        });
    });

    data.value.childList = childData;
    emit("update:modelValue", data.value);
    updateCount.value += 1;

    if (cursorData.startNode) {
        const editableNode = findEditableElement(cursorData.startNode);
        let childIdx = -1;

        $childList.forEach((row, count) => {
            if (row === editableNode) {
                childIdx = count;
            }
        });

        if (childIdx > -1) {
            // 기본 로직
            itemIdx.value = childIdx;
            setTimeout(() => {
                const afterChildList = $ol.value.querySelectorAll("li");
                setCursor(afterChildList[childIdx], cursorData.startOffset as number);
            }, 100);
        } else {
            // 중간 엔터
            $childList.forEach((row, count) => {
                if (row === (cursorData.startNode as Node).parentNode) {
                    childIdx = count;
                }
            });

            setTimeout(() => {
                const afterChildList = $ol.value.querySelectorAll("li");
                setCursor(afterChildList[childIdx], cursorData.startOffset as number);
            }, 100);
        }
    }
}

// 포커스
function focus() {
    const childList = $ol.value.querySelectorAll(".d-li-item");
    setCursor(childList[itemIdx.value], 0);
}

// 블럭 위치 주기
function getBoundingClientRect() {
    return $ol.value.parentNode.getBoundingClientRect();
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
        $target: $item[itemIdx.value],
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
