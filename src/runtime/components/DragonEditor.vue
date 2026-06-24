<template>
    <div
        class="dragon-editor"
        :class="{ '--has-menu': props.useMenuBar === true }"
        :data-theme="props.theme"
        ref="$editor"
    >
        <MenuBar />
        <component
            :is="_getBody(props.modelValue, true)"
            ref="$body"
        />
    </div>
</template>

<script setup lang="ts">
import "../scss/editor.scss";
import MenuBar from "./MenuBar.vue";
import { _getBody } from "../utils/layout";
import { useEditorStore } from "../store/editor";
import { ref, onMounted, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { _createTextBlockData, _arrangementContentData, _addBlock } from "../utils/data";
import type { DEContentData } from "../type.mjs";

interface DragonEditorOption {
    modelValue: DEContentData;
    useMenuBar?: boolean;
    mediaHostURL?: string;
    isMobile?: boolean;
    theme?: "dark" | "white";
    codeBlockSpaces?: number;
}

const editorStore = useEditorStore();
const props = withDefaults(defineProps<DragonEditorOption>(), {
    useMenuBar: true,
    isMobile: false,
    mediaHostURL: "",
    theme: "white",
    codeBlockSpaces: 4,
});
const emit = defineEmits<{
    (e: "update:modelValue", data: DEContentData): void;
    (e: "uploadImageEvent", file: File): void;
}>();
const $body = ref<HTMLDivElement | null>(null);
const $editor = ref<HTMLDivElement>();

// 옵션 저장
editorStore.option.isMobile = props.isMobile;
editorStore.option.mediaHostURL = props.mediaHostURL;
editorStore.option.codeBlockSpaces = props.codeBlockSpaces;

// 신규데이터 적용 함수
function updateEditorData(data: DEContentData): void {
    emit("update:modelValue", _arrangementContentData(data));
}

// 데이터 없는경우 텍스트 블럭 생성
function ifEmptyUpdateData(): void {
    if (props.modelValue.length === 0) {
        emit("update:modelValue", [_createTextBlockData()]);
    }
}

onClickOutside($editor, () => {
    editorStore.selectedBlockIndex = -1;
    editorStore.selectedBlockId = "";
});

defineExpose({
    addBlock: _addBlock,
});

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
