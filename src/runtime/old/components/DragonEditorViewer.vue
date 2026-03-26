<template>
    <div class="">
        <component :is="renderBlock"></component>
    </div>
    <!-- <component :is="structure()"></component> -->
</template>

<script setup lang="ts">
import { h } from "vue";
import type { VNode } from "vue";
import { _createBlockList } from "../utils/layout";
import TextBlock from "./Block/Text.vue";

function renderBlock(): VNode[] {
    const blockList: VNode[] = [];

    props.content.forEach((block, index) => {
        switch (block.type) {
            case "text":
                blockList.push(
                    h(TextBlock, {
                        data: block,
                        isEdit: false,
                    })
                );
                break;
            default:
                blockList.push(h("div", { class: "de-block", "data-type": block.type }, "Unknown block type"));
                break;
        }
    });

    return blockList;
}

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
