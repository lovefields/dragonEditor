<template>
    <div
        class="dragon-editor"
        :data-theme="props.theme"
    >
        <component
            :is="_getBody(props.modelValue, true)"
            ref="$body"
        />
    </div>
</template>

<script setup lang="ts">
import "../scss/editor.scss";
import { _getBody } from "../utils/layout";
import { useEditorStore } from "../store/editor";
import { ref, onMounted, watch } from "vue";
import { _createTextBlockData } from "../utils/data";
import type { DEContentData } from "../type.mjs";

interface DragonEditorOption {
    modelValue: DEContentData;
    useMenuBar?: boolean;
    mediaHostURL?: string;
    isMobile?: boolean;
    theme?: "dark" | "white";
}

const editorStore = useEditorStore();
const props = withDefaults(defineProps<DragonEditorOption>(), {
    useMenuBar: true,
    isMobile: false,
    mediaHostURL: "",
    theme: "white",
});
const emit = defineEmits<{
    (e: "update:modelValue", data: DEContentData): void;
    (e: "uploadImageEvent", file: File): void;
}>();
const $body = ref<HTMLDivElement | null>(null);

// 옵션 저장
editorStore.option.isMobile = props.isMobile;
editorStore.option.mediaHostURL = props.mediaHostURL;

// 신규데이터 적용 함수
function updateEditorData(data: DEContentData): void {
    emit("update:modelValue", data);
}

// 데이터 없는경우 텍스트 블럭 생성
function ifEmptyUpdateData(): void {
    if (props.modelValue.length === 0) {
        emit("update:modelValue", [_createTextBlockData()]);
    }
}

watch(
    () => props.modelValue,
    () => {
        // 데이터 싱크
        editorStore.data = props.modelValue;
        ifEmptyUpdateData();
    }
);

onMounted(() => {
    ifEmptyUpdateData();
    editorStore.element.body = $body.value;
    editorStore.fn.updateEditorData = updateEditorData;
});
</script>
