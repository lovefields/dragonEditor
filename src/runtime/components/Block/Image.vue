<template>
    <div
        v-memo="memoData"
        class="de-block de-image-block"
        :class="[...props.data.classList]"
        @click="setEdit"
    >
        <div
            class="de-image-area"
            :data-maxwidth="props.data.maxWidth"
        >
            <button
                v-if="props.isEdit === true"
                class="de-btn de-btn-left"
            ></button>
            <button
                v-if="props.isEdit === true"
                class="de-btn de-btn-right"
            ></button>
            <img
                class="de-img"
                :src="editorStore.option.mediaHostURL + props.data.src"
                alt=""
                draggable="false"
            />
        </div>

        <p
            v-html="props.data.caption"
            class="de-caption"
            :contenteditable="props.isEdit === true"
            @focus="setEdit"
            @keydown="keydownEvent"
            @input="updateData"
        ></p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEditorStore } from "../../store/editor";
import { _imageEnterEvent, _blockTabEvent, _moveBlockDefaultEvent } from "../../utils/event";
import type { DEImageBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DEImageBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEImageBlock): void;
}>();
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
    editorStore.selectedBlockId = props.data.id;
}

function keydownEvent(event: KeyboardEvent): void {
    switch (event.key) {
        case "Enter":
            // 엔터 이벤트
            if (event.shiftKey === false) {
                if (event.isComposing === false) {
                    _imageEnterEvent(event, props.data, props.index);
                } else {
                    event.preventDefault();
                }
            } else {
                // 쉬프트 엔터 이벤트
                event.preventDefault();
            }

            break;

        case "ArrowUp":
            _moveBlockDefaultEvent(event, "up");
            break;

        case "ArrowDown":
            _moveBlockDefaultEvent(event, "down");
            break;

        case "Backspace":
            break;

        case "Delete":
            break;
    }
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEImageBlock;

    newData.caption = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}
</script>
