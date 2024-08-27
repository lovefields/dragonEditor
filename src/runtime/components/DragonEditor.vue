<template>
    <div class="dragon-editor" :class="{ '--hasMenu': props.useMenuBar === true }" @mousemove="resizeEvent" @touchmove="resizeEvent" @mouseup="resizeEventEnd" @touchend="resizeEventEnd" @mouseleave="resizeEventEnd" ref="$editor">
        <div v-if="props.useMenuBar === true" class="de-control-bar">
            <button class="de-menu de-menu-add" @click="isActiveAddBlockMenu = !isActiveAddBlockMenu">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M32 9C30.3431 9 29 10.3431 29 12V29H12C10.3431 29 9 30.3431 9 32C9 33.6569 10.3431 35 12 35H29V52C29 53.6569 30.3431 55 32 55C33.6569 55 35 53.6569 35 52V35H52C53.6569 35 55 33.6569 55 32C55 30.3431 53.6569 29 52 29H35V12C35 10.3431 33.6569 9 32 9Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setDecoration('bold')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M15 50C15 52.7614 17.2386 55 20 55H32.9922C44.0389 55 49 49.3673 49 41.8571C49 35.1933 45.4069 31.9731 39.714 30.9461C39.6526 30.935 39.607 30.8816 39.607 30.8192C39.607 30.7636 39.6438 30.714 39.6966 30.6965C44.9893 28.9442 47.1479 25.5349 47.1479 20.6006C47.1479 13.1574 42.3191 9 32 9H20C17.2386 9 15 11.2386 15 14V50ZM29.3268 48.2274C26.5654 48.2274 24.3268 45.9888 24.3268 43.2274V39.3469C24.3268 36.5855 26.5654 34.3469 29.3268 34.3469H31.0078C36.3658 34.3469 39.3424 36.3586 39.3424 41.1195C39.3424 45.9475 36.4981 48.2274 31.3385 48.2274H29.3268ZM29.3268 28.4461C26.5654 28.4461 24.3268 26.2075 24.3268 23.4461V20.7055C24.3268 17.9441 26.5654 15.7055 29.3268 15.7055H30.4125C35.3074 15.7055 37.821 17.3149 37.821 22.0087C37.821 26.8367 34.5798 28.4461 30.1479 28.4461H29.3268Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setDecoration('italic')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M25 11C25 9.89543 25.8954 9 27 9H34H40H46C47.1046 9 48 9.89543 48 11C48 12.1046 47.1046 13 46 13H39.0435L29.9565 51H36C37.1046 51 38 51.8954 38 53C38 54.1046 37.1046 55 36 55H29H23H17C15.8954 55 15 54.1046 15 53C15 51.8954 15.8954 51 17 51H23.9565L33.0435 13H27C25.8954 13 25 12.1046 25 11Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setDecoration('underline')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M21 13C21 11.8954 20.1046 11 19 11C17.8954 11 17 11.8954 17 13V28C17 36.2843 23.7157 43 32 43C40.2843 43 47 36.2843 47 28V13C47 11.8954 46.1046 11 45 11C43.8954 11 43 11.8954 43 13V28C43 34.0751 38.0751 39 32 39C25.9249 39 21 34.0751 21 28V13ZM13 49C11.8954 49 11 49.8954 11 51C11 52.1046 11.8954 53 13 53H51C52.1046 53 53 52.1046 53 51C53 49.8954 52.1046 49 51 49H13Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setDecoration('strikethrough')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path
                        class="de-path"
                        d="M49 42.0827C49 46.213 47.3861 49.3985 44.1583 51.6391C40.9305 53.8797 36.4003 55 30.5676 55C25.2609 55 20.9589 54.3116 17.6613 52.9349C16.6952 52.5315 16.1274 51.5533 16.1274 50.5064C16.1274 48.407 18.3376 47.0078 20.3303 47.6687C21.2971 47.9893 22.2887 48.2735 23.305 48.5211C25.8816 49.142 28.3591 49.4525 30.7375 49.4525C34.4183 49.4525 37.2497 48.8991 39.2317 47.7923C41.2136 46.6585 42.2046 44.9442 42.2046 42.6496C42.2046 40.9219 41.4118 39.4507 39.8263 38.2359C38.9729 37.5555 37.669 36.8102 35.9145 36H47.1393C48.3798 37.7105 49 39.7381 49 42.0827ZM32.2534 28H19.0141C18.3351 27.3458 17.7693 26.6544 17.3166 25.9261C16.4389 24.4683 16 22.7271 16 20.7025C16 17.0851 17.5431 14.2371 20.6293 12.1585C23.7156 10.0528 27.9485 9 33.3282 9C37.3092 9 41.2187 9.61323 45.0567 10.8397C46.6953 11.3633 47.4248 13.2208 46.708 14.7845C46.04 16.2418 44.353 16.9113 42.8299 16.4114C39.2086 15.2228 35.8715 14.6285 32.8185 14.6285C29.4775 14.6285 26.9575 15.1279 25.2587 16.1268C23.5598 17.1256 22.7104 18.5023 22.7104 20.257C22.7104 21.4448 23.0219 22.4572 23.6448 23.294C24.296 24.1309 25.3295 24.9272 26.7452 25.6831C27.8244 26.2593 29.6605 27.0316 32.2534 28ZM11 30C9.89543 30 9 30.8954 9 32C9 33.1046 9.89543 34 11 34H53C54.1046 34 55 33.1046 55 32C55 30.8954 54.1046 30 53 30H11Z"
                    ></path>
                </svg>
            </button>

            <button class="de-menu" @click="setDecoration('code')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M35.2981 20C34.5175 20 33.8188 20.4842 33.5447 21.2151L25.9492 41.4698C25.4901 42.6941 26.3951 44 27.7026 44C28.4832 44 29.182 43.5158 29.4561 42.7849L37.0516 22.5302C37.5107 21.3059 36.6056 20 35.2981 20ZM11.013 35.0376C8.34071 33.499 8.34073 29.643 11.013 28.1045L18.8813 23.5745C19.8385 23.0234 21.0613 23.3526 21.6124 24.3098C22.1635 25.2671 21.8343 26.4899 20.8771 27.041L13.0088 31.571L20.8771 36.1011C21.8343 36.6522 22.1635 37.875 21.6124 38.8322C21.0613 39.7895 19.8385 40.1187 18.8813 39.5676L11.013 35.0376ZM53.1299 35.0376C55.8022 33.499 55.8022 29.643 53.1299 28.1045L45.2616 23.5745C44.3044 23.0234 43.0816 23.3526 42.5305 24.3098C41.9794 25.2671 42.3086 26.4899 43.2658 27.041L51.1341 31.571L43.2658 36.1011C42.3086 36.6522 41.9794 37.875 42.5305 38.8322C43.0816 39.7895 44.3044 40.1187 45.2616 39.5676L53.1299 35.0376Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setTextAlign('left')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13H23C24.1046 13 25 12.1046 25 11C25 9.89543 24.1046 9 23 9H11Z M11 51C9.89543 51 9 51.8954 9 53C9 54.1046 9.89543 55 11 55H53C54.1046 55 55 54.1046 55 53C55 51.8954 54.1046 51 53 51H11Z M9 39C9 37.8954 9.89543 37 11 37H37C38.1046 37 39 37.8954 39 39C39 40.1046 38.1046 41 37 41H11C9.89543 41 9 40.1046 9 39Z M11 23C9.89543 23 9 23.8954 9 25C9 26.1046 9.89543 27 11 27H53C54.1046 27 55 26.1046 55 25C55 23.8954 54.1046 23 53 23H11Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setTextAlign('center')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M24 11C24 9.89543 24.8954 9 26 9H38C39.1046 9 40 9.89543 40 11C40 12.1046 39.1046 13 38 13H26C24.8954 13 24 12.1046 24 11Z M9 53C9 51.8954 9.89543 51 11 51H53C54.1046 51 55 51.8954 55 53C55 54.1046 54.1046 55 53 55H11C9.89543 55 9 54.1046 9 53Z M17 39C17 37.8954 17.8954 37 19 37H45C46.1046 37 47 37.8954 47 39C47 40.1046 46.1046 41 45 41H19C17.8954 41 17 40.1046 17 39Z M9 25C9 23.8954 9.89543 23 11 23H53C54.1046 23 55 23.8954 55 25C55 26.1046 54.1046 27 53 27H11C9.89543 27 9 26.1046 9 25Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setTextAlign('right')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M39 11C39 9.89543 39.8954 9 41 9H53C54.1046 9 55 9.89543 55 11C55 12.1046 54.1046 13 53 13H41C39.8954 13 39 12.1046 39 11Z M9 53C9 51.8954 9.89543 51 11 51H53C54.1046 51 55 51.8954 55 53C55 54.1046 54.1046 55 53 55H11C9.89543 55 9 54.1046 9 53Z M25 39C25 37.8954 25.8954 37 27 37H53C54.1046 37 55 37.8954 55 39C55 40.1046 54.1046 41 53 41H27C25.8954 41 25 40.1046 25 39Z M9 25C9 23.8954 9.89543 23 11 23H53C54.1046 23 55 23.8954 55 25C55 26.1046 54.1046 27 53 27H11C9.89543 27 9 26.1046 9 25Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="setTextAlign('justify')">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path" d="M9 53C9 51.8954 9.89543 51 11 51H53C54.1046 51 55 51.8954 55 53C55 54.1046 54.1046 55 53 55H11C9.89543 55 9 54.1046 9 53Z M9 39C9 37.8954 9.89543 37 11 37H53C54.1046 37 55 37.8954 55 39C55 40.1046 54.1046 41 53 41H11C9.89543 41 9 40.1046 9 39Z M9 11C9 9.89543 9.89543 9 11 9H53C54.1046 9 55 9.89543 55 11C55 12.1046 54.1046 13 53 13H11C9.89543 13 9 12.1046 9 11Z M9 25C9 23.8954 9.89543 23 11 23H53C54.1046 23 55 23.8954 55 25C55 26.1046 54.1046 27 53 27H11C9.89543 27 9 26.1046 9 25Z"></path>
                </svg>
            </button>

            <button class="de-menu" @click="deleteBlock">
                <svg class="de-icon" viewBox="0 0 64 64">
                    <path class="de-path --red" fill-rule="evenodd" clip-rule="evenodd" d="M32 51C42.4934 51 51 42.4934 51 32C51 21.5066 42.4934 13 32 13C21.5066 13 13 21.5066 13 32C13 42.4934 21.5066 51 32 51ZM32 55C44.7026 55 55 44.7026 55 32C55 19.2974 44.7026 9 32 9C19.2974 9 9 19.2974 9 32C9 44.7026 19.2974 55 32 55ZM21.4142 42.6274C20.6332 41.8462 20.6332 40.5801 21.4142 39.7988L29.1715 32.0415L21.5858 24.4558C20.8047 23.6748 20.8047 22.4084 21.5858 21.6274C22.3668 20.8462 23.6332 20.8462 24.4142 21.6274L31.9999 29.2131L39.799 21.4141C40.58 20.6331 41.8464 20.6331 42.6274 21.4141C43.4084 22.1953 43.4084 23.4614 42.6274 24.2427L34.8284 32.0417L42.799 40.0122C43.58 40.7932 43.58 42.0596 42.799 42.8406C42.0179 43.6216 40.7516 43.6216 39.9706 42.8406L32.0001 34.8701L24.2426 42.6274C23.4616 43.4084 22.1953 43.4084 21.4142 42.6274Z"></path>
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
                    <!-- <button class="de-add-block" @click="addBlock('codeblock')">Code Block</button> -->
                    <!-- <button class="de-add-block" @click="addBlock('video')">Video</button> -->
                </div>
            </div>
        </div>

        <div class="de-body" ref="$content" @keydown="contentKeyboardEvent" @mouseup="updateCursorData" @mousedown="resizeEventStart" @touchstart="resizeEventStart">
            <p class="de-block de-text-block" contenteditable="true"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEditorStore } from "../store";
