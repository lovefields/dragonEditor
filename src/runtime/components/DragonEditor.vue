<template>
    <div class="dragon-editor" :class="{ '--hasMenu': props.useMenuBar === true }" @mousemove="resizeEvent" @touchmove="resizeEvent" @mouseup="resizeEventEnd" @touchend="resizeEventEnd" @mouseleave="resizeEventEnd" ref="$editor">
        <div v-if="props.useMenuBar === true" class="de-menu-bar" :style="{ top: `${menuBarTop}px` }">
            <div class="de-menu-wrap">
                <button class="de-menu de-menu-add" @click="isActiveAddBlockMenu = !isActiveAddBlockMenu">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M50.6667 34.6668H34.6667V50.6668H29.3334V34.6668H13.3334V29.3335H29.3334V13.3335H34.6667V29.3335H50.6667V34.6668Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setDecoration('bold')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M40.6 31.4402C43.1866 29.6535 45 26.7202 45 24.0002C45 17.9735 40.3333 13.3335 34.3333 13.3335H17.6666V50.6668H36.44C42.0133 50.6668 46.3333 46.1335 46.3333 40.5602C46.3333 36.5068 44.04 33.0402 40.6 31.4402ZM25.6666 20.0002H33.6666C35.88 20.0002 37.6666 21.7868 37.6666 24.0002C37.6666 26.2135 35.88 28.0002 33.6666 28.0002H25.6666V20.0002ZM35 44.0002H25.6666V36.0002H35C37.2133 36.0002 39 37.7868 39 40.0002C39 42.2135 37.2133 44.0002 35 44.0002Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setDecoration('italic')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M26.6667 13.3335V21.3335H32.56L23.44 42.6668H16V50.6668H37.3333V42.6668H31.44L40.56 21.3335H48V13.3335H26.6667Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setDecoration('underline')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M32 45.3333C40.8267 45.3333 48 38.16 48 29.3333V8H41.3334V29.3333C41.3334 34.48 37.1467 38.6667 32 38.6667C26.8534 38.6667 22.6667 34.48 22.6667 29.3333V8H16V29.3333C16 38.16 23.1734 45.3333 32 45.3333ZM13.3334 50.6667V56H50.6667V50.6667H13.3334Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setDecoration('strikethrough')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M26.6667 52H37.3333V44H26.6667V52ZM13.3333 12V20H26.6667V28H37.3333V20H50.6667V12H13.3333ZM8 38.6667H56V33.3333H8V38.6667Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setDecoration('code')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M25.0667 44.2667L12.8 32L25.0667 19.7333L21.3334 16L5.33337 32L21.3334 48L25.0667 44.2667ZM38.9334 44.2667L51.2 32L38.9334 19.7333L42.6667 16L58.6667 32L42.6667 48L38.9334 44.2667Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setTextAlign('left')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M40 40H8V45.3333H40V40ZM40 18.6667H8V24H40V18.6667ZM8 34.6667H56V29.3333H8V34.6667ZM8 56H56V50.6667H8V56ZM8 8V13.3333H56V8H8Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setTextAlign('center')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M18.6667 40V45.3333H45.3333V40H18.6667ZM8 56H56V50.6667H8V56ZM8 34.6667H56V29.3333H8V34.6667ZM18.6667 18.6667V24H45.3333V18.6667H18.6667ZM8 8V13.3333H56V8H8Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setTextAlign('right')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M8 56H56V50.6667H8V56ZM24 45.3333H56V40H24V45.3333ZM8 34.6667H56V29.3333H8V34.6667ZM24 24H56V18.6667H24V24ZM8 8V13.3333H56V8H8Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="setTextAlign('justify')">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path" d="M8 56H56V50.6667H8V56ZM8 45.3333H56V40H8V45.3333ZM8 34.6667H56V29.3333H8V34.6667ZM8 24H56V18.6667H8V24ZM8 8V13.3333H56V8H8Z"></path>
                    </svg>
                </button>

                <button class="de-menu" @click="deleteBlock">
                    <svg class="de-icon" viewBox="0 0 64 64">
                        <path class="de-path --red" fill-rule="evenodd" clip-rule="evenodd" d="M42.6667 24V50.6667H21.3334V24H42.6667ZM38.6667 8H25.3334L22.6667 10.6667H13.3334V16H50.6667V10.6667H41.3334L38.6667 8ZM48 18.6667H16V50.6667C16 53.6 18.4 56 21.3334 56H42.6667C45.6 56 48 53.6 48 50.6667V18.6667Z"></path>
                    </svg>
                </button>
            </div>

            <div class="de-block-menu-area" :class="{ '--active': isActiveAddBlockMenu }">
                <div class="de-list">
                    <button class="de-add-block" @click="addBlock('text')">Text</button>
                    <button class="de-add-block" @click="addBlock('heading1')">Heading-1</button>
                    <button class="de-add-block" @click="addBlock('heading2')">Heading-2</button>
                    <button class="de-add-block" @click="addBlock('heading3')">Heading-3</button>
                    <button class="de-add-block" @click="addBlock('ul')">Unodered List</button>
                    <button class="de-add-block" @click="addBlock('ol')">Odered List</button>
                    <button class="de-add-block" @click="addBlock('code')">Code Block</button>
                    <!-- <button class="de-add-block" @click="addBlock('table')">Table Block</button> -->
                    <!-- <button class="de-add-block" @click="addBlock('video')">Video</button> youtube | vimeo -->
                </div>
            </div>
        </div>

        <div v-if="editorStore.$currentBlock !== null" class="de-control-bar" :class="{ '--active': editorStore.controlBar.active === true }" :style="{ top: `${editorStore.controlBar.y}px`, left: `${editorStore.controlBar.x}px` }" ref="$controlBar">
            <div v-if="['code'].includes(curruntType) === true" class="de-col">
                <p class="de-name">Theme :</p>
                <select class="de-selector" v-model="codeBlockTheme" @change="codeBlockThemeChangeEvent">
                    <option v-for="(item, i) in _getCodeBlockTheme()" :value="item.code" :key="`codeBlockTheme-${i}`">{{ item.text }}</option>
                </select>
            </div>

            <div v-if="['code'].includes(curruntType) === true" class="de-col">
                <p class="de-name">Language :</p>
                <select class="de-selector" v-model="codeblockLanguage" @change="codeblockLanguageChangeEvent">
                    <option v-for="(item, i) in _getCodeBlockLanguage()" :value="item.code" :key="`codeBlockLanuage-${i}`">{{ item.text }}</option>
                </select>
            </div>

            <div v-if="['list'].includes(curruntType) === true" class="de-col">
                <p class="de-name">List Style :</p>
                <select class="de-selector" v-model="listBlockStyle" @change="listBlockStyleChangeEvent">
                    <template v-if="editorStore.$currentBlock.tagName === 'UL'">
                        <option value="disc">Disc</option>
                        <option value="square">Square</option>
                    </template>

                    <template v-else>
                        <option value="decimal">Decimal</option>
                        <option value="lower-alpha">Lower-Alpha</option>
                        <option value="upper-alpha">Upper-Alpha</option>
                        <option value="lower-roman">Lower-Roman</option>
                        <option value="upper-roman">Upper-Roman</option>
                    </template>
                </select>
            </div>
        </div>

        <div class="de-body" ref="$content" @keydown="contentKeyboardEvent" @mouseup="updateCursorData" @mousedown="resizeEventStart" @touchstart="resizeEventStart" @paste="contentPasteEvent">
            <p class="de-block de-text-block" contenteditable="true"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEditorStore } from "../store";
