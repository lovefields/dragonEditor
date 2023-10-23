<template>
    <div class="dragon-editor" @paste="pasteEvent" ref="$wrap" @mouseleave="deactiveMenuEvent" @keydown="deactiveMenuEvent">
        <div class="d-left-menu" :class="{ '--active': activeMenu }" :style="{ top: `${leftMenuPosition}px` }">
            <div class="d-add-block">
                <button class="d-btn-menu-pop" @click="toggleBlockAddMenu"></button>

                <div class="d-block-list" :class="{ '--active': activeBlockAddMenu }">
                    <button v-for="(row, count) in blockMenu" :key="count" class="d-btn-block" @click="row.action">
                        <SvgIcon v-if="row.hasIcon" :kind="row.icon" />
                        <div v-else class="d-icon" v-html="row.icon"></div>
                        <p class="d-name">{{ row.name }}</p>
                    </button>
                </div>
            </div>

            <div class="d-control-block">
                <button class="d-btn-block-pop" @click="toggleBlockControlMenu"></button>

                <div class="d-block-list" :class="{ '--active': activeBlockColtrolMenu }">
                    <button class="d-btn-block" @click="moveBlock('up')"> <SvgIcon kind="arrowUp" />Up </button>
                    <button class="d-btn-block" @click="moveBlock('down')"> <SvgIcon kind="arrowDown" />Down </button>
                    <button class="d-btn-block"> <SvgIcon kind="delete" />Delete </button>
                </div>
            </div>
        </div>

        <div
            class="d-link-box"
            :class="{ '--active': activeLinkBox }"
            :style="{
                top: `${linkBoxPosition.top}px`,
                left: `${linkBoxPosition.left}px`,
            }"
        >
            <template v-if="styleButtonList[2][0].active">
                <p class="d-input">{{ linkValue }}</p>
                <button class="d-btn-link" @click="decoLinkControl">
                    <SvgIcon kind="cancel" />
                </button>
            </template>
            <template v-else>
                <input type="url" class="d-input" v-model="linkValue" />
                <button class="d-btn-link" @click="decoLinkControl">
                    <SvgIcon kind="accept" />
                </button>
            </template>
        </div>

        <div class="d-style-menu" :class="{ '--active': activeMenu }" :style="{ top: `${styleMenuPosition}px` }">
            <div v-for="(column, count) in styleButtonList" :key="count" class="d-column">
                <template v-for="(item, j) in column">
                    <template v-if="item.type === 'single'">
                        <button v-if="item.target.indexOf(content[activeIdx].type) > -1" class="d-btn" :class="{ '--active': item.active }" @click="item.action">
                            <SvgIcon :kind="item.icon" />
                        </button>
                    </template>

                    <template v-else>
                        <button v-if="item.target.indexOf(content[activeIdx].type) > -1" class="d-btn --hug" @click="item.action(count, j)">{{ `${item.name} : ${item.value}` }}</button>

                        <div v-if="item.target.indexOf(content[activeIdx].type) > -1" class="d-child-list" :class="{ '--active': item.active }">
                            <button class="d-child-btn" v-for="(child, k) in item.childList" :key="k" @click="child.action(count, j)">{{ child.name }}</button>
                        </div>
                    </template>
                </template>
            </div>
            <div v-if="customStyleMenu.length > 0" class="d-column"></div>
        </div>

        <div class="d-row-block" v-for="(row, count) in content" :key="`${row.id}-wrap`" @click="activeIdx = count" @mouseenter="activeMenuEvent(count, $event)" @mousemove="activeMenuEvent(count, $event)" @mouseup="activeMenuEvent(count, $event)">
            <component ref="$child" v-model="content[count]" :key="row.id" :is="setComponentKind(row.type)" :cursorData="cursorData" @addBlock="addBlockLocal" @deleteBlockLocal="deleteBlockLocal" />
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, unref, onMounted } from "#imports";
import { createBlock, getClipboardData, getCursor } from "../../core/utils";
import type { editorOptions, editorMenu, EditorContentType, userCustomMenu, userStyleMenu, cursorSelection } from "../../../types/index";

