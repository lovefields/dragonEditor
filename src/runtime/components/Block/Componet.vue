<template>
    <component :is="renderComponent" />
</template>

<script setup lang="ts">
import { h, resolveComponent } from "#imports";
import { useEditorStore } from "../../store/editor";
import type { VNode } from "#imports";
import type { DEComponentBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEComponentBlock; isEdit: boolean; index: number }>();

function setEdit() {
    editorStore.selectedBlockId = props.data.id;
    editorStore.selectedBlockIndex = props.index;
}

function renderComponent(): VNode {
    const component = h(resolveComponent(props.data.name), props.data.props);

    return h("div", { class: ["de-block", "de-component-block"], onClick: setEdit }, component);
}
</script>
