<template>
    <div class="de-menu-bar">
        <div class="de-menu-wrap">
            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    @click="isActiveMenuArea = !isActiveMenuArea"
                    ref="$addMenuButton"
                >
                    <component :is="_getIconNode('plus')" />
                </button>
            </div>

            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                    @click="_setDecoration('de-bold')"
                >
                    <component :is="_getIconNode('bold')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                    @click="_setDecoration('de-italic')"
                >
                    <component :is="_getIconNode('italic')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                    @click="_setDecoration('de-underline')"
                >
                    <component :is="_getIconNode('underline')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                    @click="_setDecoration('de-strikethrough')"
                >
                    <component :is="_getIconNode('strikethrough')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                    @click="_setDecoration('de-code')"
                >
                    <component :is="_getIconNode('codeblock')" />
                </button>
            </div>

            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false || editorStore.cursorSelection?.isCollapsed === true"
                    @click="isActiveLinkArea = !isActiveLinkArea"
                    ref="$exitLinkMenuButton"
                >
                    <component :is="_getIconNode('add-link')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseDecoration() === false"
                >
                    <component :is="_getIconNode('remove-link')" />
                </button>
            </div>

            <div class="de-col">
                <label
                    class="de-menu"
                    type="button"
                >
                    <component :is="_getIconNode('image')" />
                    <input
                        type="file"
                        hidden
                        :accept="editorStore.option.acceptImageFormat"
                        multiple
                        @change="imageUploadEvent"
                    />
                </label>
            </div>

            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseAlign() === false"
                    @click="_setAlign('left')"
                >
                    <component :is="_getIconNode('align-left')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseAlign() === false"
                    @click="_setAlign('center')"
                >
                    <component :is="_getIconNode('align-center')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseAlign() === false"
                    @click="_setAlign('right')"
                >
                    <component :is="_getIconNode('align-right')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseAlign() === false"
                    @click="_setAlign('justify')"
                >
                    <component :is="_getIconNode('align-justify')" />
                </button>
            </div>

            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseIndent() === false"
                    @click="_setIndentData('decrease')"
                >
                    <component :is="_getIconNode('indent-decrease')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="_checkCanUseIndent() === false"
                    @click="_setIndentData('increase')"
                >
                    <component :is="_getIconNode('indent-increase')" />
                </button>
            </div>

            <div class="de-col">
                <button
                    class="de-menu"
                    type="button"
                    :disabled="editorStore.selectedBlockIndex < 1"
                    @click="_moveBlockIndex('first')"
                >
                    <component :is="_getIconNode('move-first')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="editorStore.selectedBlockIndex < 1"
                    @click="_moveBlockIndex('up')"
                >
                    <component :is="_getIconNode('move-up')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="editorStore.selectedBlockIndex === editorStore.data.length - 1 || editorStore.selectedBlockIndex === -1"
                    @click="_moveBlockIndex('down')"
                >
                    <component :is="_getIconNode('move-down')" />
                </button>

                <button
                    class="de-menu"
                    type="button"
                    :disabled="editorStore.selectedBlockIndex === editorStore.data.length - 1 || editorStore.selectedBlockIndex === -1"
                    @click="_moveBlockIndex('last')"
                >
                    <component :is="_getIconNode('move-last')" />
                </button>
            </div>
        </div>

        <div
            class="de-block-menu-area"
            :class="{ '--active': isActiveMenuArea === true }"
            ref="$addBlockMenu"
        >
            <div class="de-list">
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('text')"
                >
                    Text
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('heading1')"
                >
                    Heading-1
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('heading2')"
                >
                    Heading-2
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('heading3')"
                >
                    Heading-3
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('unordered-list')"
                >
                    Unodered List
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('ordered-list')"
                >
                    Odered List
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('code')"
                >
                    Code Block
                </button>
                <button
                    class="de-add-block"
                    type="button"
                    @click="addBlockEvent('divider')"
                >
                    Divider
                </button>
            </div>
        </div>

        <div
            class="de-link-exit-area"
            :class="{ '--active': isActiveLinkArea === true }"
            ref="$exitLinkMenu"
        >
            <div class="de-btn-area">
                <button
                    class="de-btn"
                    :class="{ '--active': anchorInputType === 'url' }"
                    type="button"
                    @click="anchorInputType = 'url'"
                >
                    Text
                </button>
                <button
                    class="de-btn"
                    :class="{ '--active': anchorInputType === 'hash' }"
                    type="button"
                    @click="anchorInputType = 'hash'"
                >
                    Heading
                </button>
            </div>

            <div
                v-if="anchorInputType === 'url'"
                class="de-link-text-area"
            >
                <input
                    v-model="editorStore.status.anchorHerf"
                    class="de-input"
                    :class="{ '--error': urlValidation === false }"
                    name="url"
                    type="url"
                />
                <button
                    class="de-btn"
                    type="button"
                    @click="setLinkEvent()"
                >
                    Set
                </button>
            </div>

            <div
                v-else
                class="de-link-heading-area"
            >
                <button
                    v-for="item in editorStore.data.filter((i) => i.type === 'heading')"
                    v-html="item.textContent"
                    class="de-btn"
                    :class="{ '--active': `#${item.id}` === editorStore.status.anchorHerf }"
                    :key="item.id"
                    @click="setLinkEvent(`#${item.id}`)"
                >
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useEditorStore } from "../store/editor";
import { _addBlock, _moveBlockIndex, _checkCanUseIndent, _setIndentData, _checkCanUseAlign, _checkCanUseDecoration } from "../utils/data";
import { _getIconNode } from "../utils/layout";
import { _setAlign, _setDecoration, _setLink } from "../utils/node";
import type { DEBlockMenutype } from "../type.mjs";

const editorStore = useEditorStore();
const isActiveMenuArea = ref<boolean>(false);
const isActiveLinkArea = ref<boolean>(false);
const anchorInputType = ref<"url" | "hash">("url");
const urlValidation = ref<boolean>(true);
const $addBlockMenu = ref<HTMLDivElement>();
const $addMenuButton = ref<HTMLButtonElement>();
const $exitLinkMenu = ref<HTMLDivElement>();
const $exitLinkMenuButton = ref<HTMLButtonElement>();

// 블럭 추가 메뉴
function addBlockEvent(name: DEBlockMenutype): void {
    _addBlock(name);
    isActiveMenuArea.value = false;
}

// 이미지 업로드 이벤트
function imageUploadEvent(event: Event): void {
    const $target = event.currentTarget as HTMLInputElement;

    if ($target !== null) {
        const files = $target.files;

        if (files !== null && files.length > 0 && editorStore.fn.uploadImage !== null) {
            editorStore.fn.uploadImage(Array.from(files));
            $target.value = "";
        }
    }
}

// 링크 할당 이벤트
function setLinkEvent(url?: string): void {
    const urlReg = /^(https?:\/\/|#).+/;

    if (url === undefined) {
        url = editorStore.status.anchorHerf;
    }

    if (urlReg.test(url) === true) {
        isActiveLinkArea.value = false;
        urlValidation.value = true;
        _setLink(url);
    } else {
        urlValidation.value = false;
    }
}

// 블럭 추가 메뉴 닫기
onClickOutside(
    $addBlockMenu,
    () => {
        isActiveMenuArea.value = false;
    },
    {
        ignore: [$addMenuButton],
    }
);

// 링크 메뉴 닫기
onClickOutside(
    $exitLinkMenu,
    () => {
        isActiveLinkArea.value = false;
        urlValidation.value = true;
    },
    {
        ignore: [$exitLinkMenuButton],
    }
);
</script>
