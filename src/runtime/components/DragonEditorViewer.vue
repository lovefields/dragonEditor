<template>
    <component :is="structure()"></component>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { VNode } from "vue";
import { _createBlockList } from "../utils/layout";

const props = withDefaults(
    defineProps<{
        content: DEContentData;
        imageHostURL?: string;
    }>(),
    {
        imageHostURL: "",
    }
);

function structure(): VNode {
    return h(
        "div",
        {
            class: ["dragon-editor-viewer"],
        },
        _createBlockList({
            blockList: props.content,
            isEditable: false,
            imageHostURL: props.imageHostURL,
        })
    );
}
</script>

<style lang="scss">
@use "../scss/viewer.scss";
</style>
