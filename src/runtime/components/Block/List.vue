<template>
    <component :is="tagName" class="de-block de-list-block" :data-depth="props.data.depth" :data-style="props.data.style" @click="setEdit">
        <li v-for="(child, liIndex) in props.data.child" v-memo="[childIndex === liIndex ? 'frozen' : JSON.stringify(child)]" v-html="child.textContent" class="de-item" :class="[...child.classList]" :contenteditable="props.isEdit === true" @focus="setEdit(liIndex)" @blur="abortEdit" @input="updateData($event, liIndex)"></li>
    </component>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, computed } from "vue";
import type { DEListBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEListBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEListBlock): void;
}>();
const tagName = computed(() => props.data.element);
const childIndex = ref<number>(-1);

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
</script>
