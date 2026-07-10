<template>
    <div
        class="dragon-editor"
        :class="{ '--has-menu': props.useMenuBar === true, '--mobile': editorStore.option.isMobile === true, '--hidden-parent': editorStore.status.isParentOverflowHidden === true }"
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
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { onClickOutside } from "@vueuse/core";
import { _createTextBlockData, _arrangementContentData, _addBlock, _addImageBlock, _checkDataIsEmpty } from "../utils/data";
import { _editorMountedEvent, _eidtorUnmountEvent } from "../utils/event";
import { _setDecoration, _setAlign } from "../utils/node";
import type { DEContentData } from "../type.d.mts";

interface DragonEditorOption {
    modelValue: DEContentData;
    useMenuBar?: boolean;
    mediaHostURL?: string;
    isMobile?: boolean;
    theme?: "dark" | "white";
    codeBlockSpaces?: number;
    acceptImageFormat?: string;
    anchorTagTarget?: string;
}

const editorStore = useEditorStore();
const props = withDefaults(defineProps<DragonEditorOption>(), {
    useMenuBar: true,
    isMobile: false,
    mediaHostURL: "",
    theme: "white",
    codeBlockSpaces: 4,
    acceptImageFormat: ".jpg,.jpeg,.png,.webp,.gif",
    anchorTagTarget: "_blank",
});
const emit = defineEmits<{
    (e: "update:modelValue", data: DEContentData): void;
    (e: "uploadImageEvent", files: File[]): void;
}>();
const $body = ref<HTMLDivElement | null>(null);
const $editor = ref<HTMLDivElement | null>(null);

// 옵션 저장
editorStore.option.isMobile = props.isMobile;
editorStore.option.mediaHostURL = props.mediaHostURL;
editorStore.option.codeBlockSpaces = props.codeBlockSpaces;
editorStore.option.acceptImageFormat = props.acceptImageFormat;
editorStore.option.anchorTagTarget = props.anchorTagTarget;

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

// 이미지 업로드 함수 래핑
function uploadImage(files: File[]): void {
    emit("uploadImageEvent", files);
}

onClickOutside($editor, () => {
    editorStore.selectedBlockIndex = -1;
    editorStore.selectedBlockId = "";
});

defineExpose({
    addBlock: _addBlock,
    addImageBlock: _addImageBlock,
    updateLayout: _editorMountedEvent,
    checkDataIsEmpty: _checkDataIsEmpty,
    setDecoration: (type: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
        _setDecoration(`de-${type}` as DEDecorationClass);
    },
    setAlign: _setAlign,
});

watch(
    () => props.modelValue,
    () => {
        // 데이터 싱크
        editorStore.data = props.modelValue;
        ifEmptyUpdateData();
    }
);

watch(
    () => props.isMobile,
    () => {
        editorStore.option.isMobile = props.isMobile;
    }
);

onMounted(() => {
    ifEmptyUpdateData();
    editorStore.element.body = $body.value;
    editorStore.element.editor = $editor.value;
    editorStore.fn.updateEditorData = updateEditorData;
    editorStore.fn.uploadImage = uploadImage;
    _editorMountedEvent();
});

onBeforeUnmount(() => {
    _eidtorUnmountEvent();
});
</script>