import { _findScrollingElement, _findContentEditableElement } from "../utils/element";
import { _elementKeyEvent, _hotKeyEvent } from "../utils/keyboardEvent";
import { _createTextBlock, _createHeadingBlock, _createListBlock, _createImageBlock, _createCustomBlock } from "../utils/block";
import { _setNodeStyle, _setTextAlign } from "../utils/style";
import { _setCursorData, _clenupCursor } from "../utils/cursor";
import { _getContentData, _setContentData } from "../utils/convertor";
import { _addBlockToContent } from "../utils/content";
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
let resizeEventActive: boolean = false;
let resizeStartX: number = 0;
let resizeType: string = "right";
let resizeEndX: number = 0;
let resizeCurruntWidth: number = 0;

/**
 * 이벤트 관련 영역 시작
 */

function contentKeyboardEvent(e: KeyboardEvent) {
    _elementKeyEvent(e, editorStore);
    _hotKeyEvent(e, editorStore);
}

function updateCursorData(e: MouseEvent) {
    const originalCursorData = editorStore.cursorData;

    _setCursorData(editorStore);

    if (editorStore.cursorData !== null && _findContentEditableElement(editorStore.cursorData.startNode) === null) {
        // 비정상 커서 값일 경우 초기화
        editorStore.cursorData = originalCursorData;
    }

    if (e.target !== null) {
        const $block = (e.target as HTMLElement).closest(".de-block");

        if ($block !== null) {
            editorStore.setCurrentBlock($block as HTMLElement);
        }
    }
}

