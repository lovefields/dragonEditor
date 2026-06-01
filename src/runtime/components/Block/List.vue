<template>
    <component :is="renderList()" />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, h, withMemo } from "vue";
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

function renderList(): VNode {
    if (memoCache.length > props.data.child.length) {
        memoCache.length = props.data.child.length;
    }

    const liNodes = props.data.child.map((child, liIndex) => {
        const isFrozen = props.isEdit === true && childIndex.value === liIndex;
        const memoKey = isFrozen ? "frozen" : JSON.stringify(child);

        return withMemo(
            [memoKey],
            () =>
                h("li", {
                    key: child.id,
                    class: ["de-item", ...child.classList],
                    contenteditable: props.isEdit === true,
                    innerHTML: child.textContent,
                    onFocus: () => setEdit(liIndex),
                    onBlur: abortEdit,
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
            "data-depth": props.data.depth,
            "data-style": props.data.style,
            onClick: (event: MouseEvent) => setEdit(event as any),
        },
        liNodes
    );
}
</script>
