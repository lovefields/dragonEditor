<template>
    <div class="dragon-editor" @paste="pasteEvent">
        <div class="d-left-menu">
            <div class="d-add-block">
                <button class="d-btn-menu-control"></button>

                <div class="d-block-list">
                    <button v-for="(row,count) in blockMenu" :key="count" class="d-btn-block" @click="row.action">
                        <SvgIcon v-if="row.hasIcon" :kind="row.icon"/>
                        <div v-else v-html="row.icon"></div>
                        <p class="d-name">{{ row.name }}</p>
                    </button>
                </div>
            </div>
        </div>

        <div
            class="d-row-block"
            v-for="(row,count) in content"
            :key="count"
            @click="activeIdx = count"
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
import {ref, unref} from "#imports";
import {createBlock, getClipboardData} from "../../core/utils";
import {editorOptions, editorMenu, editorContentType, userBlockMenu} from "../../types/index";

// components
import SvgIcon from "../../core/components/SvgIcon.vue";
import textBlock from "../../core/components/TextBlock.vue";

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
const $child = ref();
const iconList = ["textBlock", "imageBlock", "ulBlock", "olBlock", "quotationBlock", "tableBlock"];
const blockMenu = ref<editorMenu[]>([]);
const content = ref<editorContentType>([]);
const activeIdx = ref<number>(0);
const activeItemId = ref<string>("");
const selectItems = ref<string[]>([]);

// initial logic

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
function dataUpdateAction() {
    $child.value.forEach((row: any) => {
        row.updateBlockData();
    });

    emit("update:modelValue", content.value);
}

function addBlockLocal(name: string, time: boolean = false) {
    const block = createBlock(name);

    // console.log(activeIdx.value);
    // if (index) {
    content.value.splice(activeIdx.value + 1, 0, block);
    // } else {
    // content.value.push(block);
    // }

    if (time === false) {
        activeIdx.value += 1;

        if (name !== "image") {
            console.log(activeIdx.value);
            console.log("child", $child.value);
            setTimeout(() => { // waiting data set
                console.log("next-child", $child.value[activeIdx.value]);
                $child.value[activeIdx.value].focus();
            }, 100);
        }

        dataUpdateAction();
    }
}

function pasteEvent(e: ClipboardEvent) {
    e.preventDefault();
    const data = getClipboardData(e.clipboardData as DataTransfer);

    console.log(`${activeIdx.value}번째 : `, $child.value[activeIdx.value]);
    console.log(data);
}

function setComponentKind(kind: string) {
    switch (kind) {
        case "text":
            return textBlock;
            break;
    }
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