// components
import SvgIcon from "../../core/components/SvgIcon";
import TextBlock from "../../core/components/editor/TextBlock.vue";
import ImageBlock from "../../core/components/editor/ImageBlock.vue";
import olBlock from "../../core/components/editor/OlBlock.vue";
import ulBlock from "../../core/components/editor/UlBlock.vue";

// 기본 정보
const props = defineProps<{
    modelValue: EditorContentType;
    option?: editorOptions;
}>();
const modelValue = ref<EditorContentType>([]);
const option = ref<editorOptions>({
    blockMenu: ["text", "ol", "ul"],
    // blockMenu: ["text", "ol", "ul", "table", "quotation"], // TODO : 다른 블럭 만들기
});

if (props.modelValue) {
    modelValue.value = props.modelValue;
}

if (props.option) {
    option.value = Object.assign(option.value, props.option);
}

const emit = defineEmits<{
    (e: "update:modelValue", modelValue: EditorContentType): void;
}>();

// 내부 데이터
const $wrap = ref();
const $child = ref();
const activeMenu = ref<boolean>(false);
const activeLinkBox = ref<boolean>(false);
const activeBlockAddMenu = ref<boolean>(false);
const activeBlockColtrolMenu = ref<boolean>(false);
const leftMenuPosition = ref<number>(0);
const styleMenuPosition = ref<number>(0);
const linkBoxPosition = ref({
    top: 0,
    left: 0,
});
const iconList = ["TextBlock", "ImageBlock", "ulBlock", "olBlock", "quotationBlock", "tableBlock"];
const blockMenu = ref<editorMenu[]>([]);
const customStyleMenu = ref<userStyleMenu[]>([]);
const content = ref<EditorContentType>([]);
const activeIdx = ref<number>(0);
const focusIdx = ref<number>(0);
const linkValue = ref<string>("");
const cursorData = ref<cursorSelection>({
    type: "",
    startNode: null,
    startOffset: null,
    endNode: null,
    endOffset: null,
});
const styleButtonList = ref([
    [
        {
            type: "single",
            name: "Align Left",
            icon: "alignLeft",
            active: false,
            target: ["text", "image", "table", "ul", "ol"],
            action: () => {
                setBlockDecoEvent("alignLeft");
            },
        },
        {
            type: "single",
            name: "Align Center",
            icon: "alignCenter",
            target: ["text", "image", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("alignCenter");
            },
        },
        {
            type: "single",
            name: "Align right",
            icon: "alignRight",
            target: ["text", "image", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("alignRight");
            },
        },
    ],
    [
        {
            type: "single",
            name: "Decoration Bold",
            icon: "decorationBold",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationBold");
            },
        },
        {
            type: "single",
            name: "Decoration Italic",
            icon: "decorationItalic",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationItalic");
            },
        },
        {
            type: "single",
            name: "Decoration Underline",
            icon: "decorationUnderline",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationUnderline");
            },
        },
        {
            type: "single",
            name: "Decoration Strikethrough",
            icon: "decorationStrikethrough",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationStrikethrough");
            },
        },
    ],
    [
        {
            type: "single",
            name: "Link",
            icon: "link",
            active: false,
            target: ["text", "table", "ul", "ol"],
            action: () => {
                activeLinkBox.value = !activeLinkBox.value;
            },
        },
    ],
    [
        {
            type: "single",
            name: "Decoration Code",
            icon: "codeBlock",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationCode");
            },
        },
    ],
    [
        {
            type: "list",
            name: "Font Size",
            value: "default",
            target: ["text"],
            active: false,
            action: (count, j) => {
                styleButtonList.value[count][j].active = !styleButtonList.value[count][j].active;
            },
            childList: [
                {
                    name: "default",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-4");
                        styleButtonList.value[count][j].value = "default";
                        styleButtonList.value[count][j].active = false;
                    },
                },
                {
                    name: "h1",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-1");
                        styleButtonList.value[count][j].value = "h1";
                        styleButtonList.value[count][j].active = false;
                    },
                },
                {
                    name: "h2",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-2");
                        styleButtonList.value[count][j].value = "h2";
                        styleButtonList.value[count][j].active = false;
                    },
                },
                {
                    name: "h3",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-3");
                        styleButtonList.value[count][j].value = "h3";
                        styleButtonList.value[count][j].active = false;
                    },
                },
                {
                    name: "h5",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-5");
                        styleButtonList.value[count][j].value = "h5";
                        styleButtonList.value[count][j].active = false;
                    },
                },
                {
                    name: "h6",
                    action: (count, j) => {
                        setBlockDecoEvent("heading-6");
                        styleButtonList.value[count][j].value = "h6";
                        styleButtonList.value[count][j].active = false;
                    },
                },
            ],
        },
    ],
]);

