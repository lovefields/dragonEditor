<template>
    <div
        v-memo="memoData"
        class="de-block de-file-block"
    >
        <a
            class="de-file-wrap"
            :href="editorStore.option.mediaHostURL + props.data.src"
            :download="props.data.name"
            target="_black"
            @click="blockWhenEdit"
        >
            <div class="de-icon-area">
                <p class="de-extension">{{ getExtensionText(props.data.name) }}</p>
            </div>

            <div class="de-text-area">
                <p class="de-name">{{ props.data.name }}</p>
                <p class="de-size">{{ getSizeText(props.data.size) }}</p>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEditorStore } from "../../store/editor";
import type { DEFileBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEFileBlock; isEdit: boolean; index: number }>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

// 사이즈 표기법
function getSizeText(size: number): string {
    let text: string = "";

    if (size === 0) {
        text = "0 Bytes";
    } else {
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(size) / Math.log(k));

        text = parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    return text;
}

// 확장자 표기
function getExtensionText(name: string): string {
    return name.split(".").pop()?.toUpperCase() || "file";
}

// 작성시 클릭 막기
function blockWhenEdit(event: MouseEvent): void {
    if (props.isEdit === true) {
        event.preventDefault();
        editorStore.selectedBlockId = props.data.id;
        editorStore.selectedBlockIndex = props.index;
    }
}
</script>
