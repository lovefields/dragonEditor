<template>
    <component :is="renderList()" />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, h, withMemo, watch } from "vue";
import { _listBlockEnterEvent, _listChildTabEvent } from "../../utils/event";
import type { VNode } from "vue";
import type { DEListBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEListBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEListBlock): void;
}>();
const childIndex = ref<number>(-1);
const memoCache: any[] = [];

function setEdit(liIndex: number) {
    editorStore.selectedBlockIndex = props.index;
    childIndex.value = liIndex;
}

function abortEdit() {
    childIndex.value = -1;
}

function updateData(event: Event, liIndex: number): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEListBlock;

    if (newData.child[liIndex] !== undefined) {
        newData.child[liIndex].textContent = (event.target as HTMLHeadingElement).innerHTML;
    }

    emit("update", newData);
}

function keydownEvent(event: KeyboardEvent): void {
    switch (event.key) {
        case "Enter":
            // 엔터 이벤트
            if (event.shiftKey === false) {
                if (event.isComposing === false) {
                    _listBlockEnterEvent(event, props.data, props.index, childIndex.value, setEdit, abortEdit);
                } else {
                    event.preventDefault();
                }
            } else {
                // 쉬프트 엔터 이벤트
            }

            break;

        case "Tab":
            // _listChildTabEvent(event, props.data, props.index, childIndex.value, setEdit, abortEdit);
            break;

        case "ArrowUp":
            // _moveBlockDefaultEvent(event, "up");
            break;

        case "ArrowDown":
            // _moveBlockDefaultEvent(event, "down");
            break;

        case "Backspace":
            break;

        case "Delete":
            break;

        case "`":
            break;
    }
}

function renderList(): VNode {
    if (memoCache.length > props.data.child.length) {
        memoCache.length = props.data.child.length;
    }

    const liNodes = props.data.child.map((child, liIndex) => {
        const isFrozen = props.isEdit === true && childIndex.value === liIndex;
        const memoKey = isFrozen ? "frozen" : JSON.stringify(child);
        const classList = new Set(["de-item", ...child.classList]);

        return withMemo(
            [memoKey],
            () =>
                h("li", {
                    key: child.id,
                    class: [...classList],
                    contenteditable: props.isEdit === true,
                    "data-depth": child.depth,
                    innerHTML: child.textContent,
                    onFocus: () => setEdit(liIndex),
                    onBlur: abortEdit,
                    onKeydown: keydownEvent,
                    onInput: (event: Event) => updateData(event, liIndex),
                }),
            memoCache,
            liIndex
        );
    });

    return h(
        props.data.element,
        {
            class: "de-block de-list-block",
            "data-style": props.data.style,
        },
        liNodes
    );
}
</script>
