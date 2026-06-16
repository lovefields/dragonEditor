<template>
    <div
        class="de-block de-code-block"
        @click="setEdit"
    >
        <p
            v-memo="memoData"
            class="de-filename"
            :contenteditable="props.isEdit === true"
            @input="updateFilename"
        >
            {{ props.data.filename }}
        </p>

        <p class="de-language">{{ DECodeLanguage[props.data.language] }}</p>

        <div class="de-pre-wrap">
            <div class="de-number">
                <p
                    v-for="i in lineNumber"
                    class="de-number-item"
                >
                    {{ i }}
                </p>
            </div>

            <pre class="de-pre"><code v-memo="memoData" v-html="props.data.textContent" class="de-code-content" :contenteditable="props.isEdit === true" @input="updateContent"></code></pre>
        </div>
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
const lineNumber = computed<number>(() => {
    const match = props.data.textContent.match(/\n/g);
    const matchEmptyLast = props.data.textContent.match(/\n\n$/g);
    let number = match === null ? 1 : match.length + 1;

    if (matchEmptyLast !== null) {
        number -= 1;
    }

    return number;
});
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockId = props.data.id;
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