// 블럭 추가 메뉴 설정
blockMenu.value = setEditorMenu(option.value.blockMenu as string[], unref(option.value.customBlockMenu) as userCustomMenu[]);

// 유저 커스텀 스타일 메뉴
if (option.value.customStyleMenu) {
    customStyleMenu.value = unref(option.value.customStyleMenu);
}

// 컨텐츠 데이터 설정
if (modelValue.value && Array.isArray(modelValue.value)) {
    if (modelValue.value.length == 0) {
        addBlockLocal({ name: "text", time: true });
    } else {
        content.value = modelValue.value;
    }
} else {
    throw new Error("[DragonEditor]ERROR : You must set 'v-model' attribute and 'v-mode' type is must be Array.");
}

// local logic
function checkAlignActive(className: string) {
    const data = content.value[activeIdx.value];
    let value = false;

    switch (data.type) {
        case "text":
            value = data.classList.indexOf(className) > -1;
            break;
    }

    return value;
}

// 스타일 메뉴 엑티브 상황
function checkDecoActive() {
    styleButtonList.value[0][0].active = checkAlignActive("d-align-left");
    styleButtonList.value[0][1].active = checkAlignActive("d-align-center");
    styleButtonList.value[0][2].active = checkAlignActive("d-align-right");
    styleButtonList.value[1][0].active = hasClassNameCheckLogic("d-deco-bold");
    styleButtonList.value[1][1].active = hasClassNameCheckLogic("d-deco-italic");
    styleButtonList.value[1][2].active = hasClassNameCheckLogic("d-deco-underline");
    styleButtonList.value[1][3].active = hasClassNameCheckLogic("d-deco-through");
    styleButtonList.value[2][0].active = hasClassNameCheckLogic("d-deco-link");
    styleButtonList.value[3][0].active = hasClassNameCheckLogic("d-deco-code");
    styleButtonList.value[4][0].value = checkHeadingClass();
}

// 텍스트 스타일 확인용 함수
function hasClassNameCheckLogic(className: string) {
    const cursorData = getCursor();
    let value = false;

    if (cursorData.type === "Caret") {
        const type = (cursorData.startNode as Node).constructor.name;
        let $target = cursorData.startNode as HTMLElement;

        if (type === "Text") {
            $target = (cursorData.startNode as HTMLElement).parentNode as HTMLElement;
        }

        if ($target) {
            const classList = [...$target.classList];

            if (classList.indexOf(className) > -1) {
                value = true;
            }
        }

        if (className === "d-deco-link") {
            if (value) {
                linkValue.value = $target.getAttribute("href");
            } else {
                linkValue.value = "";
            }
        }
    }

    return value;
}

