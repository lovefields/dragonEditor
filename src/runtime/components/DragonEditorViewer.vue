<template>
    <div
        class="dragon-editor-viewer"
        :data-theme="props.theme"
    >
        <component :is="_getBody(props.content)"
    /></div>
</template>

<script setup lang="ts">
import "../scss/viewer.scss";
import { _getBody } from "../utils/layout";
import { useEditorStore } from "../store/editor";
import type { DEContentData } from "../type.mjs";

interface DragonEditorViewerOption {
    content: DEContentData;
    mediaHostURL?: string;
    isMobile?: boolean;
    theme?: "dark" | "white";
}

const editorStore = useEditorStore();
const props = withDefaults(defineProps<DragonEditorViewerOption>(), {
    mediaHostURL: "",
    isMobile: false,
    theme: "white",
});

// 옵션 저장
editorStore.option.isMobile = props.isMobile;
editorStore.option.mediaHostURL = props.mediaHostURL;
</script>
