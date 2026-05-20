<template>
    <div v-memo="[editorStore.selectedBlockIndex === props.index ? 'frozen' : JSON.stringify(props.data)]" class="de-block de-image-block" :class="[...props.data.classList]" @click="setEdit">
        <div class="de-image-area" :data-maxwidth="props.data.maxWidth">
            <button v-if="props.isEdit === true" class="de-btn de-btn-left"></button>
            <button v-if="props.isEdit === true" class="de-btn de-btn-right"></button>
            <img class="de-img" :src="editorStore.option.mediaHostURL + props.data.src" alt="" draggable="false" />
        </div>

        <p v-html="props.data.caption" class="de-caption" :contenteditable="props.isEdit === true" @focus="setEdit" @input="updateData"></p>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, computed } from "vue";
import type { DEImageBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEImageBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEImageBlock): void;
}>();

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEImageBlock;

    newData.caption = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