// 글자크기 클레스 확인
function checkHeadingClass(): string {
    let value: string = "";

    switch (true) {
        case hasClassNameCheckLogic("d-h1"):
            value = "h1";
            break;
        case hasClassNameCheckLogic("d-h2"):
            value = "h2";
            break;
        case hasClassNameCheckLogic("d-h3"):
            value = "h3";
            break;
        case hasClassNameCheckLogic("d-h5"):
            value = "h5";
            break;
        case hasClassNameCheckLogic("d-h6"):
            value = "h6";
            break;
        default:
            value = "default";
    }

    return value;
}

function setEditorMenu(vanillaData: string[], customData?: userCustomMenu[]) {
    const dataList: editorMenu[] = [];

    vanillaData.forEach((name) => {
        dataList.push({
            name: name,
            hasIcon: true,
            icon: `${name}Block`,
            action: () => {
                addBlockLocal({ name: name });
            },
        });
    });

    if (customData) {
        customData.forEach((row) => {
            dataList.push({
                name: row.name,
                hasIcon: iconList.indexOf(row.icon) > -1,
                icon: row.icon,
                action: row.action,
            });
        });
    }

    return dataList;
}

/**
 * 내부용 이벤트 함수
 */
// 관련 메뉴 열기
function activeMenuEvent(count: number, e?: MouseEvent) {
    let $target: HTMLElement;

    focusIdx.value = count;

    cursorData.value = getCursor();

    if (e) {
        $target = e.currentTarget as HTMLElement;

        if (e.type === "mouseup") {
            const wrap = $target.parentElement as HTMLElement;
            const child = wrap.querySelectorAll(".d-row-block");
            let idx: number = -1;

            [...child].filter((item, count) => {
                if (item === $target) {
                    idx = count;
                }
            });

            if (idx > -1) {
                activeIdx.value = idx;
            }
        }
    } else {
        $target = $child.value[activeIdx.value];
    }

    setMenuPosition($target);
    checkDecoActive();
    activeMenu.value = true;
    styleButtonList.value[4][0].active = false;
}

// 관련 메뉴 닫기
function deactiveMenuEvent(e?: MouseEvent | KeyboardEvent) {
    activeMenu.value = false;
    activeBlockAddMenu.value = false;
    activeBlockColtrolMenu.value = false;
    styleButtonList.value[4][0].active = false;

    if (e && e.type === "mouseleave") {
        activeLinkBox.value = false;
    }
}

function dataUpdateAction() {
    $child.value.forEach((row: any) => {
        row.updateBlockData();
    });

    emit("update:modelValue", content.value);
}

// 블럭 추가 로직
function addBlockLocal({ name, value, time = false }: { name: string; value?: object; time?: boolean }) {
    const block = createBlock(name, value);

    content.value.splice(activeIdx.value + 1, 0, block);

    if (time === false) {
        activeIdx.value += 1;

        setTimeout(() => {
            activeBlockAddMenu.value = false;
            $child.value[activeIdx.value].focus();
            dataUpdateAction();
            activeMenuEvent(activeIdx.value);
        }, 100);
    }
}

// 블럭 삭제 이벤트
function deleteBlockLocal(index?: number) {
    if (content.value.length > 1) {
        if (index === undefined) {
            index = activeIdx.value as number;
        }

        if (index - 1 !== -1) {
            const $targetData = content.value[index - 1];
            const $thisData = content.value[index];

            if ($targetData.type === "text") {
                activeIdx.value -= 1;
                content.value[index - 1].content += `<span class="${$thisData.classList.join(" ")}">${$thisData.content}</span>`;
                content.value.splice(index, 1);

                setTimeout(() => {
                    dataUpdateAction();
                    $child.value[activeIdx.value].focus("last");
                }, 150);
            }
        }
    }
}

// 붙여넣기 이벤트
function pasteEvent(e: ClipboardEvent) {
    e.preventDefault();
    const data = getClipboardData(e.clipboardData as DataTransfer);

    if (data.type === "text") {
        const targetComponent = $child.value[activeIdx.value];
        const componentType = targetComponent.getType();

        if (componentType === "other") {
            // TODO : add block
        } else {
            targetComponent.pasteEvent(data.value);
        }
    }
}