// 사이즈 조정 이벤트 시작
function resizeEventStart(event: Event) {
    const $target = event.target as HTMLElement;

    if ($target !== null) {
        const $block = $target.closest(".de-block");

        if ($block?.classList.contains("de-image-block") === true && $target.classList.contains("de-btn") === true) {
            editorStore.setCurrentBlock($block as HTMLElement);
            resizeEventActive = true;

            if (event.type === "touchstart") {
                resizeStartX = (event as TouchEvent).touches[0].clientX;
            } else {
                resizeStartX = (event as MouseEvent).clientX;
            }

            if ($target.classList.contains("de-btn-left") === true) {
                resizeType = "left";
            } else {
                resizeType = "right";
            }

            resizeEndX = resizeStartX;

            const $imgArea = (editorStore.$currentBlock as HTMLElement).querySelector(".de-image-area") as HTMLDivElement;
            resizeCurruntWidth = parseInt($imgArea.dataset["maxwidth"] ?? "25");
        }
    }
}

// 사이즈 조정 이벤트
function resizeEvent(event: Event) {
    if (resizeEventActive === true) {
        const $imgArea = (editorStore.$currentBlock as HTMLElement).querySelector(".de-image-area") as HTMLDivElement;
        const contentWidth = (editorStore.$content?.offsetWidth ?? 0) / 2;
        let gap: number = 0;

        if (event.type === "touchmove") {
            resizeEndX = (event as TouchEvent).touches[0].clientX;
        } else {
            resizeEndX = (event as MouseEvent).clientX;
        }

        if (resizeType === "right") {
            gap = Math.floor(resizeStartX - resizeEndX);
        } else {
            gap = Math.floor(resizeEndX - resizeStartX);
        }

        const percent = (100 / contentWidth) * gap;
        let value = Math.floor(resizeCurruntWidth - percent);

        if (value < 25) {
            value = 25;
        }

        if (value > 100) {
            value = 100;
        }

        $imgArea.dataset["maxwidth"] = String(value);
    }
}

