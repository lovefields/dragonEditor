<template>
    <div class="d-image-block" :class="data.classList">
        <div class="d-image-area">
            <button class="d-btn-size-left"></button>
            <button class="d-btn-size-right"></button>

            <template v-if="data.webp">

            </template>

            <template v-else>
                <img class="d-img" :src="data.src" :width="data.width" :height="data.height" :alt="data.caption"
                    loading="lazy">
            </template>
        </div>
        <p class="d-caption" v-html="data.caption" @keydown="textKeyboardEvent" ref="$caption" contenteditable></p>
    </div>
</template>

<script setup lang="ts">
import { ref, unref } from "#imports";
import { keyboardEvent } from "../../utils/index";
import { imageBlock, cursorSelection } from "../../../../types/index";

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
const props = defineProps<{ modelValue: imageBlock, cursorData: cursorSelection }>();
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: imageBlock): void;
    (e: "addBlock", name: string): void;
}>();

data.value = unref(props.modelValue) as imageBlock;

// 키보드 이벤트 할당
function textKeyboardEvent(e: KeyboardEvent) {
    keyboardEvent("image", e, emit);
}

// 외부용 함수
function updateBlockData() { // 데이터 정규화 및 검수
    emit("update:modelValue", data.value);
}

defineExpose({
    updateBlockData,
});
</script>