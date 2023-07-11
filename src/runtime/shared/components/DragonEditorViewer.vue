<template>
    <div class="dragon-editor-viewer" v-html="convertToHTML(props.content)"></div>
</template>

<script setup lang="ts">
import { editorContentType } from "../../../types";
import { convertToHTML } from "../../core/utils";

const props = defineProps<{
    content: editorContentType;
}>();
</script>

<style>
@import "../../core/style/viewer.css";
</style>