// 사이즈 조정 이벤트 종료
function resizeEventEnd() {
    if (resizeEventActive === true) {
        resizeEventActive = false;
    }
}

// 메뉴 외부 클릭시 닫기
function checkOthersideClick(event: MouseEvent) {
    if (event.target !== null) {
        const $controlBar = (event.target as HTMLElement).closest(".de-control-bar");

        if ($controlBar === null) {
            isActiveAddBlockMenu.value = false;
        }
    }
}

// 블럭 삭제
function deleteBlock() {
    if (editorStore.$currentBlock !== null) {
        editorStore.$currentBlock.remove();
    }
}

/**
 * 이벤트 관련 영역 종료
 */

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
            const level: number = parseInt(type.replace("heading", ""));

            blockStructure = _createHeadingBlock({
                type: "heading",
                classList: [],
                id: "",
                level: level,
                textContent: "",
            });
            break;
        case "ul":
            blockStructure = _createListBlock({
                type: type,
                child: [
                    {
                        classList: [],
                        textContent: "",
                    },
                ],
            });
            break;
        case "ol":
            blockStructure = _createListBlock({
                type: type,
                pattern: "1",
                child: [
                    {
                        classList: [],
                        textContent: "",
                    },
                ],
            });
            break;
        case "table":
            // TODO : table block
            break;
        case "codeblock":
            // TODO : Code Block
            break;
    }

    if (blockStructure !== null) {
        _addBlockToContent(blockStructure, editorStore);

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

function addCustomBlock(HTML: string, classList: string[] = []) {
    const blockStructure = _createCustomBlock({
        type: "custom",
        classList: classList,
        textContent: HTML,
    });

    _addBlockToContent(blockStructure, editorStore);
}

function addImageBlock(data: DEImage) {
    const blockStructure = _createImageBlock({
        ...data,
        type: "image",
        maxWidth: 100,
        classList: [],
    } as DEImageBlock);

    _addBlockToContent(blockStructure, editorStore);
}

function setDecoration(type: DEDecoration) {
    _setNodeStyle(`de-${type}`, editorStore);
}

function setTextAlign(type: DETextalign) {
    _setTextAlign(type, editorStore);
}

function getContentData(): DEContentData {
    if (editorStore.$content !== null) {
        return _getContentData(editorStore.$content);
    } else {
        console.error("[DragonEditor] Con't find content Element.");
        return [];
    }
}

function setContentData(data: DEContentData) {
    _setContentData(data, editorStore);
}

onMounted(() => {
    if ($editor.value !== undefined) {
        editorStore.setWrapElement($editor.value);
        editorStore.setParentWrapElement(_findScrollingElement($editor.value));
    }

    if ($content.value !== undefined) {
        editorStore.setContentElement($content.value);
    }

    window.addEventListener("click", checkOthersideClick, true);

    // TODO : set scroll event
});

onUnmounted(() => {
    window.removeEventListener("click", checkOthersideClick, true);

    // TODO : remove scroll event
});

defineExpose({
    addBlock,
    addImageBlock,
    setDecoration,
    setTextAlign,
    getContentData,
    setContentData,
    addCustomBlock,
});
</script>

<style lang="scss">
@import "../scss/editor.scss";
</style>
