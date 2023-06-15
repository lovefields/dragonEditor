<template>
    <div class="d-image-block" :class="data.classList" ref="$block" @mousemove="resizeMouseEvent" @touchmove="resizeTouchEvent" @mouseup="doneResizeStatus" @touchend="doneResizeStatus">
        <div class="d-image-area">
            <button class="d-btn-size-left" @mousedown="startResizeEvent" @touchstart="startResizeEvent"></button>
            <button class="d-btn-size-right" @mousedown="startResizeEvent" @touchstart="startResizeEvent"></button>

            <template v-if="data.webp">
                <picture>
                    <source :srcset="data.src.replace(/\.(jpg|png|jpeg|apng|gif)/g, '.webp')" />
                    <img class="d-img" :src="data.src" :width="data.width" :height="data.height" :alt="data.caption" loading="lazy" />
                </picture>
            </template>

            <template v-else>
                <img class="d-img" :src="data.src" :width="data.width" :height="data.height" :alt="data.caption" loading="lazy" />
            </template>
        </div>
        <p class="d-caption" v-html="data.caption" @keydown="textKeyboardEvent" ref="$caption" contenteditable></p>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, unref } from "#imports";
import { keyboardEvent, pasteText, styleSettings } from "../../utils/index";
import { imageBlock, cursorSelection, styleFunctionArgument } from "../../../../types/index";

const $block = ref();
const $caption = ref();
const data = ref<imageBlock>({
    type: "",
    id: "",
    classList: [],
    src: "",
    width: 0,
    height: 0,
    webp: false,
    caption: "",
});
const props = defineProps<{ modelValue: imageBlock; cursorData: cursorSelection }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: imageBlock): void;
    (e: "addBlock", name: string): void;
    (e: "deleteBlockLocal", index?: number): void;
}>();

data.value = unref(props.modelValue) as imageBlock;

/**
 * 내부 상수
 */
let activeResize = false;
let startX = 0;

/**
 * 내부 이벤트
 */
// 키보드 이벤트 할당
function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("image", e, emit, updateBlockData);
}

// 리사이즈 시작
const startResizeStatus = (value) => {
    activeResize = true;
    startX = value;
};

function startResizeEvent() {
    // startResizeStatus(e.clientX);
    activeResize = true;
}

function activeResizeTouchEvent(e: TouchEvent) {
    // startResizeStatus(Math.floor(e.touches[0].clientX));
    activeResize = true;
}

// 리사이즈 이벤트
const resizeEvent = (value) => {
    if (activeResize) {
        const blockRect = $block.value.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const blockLeft = blockRect.left - bodyRect.left;
        const centerPoint: number = blockRect.width / 2 + blockLeft;
        const blockRight = window.innerWidth - (centerPoint + blockRect.width / 2);
        let percent: number = 0;

        // console.log(value);

        if (centerPoint > value) {
            // 왼쪽
            const leftPercent = (100 / (centerPoint - blockLeft)) * (value - blockLeft);

            percent = Math.floor(100 - leftPercent) + 2;
        } else {
            // 오른쪽
            const right = window.innerWidth - (centerPoint + blockRight);
            const valueData = value - centerPoint;
            const rightPercent = (100 / right) * valueData;

            percent = Math.floor(rightPercent);
        }

        percent = percent - (percent % 5);
        percent = percent / 5;

        const classList = data.value.classList.filter((item) => /--\d{1,2}/g.test(item) === false);
        classList.push(`--${percent}`);
        data.value.classList = classList;
    }
};

function resizeMouseEvent(e: MouseEvent) {
    resizeEvent(e.clientX);
}

function resizeTouchEvent(e: TouchEvent) {
    resizeEvent(Math.floor(e.touches[0].clientX));
}

// 리사이즈 종료
function doneResizeStatus() {
    activeResize = false;
}

/**
 * 외부용 함수
 */
function focus() {
    $caption.value.focus();
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

// 데이터 정규화 및 검수
function updateBlockData() {
    emit("update:modelValue", data.value);
}

// 텍스트 스타일 지정
function setStyles({ type, url }: styleFunctionArgument) {
    data.value = styleSettings({
        kind: type,
        blockData: data.value,
        $target: $block.value,
        cursorData: props.cursorData,
    });
    setTimeout(() => {
        updateBlockData();
    }, 250);
}

defineExpose({
    updateBlockData,
    getType,
    focus,
    pasteEvent,
    setStyles,
    getBoundingClientRect,
});
</script>
