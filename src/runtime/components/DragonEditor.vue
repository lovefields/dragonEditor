<template>
    <div class="dragon-editor" :data-theme="props.theme">
        <component :is="_getBody(props.modelValue, true, updateEditorData)" />
    </div>
</template>

<script setup lang="ts">
import "../scss/editor.scss";
import { _getBody } from "../utils/layout/getBody";
import { useEditorStore } from "../store/editor";

interface DEOption {
    modelValue: DEContentData;
    useMenuBar?: boolean;
    mediaHostURL?: string;
    isMobile?: boolean;
    theme?: "dark" | "white";
}

const editorStore = useEditorStore();
const props = withDefaults(defineProps<DEOption>(), {
    useMenuBar: true,
    isMobile: false,
    mediaHostURL: "",
    theme: "white",
});
const emit = defineEmits<{
    (e: "update:modelValue", data: DEContentData): void;
    (e: "uploadImageEvent", file: File): void;
}>();

editorStore.setOption({
    isMobile: props.isMobile,
    mediaHostURL: props.mediaHostURL,
});

// 신규데이터 적용 함수
function updateEditorData(data: DEContentData): void {
    emit("update:modelValue", data);
}
</script>
