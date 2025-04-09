<template>
    <component :is="mainStrucutre()"></component>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted } from "vue";
import { _getBodyVNodeStructure, _getMenuBarVNodeStructure } from "../utils/layout";
import { _eidtorMountEvent, _eidtorUnmountEvent, _editorMousemoveEvent, _editorMouseupEvent, _editorMouseleaveEvent, _editorTouchmoveEvent, _editorTouchendEvent, _checkOthersideClick, _parentWrapScollEvent, _editorContextMenuEvent } from "../utils/event";
import type { VNode } from "vue";
import "../type.d.ts";

interface DEOption {
    modelValue: DEContentData;
    useMenuBar?: boolean;
    imageHostURL?: string;
}

const props = withDefaults(defineProps<DEOption>(), {
    useMenuBar: true,
    imageHostURL: "",
});
const emit = defineEmits<{
    (e: "update:modelValue", data: DEContentData): void;
    (e: "uploadImageEvent", file: File): void;
}>();
const editorStore = ref<DragonEditorStore>({
    cursorData: null,
    message: {
        linkTextNoStyle: "Link text can't set any style.",
    },
    controlBar: {
        active: false,
        x: 0,
        y: 0,
        $element: null,
    },
    useMenuBar: props.useMenuBar,
    imageHostURL: props.imageHostURL,
    firstData: props.modelValue,
    menuBarTop: 0,
    activeStatus: {
        addBlockMenu: false,
        anchorInputArea: false,
        resizeEvent: false,
    },
    eventStatus: {
        preComposing: false,
        resizeEventStartX: 0,
        resizeEventType: "left",
        resizeEventEndX: 0,
        resizeCurruntWidth: 0,
        keyboardEnterCount: 0,
    },
    controlStatus: {
        curruntblockType: "text",
        codeBlockTheme: "github",
        codeBlockLang: "",
        listBlockStyle: "disc",
        anchorTabType: "url",
        anchorHeadingList: [],
        anchorHref: "",
        $anchorInput: null,
        $curruntblock: null,
    },
    $editor: null,
    $body: null,
    $controlbar: null,
    $parentWrap: null,
    emit: emit,
    windowClickEvent: function (event: MouseEvent) {
        _checkOthersideClick(event, editorStore);
    },
    parentWrapScollEvent: function (event: Event) {
        _parentWrapScollEvent(event, editorStore);
    },
});

function mainStrucutre(): VNode {
    const childList: VNode[] = [];

    if (editorStore.value.useMenuBar === true) {
        childList.push(_getMenuBarVNodeStructure(editorStore));
    }

    childList.push(_getBodyVNodeStructure(editorStore));

    return h(
        "div",
        {
            class: ["dragon-editor", "js-dragon-editor", { "--has-menu": editorStore.value.useMenuBar === true }],
            onMousemove: (event: MouseEvent) => _editorMousemoveEvent(event, editorStore),
            onMouseup: (event: MouseEvent) => _editorMouseupEvent(event, editorStore),
            onMouseleave: (event: MouseEvent) => _editorMouseleaveEvent(event, editorStore),
            onTouchmove: (event: TouchEvent) => _editorTouchmoveEvent(event, editorStore),
            onTouchend: (event: TouchEvent) => _editorTouchendEvent(event, editorStore),
            onContextmenu: (event: MouseEvent) => _editorContextMenuEvent(event, editorStore),
        },
        childList
    );
}

function addBlock(data: DEBlockData): void {}

onMounted(() => {
    _eidtorMountEvent(editorStore);
});

onUnmounted(() => {
    _eidtorUnmountEvent(editorStore);
});

defineExpose({
    //     addBlock,
    //     setDecoration,
    //     setAlign,
});
</script>

<style lang="scss">
@use "../scss/editor.scss";
</style>
