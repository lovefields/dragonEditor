<template>
    <div class="dragon-editor" ref="$editor">
        <div v-if="props.useMenuBar === true" class="de-menu-area">menu bar!</div>
        <div class="de-body" ref="$content" @keydown="contentKeyboardEvent">
            <p class="de-block de-text-block" contenteditable></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEditorStore } from "../store";
import { _findScrollingElement } from "../utils/element";
import { _elementKeyEvent } from "../utils/keyboardEvent";
import "../type.d.ts";

const props = defineProps({
    useMenuBar: {
        type: Boolean,
        requiard: false,
        default: () => true,
    },
});
const editorStore = useEditorStore();
const $editor = ref<HTMLDivElement>();
const $content = ref<HTMLDivElement>();

function contentKeyboardEvent(e: KeyboardEvent) {
    _elementKeyEvent(e, editorStore);
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

defineExpose({});
</script>

<style lang="scss">
@import "../scss/editor.scss";
</style>
