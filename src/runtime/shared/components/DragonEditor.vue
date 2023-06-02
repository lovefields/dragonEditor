<template>
    <div class="dragon-editor" @paste="pasteEvent" ref="$wrap" @mouseleave="deactiveMenuEvent" @keydown="deactiveMenuEvent">
        <div class="d-left-menu" :class="{ '--active': activeMenu }" :style="{ top: `${leftMenuPosition}px` }">
            <div class="d-add-block">
                <button class="d-btn-menu-pop" @click="openBlockAddMenu"></button>

                <div class="d-block-list" :class="{ '--active': activeBlockAddMenu }">
                    <button v-for="(row, count) in blockMenu" :key="count" class="d-btn-block" @click="row.action">
                        <SvgIcon v-if="row.hasIcon" :kind="row.icon" />
                        <div v-else class="d-icon" v-html="row.icon"></div>
                        <p class="d-name">{{ row.name }}</p>
                    </button>
                </div>
            </div>

            <div class="d-control-block">
                <button class="d-btn-block-pop"></button>

                <div class="d-block-list">
                    <button class="d-btn-block"></button>
                    <button class="d-btn-block"></button>
                    <button class="d-btn-block"></button>
                </div>
            </div>
        </div>

        <div class="d-link-box" :class="{ '--active': activeLinkBox }"
            :style="{ top: `${linkBoxPosition.top}px`, left: `${linkBoxPosition.left}px` }">
            <template v-if="styleButtonList[2][0].active">
                <p class="d-input">{{ linkValue }}</p>
                <button class="d-btn-link" @click="decoLinkControl">
                    <SvgIcon kind="cancel" />
                </button>
            </template>
            <template v-else>
                <input type="url" class="d-input" v-model="linkValue">
                <button class="d-btn-link" @click="decoLinkControl">
                    <SvgIcon kind="accept" />
                </button>
            </template>
        </div>

        <div class="d-style-menu" :class="{ '--active': activeMenu }" :style="{ top: `${styleMenuPosition}px` }">
            <div v-for="(column, count) in styleButtonList" :key="count" class="d-column">
                <template v-for="(item, j) in column">
                    <button v-if="item.target.indexOf(content[activeIdx].type) > -1" class="d-btn"
                        :class="{ '--active': item.active }" @click="item.action">
                        <SvgIcon :kind="item.icon" />
                    </button>
                </template>
            </div>

            <div v-if="customStyleMenu.length > 0" class="d-column">
                <!--                customStyleMenu-->
            </div>
        </div>

        <div class="d-row-block" v-for="(row, count) in content" :key="count" @click="activeIdx = count"
            @mouseenter="activeMenuEvent" @mousemove="activeMenuEvent" @mouseup="activeMenuEvent">
            <component ref="$child" v-model="content[count]" :is="setComponentKind(row.type)" :cursorData="cursorData"
                @addBlock="addBlockLocal" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, unref, onMounted } from "#imports";
import { createBlock, getClipboardData, getCursor } from "../../core/utils";
import {
    editorOptions,
    editorMenu,
    editorContentType,
    userCustomMenu,
    styleActiveType,
    userStyleMenu,
    cursorSelection
} from "../../../types/index";

// components
import SvgIcon from "../../core/components/SvgIcon.vue";
import textBlock from "../../core/components/editor/TextBlock.vue";
import imageBlock from "../../core/components/editor/ImageBlock.vue";

// 기본 정보
const props = defineProps<{ modelValue: editorContentType; option?: editorOptions }>();
const modelValue = ref<editorContentType>([]);
const option = ref<editorOptions>({
    blockMenu: ["text", "ol", "ul", "table", "quotation"]
});

if (props.modelValue) {
    modelValue.value = props.modelValue;
}

if (props.option) {
    option.value = Object.assign(option.value, props.option)
}

const emit = defineEmits<{
    (e: "update:modelValue", modelValue: editorContentType): void;
}>();

// 내부 데이터
const $wrap = ref();
const $child = ref();
const activeMenu = ref<boolean>(false);
const activeLinkBox = ref<boolean>(false);
const activeBlockAddMenu = ref<boolean>(false);
const leftMenuPosition = ref<number>(0);
const styleMenuPosition = ref<number>(0);
const linkBoxPosition = ref({
    top: 0,
    left: 0
});
const iconList = ["textBlock", "imageBlock", "ulBlock", "olBlock", "quotationBlock", "tableBlock"];
const blockMenu = ref<editorMenu[]>([]);
const customStyleMenu = ref<userStyleMenu[]>([]);
const content = ref<editorContentType>([]);
const activeIdx = ref<number>(0);
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
            name: "Align Left",
            icon: "alignLeft",
            active: false,
            target: ["text", "image", "table", "ul", "ol"],
            action: () => {
                setBlockDecoEvent("alignLeft")
            }
        },
        {
            name: "Align Center",
            icon: "alignCenter",
            target: ["text", "image", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("alignCenter")
            }
        },
        {
            name: "Align right",
            icon: "alignRight",
            target: ["text", "image", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("alignRight")
            }
        },
    ],
    [
        {
            name: "Decoration Bold",
            icon: "decorationBold",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationBold")
            }
        },
        {
            name: "Decoration Italic",
            icon: "decorationItalic",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationItalic")
            }
        },
        {
            name: "Decoration Underline",
            icon: "decorationUnderline",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationUnderline")
            }
        },
        {
            name: "Decoration Strikethrough",
            icon: "decorationStrikethrough",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationStrikethrough")
            }
        },
    ],
    [
        {
            name: "Link",
            icon: "link",
            active: false,
            target: ["text", "table", "ul", "ol"],
            action: () => {
                activeLinkBox.value = !activeLinkBox.value;
            }
        }
    ],
    [
        {
            name: "Decoration Code",
            icon: "codeBlock",
            target: ["text", "table", "ul", "ol"],
            active: false,
            action: () => {
                setBlockDecoEvent("decorationCode");
            }
        }
    ]
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

