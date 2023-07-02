<template>
    <ol class="d-ol-block" @keydown="textKeyboardEvent" ref="$ol" :key="updateCount">
        <li class="d-li-item" v-for="(row, i) in data.childList" :key="i" :class="row.classList" contenteditable ref="$item" v-html="row.content"></li>
    </ol>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, unref } from "#imports";
import { cursorSelection, liItem, listBlock, styleFunctionArgument } from "../../../../types";
import { getArrangementCursorData, setCursor, pasteText, styleSettings, keyboardEvent } from "../../utils";

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
    keyboardEvent("ol", e, emit, updateBlockData);
}

/**
 * 외부용 함수
 */

// 데이터 정규화 및 검수
function updateBlockData() {
    const $block = $ol.value;
    const $childList = $block.querySelectorAll("li");
    const childData: liItem[] = [];

    $childList.forEach((row) => {
        console.log(row);
        childData.push({
            classList: [],
            content: row.innerHTML,
        });
    });
    // console.log($block);
    // console.log("$childList", $childList);

    data.value.childList = childData;
    emit("update:modelValue", data.value);
    updateCount.value += 1;
    // const blockClassList = [...$block.value.classList];
    // blockClassList.splice(0, 1);
    // const pushList = blockClassList.filter((item) => data.value.classList.indexOf(item) === -1);
    // data.value.classList = data.value.classList.concat(pushList);
    // // 클레스 검수
    // const checkClassIdx = data.value.classList.indexOf("d-text-block");
    // if (checkClassIdx > -1) {
    //     data.value.classList.splice(checkClassIdx, 1);
    // }
    // // 커서위치 재지정
    // if ($block.value.innerHTML.length > 0) {
    //     const cursorData = getArrangementCursorData(props.cursorData);
    //     data.value.content = $block.value.innerHTML;
    //     emit("update:modelValue", data.value);
    //     setTimeout(() => {
    //         if ($block.value) {
    //             setCursor($block.value.childNodes[cursorData.childCount], cursorData.length);
    //             // 구조 검수
    //             $block.value.childNodes.forEach((child: ChildNode) => {
    //                 const $child = child as HTMLElement;
    //                 if (child.constructor.name !== "Text") {
    //                     // 텍스트가 아닐경우
    //                     if (child.constructor.name !== "HTMLBRElement") {
    //                         // br 태그 유지
    //                         if (child.textContent === "") {
    //                             // 빈 태그 삭제
    //                             child.remove();
    //                         } else if ($child.classList.length === 0) {
    //                             // 클레스 없는 엘리먼트 처리
    //                             $child.insertAdjacentHTML("afterend", $child.innerHTML);
    //                             child.remove();
    //                         }
    //                     } else {
    //                         $child.removeAttribute("class");
    //                     }
    //                 }
    //             });
    //         }
    //     }, 100);
    // } else {
    //     emit("update:modelValue", data.value);
    // }
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
