<template>
    <div class="dragon-editor" @paste="pasteEvent" ref="$wrap" @mouseleave="deactiveMenuEvent"
         @keydown="deactiveMenuEvent"
    >
        <div class="d-left-menu" :class="{'--active' : activeMenu}" :style="{top:`${leftMenuPosition}px`}">
            <div class="d-add-block">
                <button class="d-btn-menu-pop"></button>

                <div class="d-block-list">
                    <button v-for="(row,count) in blockMenu" :key="count" class="d-btn-block" @click="row.action">
                        <SvgIcon v-if="row.hasIcon" :kind="row.icon"/>
                        <div v-else v-html="row.icon"></div>
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

        <div class="d-style-menu" :class="{'--active' : activeMenu}" :style="{top:`${styleMenuPosition}px`}">
            <div class="d-column">1</div>
            <div class="d-column">
                <button class="d-btn" :class="{'--active' : checkAlignActive('d-align-left')}"
                        @click="setBlockEvent('alignLeft')"
                >
                    <SvgIcon kind="alignLeft"/>
                </button>
                <button class="d-btn" :class="{'--active' : checkAlignActive('d-align-center')}"
                        @click="setBlockEvent('alignCenter')"
                >
                    <SvgIcon kind="alignCenter"/>
                </button>
                <button class="d-btn" :class="{'--active' : checkAlignActive('d-align-right')}"
                        @click="setBlockEvent('alignRight')"
                >
                    <SvgIcon kind="alignRight"/>
                </button>
            </div>

            <div class="d-column">
                <button class="d-btn" @click="setBlockEvent('decorationBold')">
                    <SvgIcon kind="decorationBold"/>
                </button>

                <button class="d-btn" @click="setBlockEvent('decorationItalic')">
                    <SvgIcon kind="decorationItalic"/>
                </button>

                <button class="d-btn" @click="setBlockEvent('decorationUnderline')">
                    <SvgIcon kind="decorationUnderline"/>
                </button>

                <button class="d-btn" @click="setBlockEvent('decorationStrikethrough')">
                    <SvgIcon kind="decorationStrikethrough"/>
                </button>
            </div>

            <div class="d-column">1</div>
            <div class="d-column">1</div>
        </div>

        <div
            class="d-row-block"
            v-for="(row,count) in content"
            :key="count"
            @click="activeIdx = count"
            @mouseenter="activeMenuEvent"
            @mousemove="activeMenuEvent"
        >
            <component
                ref="$child"
                v-model="content[count]"
                :is="setComponentKind(row.type)"
                @addBlock="addBlockLocal"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, unref, onMounted} from "#imports";
import {createBlock, getClipboardData} from "../../core/utils";
import {editorOptions, editorMenu, editorContentType, userBlockMenu} from "../../types/index";

// components
import SvgIcon from "../../core/components/SvgIcon.vue";
import textBlock from "../../core/components/editor/TextBlock.vue";

// props
const props = withDefaults(defineProps<{ modelValue: editorContentType, option?: editorOptions }>(), {
    modelValue: () => [],
    option: () => {
        return {
            blockMenu: ["text", "ol", "ul", "table", "quotation"]
        }
    },
});
const emit = defineEmits<{
    (e: "update:modelValue", modelValue: editorContentType): void;
}>();

// Editor data
const $wrap = ref();
const $child = ref();
const activeMenu = ref<boolean>(false);
const leftMenuPosition = ref<number>(0);
const styleMenuPosition = ref<number>(0);
const iconList = ["textBlock", "imageBlock", "ulBlock", "olBlock", "quotationBlock", "tableBlock"];
const blockMenu = ref<editorMenu[]>([]);
const content = ref<editorContentType>([]);
const activeIdx = ref<number>(0);
// const activeItemId = ref<string>("");
// const selectItems = ref<string[]>([]);

// initial logic
onMounted(() => {
    dataUpdateAction();
});

// block menu setting
blockMenu.value = setEditorMenu(props.option.blockMenu as string[], unref(props.option.customBlockMenu) as userBlockMenu[]);

// content data setting
if (props.modelValue && Array.isArray(props.modelValue)) {
    if (props.modelValue.length == 0) {
        addBlockLocal("text", true);
    } else {
        content.value = unref(props.modelValue) as editorContentType;
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

function setEditorMenu(vanillaData: string[], customData?: userBlockMenu[]) {
    const dataList: editorMenu[] = [];

    vanillaData.forEach((name) => {
        dataList.push({
            name: name,
            hasIcon: true,
            icon: `${name}Block`,
            action: () => {
                addBlockLocal(name);
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


// event function
function activeMenuEvent(e: MouseEvent) {
    setMenuPosition(e.currentTarget as HTMLElement);
    activeMenu.value = true;
}

function deactiveMenuEvent() {
    activeMenu.value = false;
}

function dataUpdateAction() {
    $child.value.forEach((row: any) => {
        row.updateBlockData();
    });

    emit("update:modelValue", content.value);
}

function addBlockLocal(name: string, time: boolean = false) {
    const block = createBlock(name);

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
    switch (kind) {
        case "text":
            return textBlock;
            break;
    }
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
    const bottom = ((targetBottom - (wrapTop + 10)) - parentNodeScrollY) + 15;

    styleMenuPosition.value = bottom;
    leftMenuPosition.value = top;
}

function setBlockEvent(type: string) {
    $child.value[activeIdx.value].setStyles(type);
}


// export function
function addImageBlock() {
    console.log("local image added event!");
    console.log($child);
    // contentData.value = value;
}

defineExpose({
    addImageBlock,
});
</script>

<style>
@import "../../core/style/common.css";
</style>