// 블럭 종류 정의
function setComponentKind(kind: string) {
    let componentData: any;

    switch (kind) {
        case "ul":
            componentData = ulBlock;
            break;
        case "ol":
            componentData = olBlock;
            break;
        case "image":
            componentData = ImageBlock;
            break;
        case "text":
            componentData = TextBlock;
    }

    return componentData;
}

function setMenuPosition($target: HTMLElement) {
    const parentNode = $wrap.value.parentNode;
    const bodyRect = document.body.getBoundingClientRect();
    const wrapRect = $wrap.value.getBoundingClientRect();
    const targetRect = $target.getBoundingClientRect();
    const parentNodeScrollY = parentNode.scrollTop;
    const wrapTop = wrapRect.top - bodyRect.top;
    const targetTop = targetRect.top - bodyRect.top;
    const targetBottom = targetRect.bottom - bodyRect.top;
    const top = targetTop - (wrapTop + 10) - parentNodeScrollY + 13;
    const bottom = targetBottom - (wrapTop + 10) - parentNodeScrollY + 10;
    let startNode = cursorData.value.startNode;

    if (startNode !== null) {
        if (startNode.constructor.name === "Text") {
            startNode = startNode.parentNode;
        }

        const startNodeRect = startNode.getBoundingClientRect();
        const wrapleft = startNodeRect.left - bodyRect.left;

        linkBoxPosition.value = {
            top: top - 32,
            left: wrapleft,
        };
    }

    styleMenuPosition.value = bottom;
    leftMenuPosition.value = top;
}

// 블럭 스타일 이벤트
function setBlockDecoEvent(type: string, url?: string) {
    $child.value[activeIdx.value].setStyles({
        type: type,
        url: url,
    });
    setTimeout(() => {
        checkDecoActive();
    }, 100);
}

// 링크 스타일컨트롤
function decoLinkControl() {
    setBlockDecoEvent("decorationLink", linkValue.value);
    activeLinkBox.value = false;
}

// 블럭 위치 조정
async function moveBlock(type: string) {
    let targetIdx = 0;
    dataUpdateAction();

    if (type === "up") {
        targetIdx = activeIdx.value - 1;
    } else {
        targetIdx = activeIdx.value + 1;
    }

    if (targetIdx >= 0 && targetIdx < content.value.length) {
        const targetData = content.value[targetIdx];
        const thisData = content.value[activeIdx.value];

        content.value.splice(targetIdx, 1, thisData);
        content.value.splice(activeIdx.value, 1, targetData);
        activeIdx.value = targetIdx;
        deactiveMenuEvent();
    }
}

// 블럭 추가 메뉴 열기
function toggleBlockAddMenu() {
    activeIdx.value = focusIdx.value;
    activeBlockAddMenu.value = !activeBlockAddMenu.value;
}

// 블럭 컨트롤 메뉴 열기
function toggleBlockControlMenu() {
    activeIdx.value = focusIdx.value;
    activeBlockColtrolMenu.value = !activeBlockColtrolMenu.value;
}

/**
 * 외부용 함수
 */
// function checkStyleActive(className: string) {
//     return hasClassNameCheckLogic(className);
// }

function addImageBlock({ src, width, height, webp, caption }: { src: string; width: number; height: number; webp: boolean; caption?: string }) {
    addBlockLocal({
        name: "image",
        value: {
            src: src,
            width: width,
            height: height,
            webp: webp,
            caption: caption,
        },
    });
}

// 함수 내보내기
defineExpose({
    addImageBlock,
    dataUpdateAction,
});

/**
 * 초기 데이터 확인용 로직
 */
onMounted(() => {
    dataUpdateAction();
});
</script>

<style>
@import "../../core/style/common.css";
</style>
