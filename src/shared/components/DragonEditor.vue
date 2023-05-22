<template>
    <div class="dragon-editor">
        <p></p>
    </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {test} from "../../core/utils";
import {editorOptions} from "../../types/index";


const componentStatus = defineProps<editorOptions>();
const editStatus = ref<object>({
    activeBlock: null,
    cursor: {}
});


console.log(test);

// console.log(useKeyboard());

interface cursorSelection {
    type: string,
    startNode: HTMLElement | TextNode | null,
    startOffset: number | null,
    endNode: HTMLElement | TextNode | null,
    endOffset: number | null,
}

const canEditing = ref<boolean>(false);

// 렌더링에 영향을 안주는 값
let $target: HTMLElement;
let selectionData: cursorSelection = {
    type: "",
    startNode: null,
    startOffset: null,
    endNode: null,
    endOffset: null,
};

// 임시 활성화
canEditing.value = true;

const setSelection = () => { // 셀렉션 가져오기
    if (process.client) {
        let selection = window.getSelection();

        selectionData.type = selection.type;
        selectionData.startNode = selection.anchorNode;
        selectionData.startOffset = selection.anchorOffset;
        selectionData.endNode = selection.focusNode;
        selectionData.endOffset = selection.focusOffset;
    }
};

const enterEvent = (e: KeyboardEvent) => { // 엔터 이벤트 컨트롤
    if (process.client) {
        console.log($target);
        console.log(selectionData);
        if (e.code === "Enter") {
            e.preventDefault();
        }
    }
}

</script>

<style scoped>
@import "../../core/style/common.css";
</style>
