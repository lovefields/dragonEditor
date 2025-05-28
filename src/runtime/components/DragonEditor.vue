<template>
    <component :is="mainStrucutre()"></component>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onBeforeUnmount } from "vue";
import { _getBodyVNodeStructure, _getMenuBarVNodeStructure, _getControlbarVNodeStructure } from "../utils/layout";
import { _eidtorMountEvent, _eidtorUnmountEvent, _editorMousemoveEvent, _editorMouseupEvent, _editorMouseleaveEvent, _editorTouchmoveEvent, _editorTouchendEvent, _checkOthersideClick, _parentWrapScollEvent, _editorContextMenuEvent, _windowResizeEvent } from "../utils/event";
import { _addBlock } from "../utils/node";
import { _setDecoration, _setTextAlign } from "../utils/style";
import type { VNode } from "vue";
import { codeToHtml } from "shiki";
import type { DEBlockData, DEBlockMenutype, DEContentData, DEDecoration, DETextalign, DragonEditorStore } from "../type.d.ts";

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
        imageResizeEvent: false,
    },
    eventStatus: {
        imageResizeEventStartX: 0,
        imageResizeEventType: "left",
        imageResizeEventEndX: 0,
        imageResizeCurrentWidth: 0,
    },
    controlStatus: {
        isMobile: false,
        currentBlockType: "text",
        codeBlockTheme: "github-light",
        codeBlockLang: "text",
        listBlockStyle: "disc",
        anchorTabType: "url",
        anchorHeadingList: [],
        anchorHref: "",
        anchorValidation: false,
        previousCorsorData: null,
        $anchorInput: null,
        $currentBlock: null,
    },
    codeBlockTheme: [
        {
            text: "GitHub Ligth",
            code: "github-light",
        },
        {
            text: "GitHub Dark Dimmed",
            code: "github-dark-dimmed",
        },
    ],
    listUlType: [
        {
            text: "Disc",
            code: "disc",
        },
        {
            text: "Square",
            code: "square",
        },
    ],
    listOlType: [
        {
            text: "Decimal",
            code: "decimal",
        },
        {
            text: "Lower-Alpha",
            code: "lower-alpha",
        },
        {
            text: "Upper-Alpha",
            code: "upper-alpha",
        },
        {
            text: "Lower-Roman",
            code: "lower-roman",
        },
        {
            text: "Upper-Roman",
            code: "upper-roman",
        },
    ],
    $editor: null,
    $body: null,
    $controlBar: null,
    $parentWrap: null,
    codeToHtml: codeToHtml,
    emit: emit,
    windowClickEvent: function (event: MouseEvent) {
        _checkOthersideClick(event, editorStore);
    },
    windowResizeEvent: function (event: Event) {
        _windowResizeEvent(event, editorStore);
    },
    windowMouseUpEvent: function (event: MouseEvent) {
        _editorMouseupEvent(event, editorStore);
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

    if (editorStore.value.controlBar.active === true) {
        childList.push(_getControlbarVNodeStructure(editorStore));
    }

    return h(
        "div",
        {
            class: ["dragon-editor", "js-dragon-editor", { "--has-menu": editorStore.value.useMenuBar === true }, { "--mobile": editorStore.value.controlStatus.isMobile === true }],
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

// 외부용 블럭 추가 함수
function addBlock(data: DEBlockData): void {
    let type: DEBlockMenutype = "text";

    switch (data.type) {
        case "heading":
            if (data.level === 1) {
                type = "heading1";
            } else if (data.level === 2) {
                type = "heading2";
            } else {
                type = "heading3";
            }
            break;

        case "list":
            if (data.element === "ol") {
                type = "ol";
            } else {
                type = "ul";
            }
            break;
    }

    _addBlock(type, editorStore, data);
}

// 외부용 스타일 적용 함수
function setDecoration(style: DEDecoration): void {
    _setDecoration(`de-${style}`, editorStore);
}

// 외부용 정렬 함수
function setAlign(align: DETextalign): void {
    _setTextAlign(align, editorStore);
}

onMounted(() => {
    _eidtorMountEvent(editorStore);
});

onBeforeUnmount(() => {
    _eidtorUnmountEvent(editorStore);
});

defineExpose({
    addBlock,
    setDecoration,
    setAlign,
});
</script>

<style lang="scss">
@use "../scss/editor.scss";
</style>