import { _getCodeBlockTheme, _getCodeBlockLanguage, _setCodeBlockTheme, _setCodeBlockLanguage, _updateCodeBlockStyle, _setListBlockStyle, _updateListBlockStyle } from "../utils/controlBar";
import { _findScrollingElement, _findContentEditableElement } from "../utils/element";
import { _elementKeyEvent, _hotKeyEvent, _copyEvent, _pasteEvent } from "../utils/keyboardEvent";
import { _getBlockType, _createTextBlock, _createHeadingBlock, _createListBlock, _createImageBlock, _createCustomBlock, _createCodeBlock } from "../utils/block";
import { _setNodeStyle, _setTextAlign } from "../utils/style";
import { _setCursor, _setCursorData, _clenupCursor } from "../utils/cursor";
import { _getContentData, _setContentData } from "../utils/convertor";
import { _addBlockToContent } from "../utils/content";
import "../type.d.ts";

const props = defineProps({
    useMenuBar: {
        type: Boolean,
        requiard: false,
        default: () => true,
    },
    imageHostURL: {
        type: String,
        requiard: false,
        default: () => "",
    },
});
const emit = defineEmits<{
    (e: "addPasteImage", file: File): DEImage;
}>();
const editorStore = useEditorStore();
const isActiveAddBlockMenu = ref<boolean>(false);
const menuBarTop = ref<number>(0);
const curruntType = ref<string>("");
const codeBlockTheme = ref<string>("github");
const codeblockLanguage = ref<string>("text");
const listBlockStyle = ref<DEListStyle>("disc");
const anchorTagValue = ref<string>("");
const $editor = ref<HTMLDivElement>();
const $content = ref<HTMLDivElement>();
const $controlBar = ref<HTMLDivElement>();
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

    // 선택 블럭 업데이트
    if (e.target !== null) {
        const $block = (e.target as HTMLElement).closest(".de-block");

        if ($block !== null) {
            editorStore.setCurrentBlock($block as HTMLElement);
        }
    }

    controlBarStatusUpdate();
}
// 컨트롤 바 상태 업데이트
function controlBarStatusUpdate() {
    if (editorStore.$currentBlock !== null) {
        const { type } = _getBlockType(editorStore.$currentBlock);
        const activeList = ["code", "list"];

        curruntType.value = type;

        if (activeList.includes(curruntType.value) === true) {
            editorStore.controlBarActive();

            switch (type) {
                case "code":
                    _updateCodeBlockStyle(editorStore, codeBlockTheme, codeblockLanguage);
                    break;
                case "list":
                    _updateListBlockStyle(editorStore, listBlockStyle);
                    break;
            }
        } else {
            editorStore.controlBarDeactive();
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
        const $controlBar = (event.target as HTMLElement).closest(".de-menu-bar");

        if ($controlBar === null) {
            isActiveAddBlockMenu.value = false;
        }
    }
}

// 블럭 삭제
function deleteBlock() {
    if (editorStore.$currentBlock !== null) {
        const childCount: number = editorStore.$content?.childElementCount ?? 1;

        editorStore.$currentBlock.remove();
        editorStore.setCurrentBlock(null);

        if (childCount < 2) {
            // 모든 엘리먼트를 지우려는 경우
            const $block = _createTextBlock();

            editorStore.$content?.insertAdjacentElement("beforeend", $block);
            _setCursor($block, 0);
        }
    }
}

// 부모 요소 스크롤 이벤트 발생시 컨트롤 바 고정
function parentWrapScollEvent() {
    editorStore.setParentWrapElement(_findScrollingElement($editor.value as HTMLElement));

    if (props.useMenuBar === true && editorStore.$parentWrap !== null && editorStore.$editor !== null) {
        // 메뉴바를 사용하는 경우만

        const editorReac = editorStore.$editor.getBoundingClientRect();
        let scrollY: number = 0;

        if (editorStore.$parentWrap.constructor.name === "Window") {
            scrollY = (editorStore.$parentWrap as Window).scrollY;
        } else {
            scrollY = (editorStore.$parentWrap as HTMLElement).scrollTop;
        }

        let realElementY = editorReac.y + scrollY;

        if (editorStore.$parentWrap.constructor.name !== "Window") {
            const parentRect = (editorStore.$parentWrap as HTMLElement).getBoundingClientRect();

            realElementY -= parentRect.y;
        }

        if (scrollY > realElementY) {
            menuBarTop.value = scrollY - realElementY - 1;
        } else {
            menuBarTop.value = 0;
        }
    }
}

// 붙여넣기 이벤트
function contentPasteEvent(event: ClipboardEvent) {
    _pasteEvent(event, editorStore, emit);
}

/**
 * 이벤트 관련 영역 종료
 */

/**
 * 컨트롤 바 이벤트 관련 영역 시작
 */

// 코드 블럭 테마 적용
function codeBlockThemeChangeEvent() {
    _setCodeBlockTheme(editorStore, codeBlockTheme.value);
}

// 코드 블럭 언어 적용
function codeblockLanguageChangeEvent() {
    _setCodeBlockLanguage(editorStore, codeblockLanguage.value);
}

// 리스트 스타일 적용
function listBlockStyleChangeEvent() {
    _setListBlockStyle(editorStore, listBlockStyle.value);
}

/**
 * 컨트롤 바 이벤트 관련 영역 종료
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
        case "ol":
            blockStructure = _createListBlock({
                type: "list",
                element: type,
                style: type === "ul" ? "disc" : "decimal",
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
        case "code":
            blockStructure = _createCodeBlock({
                type: "code",
                theme: "github",
                filename: "",
                language: "Plain Text",
                textContent: "",
            });
            break;
    }

    if (blockStructure !== null) {
        _addBlockToContent(blockStructure, editorStore);

        switch (type) {
            case "ul":
            case "ol":
                (blockStructure.childNodes[0] as HTMLElement).focus();
                break;
            case "codeblock":
                blockStructure.querySelector("code")?.focus();
                break;
            default:
                blockStructure.focus();
        }

        editorStore.setCurrentBlock(blockStructure as HTMLElement);
        controlBarStatusUpdate();
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
    if (props.imageHostURL !== "") {
        data.src = props.imageHostURL + data.src;
    }

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
        return _getContentData(editorStore.$content, props.imageHostURL);
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

    if ($controlBar.value !== undefined) {
        editorStore.setContrulBar($controlBar.value);
    }

    window.addEventListener("click", checkOthersideClick, true);
    editorStore.$parentWrap?.addEventListener("scroll", parentWrapScollEvent, true);
});

onUnmounted(() => {
    window.removeEventListener("click", checkOthersideClick, true);
    editorStore.$parentWrap?.removeEventListener("scroll", parentWrapScollEvent, true);
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
