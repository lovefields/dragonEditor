<template>
    <div
        v-memo="memoData"
        class="de-block de-image-block"
        :class="props.data.classList"
        @click="setEdit"
        @mousemove="resizingEvent"
        @touchmove="resizingEvent"
    >
        <div
            class="de-image-area"
            :data-maxwidth="props.data.maxWidth"
        >
            <button
                v-if="props.isEdit === true"
                class="de-btn de-btn-left"
                @mousedown="startResizeEvent($event, 'left')"
                @touchstart="startResizeEvent($event, 'left')"
            ></button>
            <button
                v-if="props.isEdit === true"
                class="de-btn de-btn-right"
                @mousedown="startResizeEvent($event, 'right')"
                @touchstart="startResizeEvent($event, 'right')"
            ></button>
            <img
                class="de-img"
                :src="editorStore.option.mediaHostURL + props.data.src"
                :alt="props.data.caption"
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
            @paste="_normalPasteEvent($event, setEdit, abortEdit)"
        ></p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEditorStore } from "../../store/editor";
import { _imageEnterEvent, _blockTabEvent, _moveBlockDefaultEvent, _normalPasteEvent, _updateCursorData } from "../../utils/event";
import { _getEditingElementTextContent } from "../../utils/data";
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
let mouseXPosition: number = 0;
let mouseDuration: "left" | "right" = "left";
let startMaxWidth: number = 0;

function setEdit() {
    editorStore.selectedBlockIndex = props.index;
    editorStore.selectedBlockId = props.data.id;
    _updateCursorData();
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
    editorStore.selectedBlockId = "";
}

function keydownEvent(event: KeyboardEvent): void {
    if (event.isComposing === false) {
        switch (event.key) {
            case "Enter":
                // 엔터 이벤트
                if (event.shiftKey === false) {
                    _imageEnterEvent(event, props.data, props.index);
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
        }
    } else {
        event.preventDefault();
    }
}

function updateData(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEImageBlock;

    newData.caption = _getEditingElementTextContent(event.target as HTMLParagraphElement);

    emit("update", newData);
}

// 이미지 리사이즈 시작
function startResizeEvent(event: MouseEvent | TouchEvent, duration: "left" | "right"): void {
    if (editorStore.status.isImageResizeActive === false) {
        editorStore.status.isImageResizeActive = true;

        if ("touches" in event) {
            const touch = event.touches[0] || event.changedTouches[0];

            if (touch !== undefined) {
                mouseXPosition = touch.screenX;
            }
        } else {
            mouseXPosition = event.screenX;
        }

        mouseDuration = duration;
        startMaxWidth = props.data.maxWidth;
    }
}

// 이미지 리사이즈 동작
function resizingEvent(event: MouseEvent | TouchEvent): void {
    if (editorStore.status.isImageResizeActive === true && editorStore.element.body !== null) {
        const newData = JSON.parse(JSON.stringify(props.data)) as DEImageBlock;
        const bodyRect = editorStore.element.body.getBoundingClientRect();
        const bodyWidthHalf = bodyRect.width / 2 - 50;
        let currentX: number = 0;

        if ("touches" in event) {
            const touch = event.touches[0] || event.changedTouches[0];

            if (touch !== undefined) {
                currentX = touch.screenX;
            }
        } else {
            currentX = event.screenX;
        }

        const diffX = mouseXPosition - currentX;
        let movePercent = (100 / bodyWidthHalf) * diffX;

        if (mouseDuration === "right") {
            movePercent = -1 * movePercent;
        }

        let newMaxWidth = startMaxWidth + Math.floor(movePercent);

        if (newMaxWidth < 25) {
            newMaxWidth = 25;
        }

        if (newMaxWidth > 100) {
            newMaxWidth = 100;
        }

        newData.maxWidth = newMaxWidth;
        abortEdit();
        emit("update", newData);
    }
}
</script>
