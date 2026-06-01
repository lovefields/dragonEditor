<template>
    <div
        v-memo="memoData"
        class="de-block de-code-block"
        @click="setEdit"
    >
        <p
            class="de-filename"
            :contenteditable="props.isEdit === true"
            @input="updateFilename"
        >
            {{ props.data.filename }}
        </p>

        <p class="de-language">{{ DECodeLanguage[props.data.language] }}</p>

        <pre class="de-pre"><code v-html="props.data.textContent" class="de-code-content" :contenteditable="props.isEdit === true" @input="updateContent"></code></pre>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { computed } from "vue";
import { DECodeLanguage } from "../../enums/codeLanguage";
import type { DECodeBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DECodeBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DECodeBlock): void;
}>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockIndex === props.index;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function updateFilename(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

    newData.filename = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}

function updateContent(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
