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
import type { DEContentData } from "../type.mjs";

interface DragonEditorViewerOption {
    content: DEContentData;
    mediaHostURL?: string;
    theme?: "dark" | "white";
}

const props = withDefaults(defineProps<DragonEditorViewerOption>(), {
    mediaHostURL: "",
    theme: "white",
});
</script>
