<template>
    <component :is="mainStrucutre()"></component>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted, defineExpose } from "vue";
import { _getBodyVNodeStructure, _getMenuBarVNodeStructure } from "../utils/layout";
import { _eidtorMountEvent, _eidtorUnmountEvent, _editorMousemoveEvent, _editorMouseupEvent, _editorMouseleaveEvent, _editorTouchmoveEvent, _editorTouchendEvent, _checkOthersideClick, _parentWrapScollEvent } from "../utils/event";
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
    preComposingStatus: false,
    $currentBlock: null,
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

// const isActiveAddBlockMenu = ref<boolean>(false);
// const isActiveLinkArea = ref<boolean>(false);
// const curruntType = ref<string>("");
// const codeBlockTheme = ref<string>("github");
// const codeblockLanguage = ref<string>("text");
// const listBlockStyle = ref<DEListStyle>("disc");
// const anchorValueError = ref<boolean>(false);
// const activeLinkTabType = ref<"url" | "heading">("url");
// const anchorHeadingList = ref<DEHeadingItem[]>([]);
// const anchorTagValue = ref<string>("");
// const $linkInput = ref<HTMLInputElement>();
// let resizeEventActive: boolean = false;
// let resizeStartX: number = 0;
// let resizeType: string = "right";
// let resizeEndX: number = 0;
// let resizeCurruntWidth: number = 0;

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
        },
        childList
    );
}

onMounted(() => {
    _eidtorMountEvent(editorStore);
});

onUnmounted(() => {
    _eidtorUnmountEvent(editorStore);
});

// defineExpose({
//     addBlock,
//     setDecoration,
//     setAlign,
// });
</script>

<style lang="scss">
@use "../scss/editor.scss";
</style>