function checkDecoActive() {
    styleButtonList.value[0][0].active = checkAlignActive('d-align-left');
    styleButtonList.value[0][1].active = checkAlignActive('d-align-center');
    styleButtonList.value[0][2].active = checkAlignActive('d-align-right');
    styleButtonList.value[1][0].active = hasClassNameCheckLogic("d-deco-bold");
    styleButtonList.value[1][1].active = hasClassNameCheckLogic("d-deco-italic");
    styleButtonList.value[1][2].active = hasClassNameCheckLogic("d-deco-underline");
    styleButtonList.value[1][3].active = hasClassNameCheckLogic("d-deco-through");
    styleButtonList.value[2][0].active = hasClassNameCheckLogic("d-deco-link");
    styleButtonList.value[3][0].active = hasClassNameCheckLogic("d-deco-code");
}

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


function setEditorMenu(vanillaData: string[], customData?: userCustomMenu[]) {
    const dataList: editorMenu[] = [];

    vanillaData.forEach((name) => {
        dataList.push({
            name: name,
            hasIcon: true,
            icon: `${name}Block`,
            action: () => {
                addBlockLocal({ name: name });
            }
        });
    });

    if (customData) {
        customData.forEach((row) => {
            dataList.push({
                name: row.name,
                hasIcon: iconList.indexOf(row.icon) > -1,
                icon: row.icon,
                action: row.action
            });
        });
    }

    return dataList;
}

/**
 * 내부용 이벤트 함수
 */
function activeMenuEvent(e: MouseEvent) {
    cursorData.value = getCursor();
    setMenuPosition(e.currentTarget as HTMLElement);
    checkDecoActive();
    activeMenu.value = true;
}

function deactiveMenuEvent(e) {
    activeMenu.value = false;
    activeBlockAddMenu.value = false;

    if (e.type === "mouseleave") {
        activeLinkBox.value = false;
    }
}

function dataUpdateAction() {
    $child.value.forEach((row: any) => {
        row.updateBlockData();
    });

    emit("update:modelValue", content.value);
}

function addBlockLocal({ name, value, time = false }:
    {
        name: string;
        value?: object;
        time?: boolean
    }) {
    const block = createBlock(name, value);

    content.value.splice(activeIdx.value + 1, 0, block);

    if (time === false) {
        activeIdx.value += 1;

        setTimeout(() => { // waiting data set
            if (name !== "image") {
                $child.value[activeIdx.value].focus();
            }

            dataUpdateAction();
        }, 100);
    }
}

function pasteEvent(e: ClipboardEvent) {
    e.preventDefault();
    const data = getClipboardData(e.clipboardData as DataTransfer);

    if (data.type === "text") {
        const targetComponent = $child.value[activeIdx.value];
        const componentType = targetComponent.getType();

        if (componentType !== "image" && componentType !== "other") {
            targetComponent.pasteEvent(data.value);
        }
    }
}

function setComponentKind(kind: string) {
    let componentData: any;
    switch (kind) {
        case "image":
            componentData = imageBlock;
            break;
        case "text":
            componentData = textBlock;
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
    const top = ((targetTop - (wrapTop + 10)) - parentNodeScrollY) + 13;
    const bottom = ((targetBottom - (wrapTop + 10)) - parentNodeScrollY) + 10;
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
        }
    }

    styleMenuPosition.value = bottom;
    leftMenuPosition.value = top;
}

// 블럭 스타일 이벤트
function setBlockDecoEvent(type: string, url?: string) {
    $child.value[activeIdx.value].setStyles({
        type: type,
        url: url
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

// 블럭 추가 메뉴
function openBlockAddMenu() {
    activeBlockAddMenu.value = !activeBlockAddMenu.value;
}


/**
 * 외부용 함수
 */
// function checkStyleActive(className: string) {
//     return hasClassNameCheckLogic(className);
// }

function addImageBlock({ src, width, height, webp, caption }: {
    src: string;
    width: number;
    height: number;
    webp: boolean;
    caption?: string;
}) {
    addBlockLocal({
        name: "image",
        value: {
            src: src,
            width: width,
            height: height,
            webp: webp,
            caption: caption,
        }
    });
}

// 함수 내보내기
defineExpose({
    addImageBlock
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
