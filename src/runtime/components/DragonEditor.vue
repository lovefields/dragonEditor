<template>
    <div class="dragon-editor" :class="{ '--hasMenu': props.useMenuBar === true }" ref="$editor">
        <div v-if="props.useMenuBar === true" class="de-control-bar">
            <button class="de-menu de-menu-add" @click="isActiveAddBlockMenu = !isActiveAddBlockMenu">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path d="M32 9C30.3431 9 29 10.3431 29 12V29H12C10.3431 29 9 30.3431 9 32C9 33.6569 10.3431 35 12 35H29V52C29 53.6569 30.3431 55 32 55C33.6569 55 35 53.6569 35 52V35H52C53.6569 35 55 33.6569 55 32C55 30.3431 53.6569 29 52 29H35V12C35 10.3431 33.6569 9 32 9Z"></path>
                </svg>
            </button>

            <div class="de-block-menu-area" :class="{ '--active': isActiveAddBlockMenu }">
                <div class="de-list">
                    <button class="de-add-block" @click="addBlock('text')">Text</button>
                    <button class="de-add-block" @click="addBlock('heading1')">Heading-1</button>
                    <button class="de-add-block" @click="addBlock('heading2')">Heading-2</button>
                    <button class="de-add-block" @click="addBlock('heading3')">Heading-3</button>
                    <button class="de-add-block" @click="addBlock('ul')">Unodered List</button>
                    <button class="de-add-block" @click="addBlock('ol')">Odered List</button>
                </div>
            </div>
        </div>

        <div class="de-body" ref="$content" @keydown="contentKeyboardEvent">
            <p class="de-block de-text-block" contenteditable="true"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEditorStore } from "../store";
import { _findScrollingElement } from "../utils/element";
import { _elementKeyEvent } from "../utils/keyboardEvent";
import { _createTextBlock, _createHeadingBlock, _createListBlock } from "../utils/block";
import "../type.d.ts";

const props = defineProps({
    useMenuBar: {
        type: Boolean,
        requiard: false,
        default: () => true,
    },
});
const editorStore = useEditorStore();
const isActiveAddBlockMenu = ref<boolean>(false);
const $editor = ref<HTMLDivElement>();
const $content = ref<HTMLDivElement>();

function contentKeyboardEvent(e: KeyboardEvent) {
    _elementKeyEvent(e, editorStore);
}

function addBlock(type: string) {
    isActiveAddBlockMenu.value = false;

    let blockStructure: HTMLElement | null = null;

    switch (type) {
        case "text":
            blockStructure = _createTextBlock();
            break;
        case "heading1":
        case "heading2":
        case "heading3":
            blockStructure = _createHeadingBlock(type);
            break;
        case "ul":
        case "ol":
            blockStructure = _createListBlock(type);
            break;
    }

    if (blockStructure !== null) {
        if (editorStore.cursorData === null) {
            (editorStore.$content as HTMLDivElement).insertAdjacentElement("beforeend", blockStructure);
        } else {
            let $target = editorStore.cursorData.startNode;

            if ($target.constructor.name === "Text") {
                $target = $target.parentNode as Node;
            }

            const $block = ($target as HTMLElement).closest(".de-block") as Element;

            $block.insertAdjacentElement("afterend", blockStructure);
        }

        switch (type) {
            case "ul":
            case "ol":
                (blockStructure.childNodes[0] as HTMLElement).focus();
                break;
            default:
                blockStructure.focus();
        }
    }
}   

onMounted(() => {
    if ($editor.value !== undefined) {
        editorStore.setWrapElement($editor.value);
        editorStore.setParentWrapElement(_findScrollingElement($editor.value));
    }

    if ($content.value !== undefined) {
        editorStore.setContentElement($content.value);
    }

    // TODO : set scroll event
});

onUnmounted(() => {});

defineExpose({
    addBlock,
});
</script>

<style lang="scss">
@import "../scss/editor.scss";
</style>
