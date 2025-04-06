import type { Ref } from "vue";

// 커서정보 업데이트
export function _updateCursorData(store: Ref<DragonEditorStore>) {
    const selection = window.getSelection() as Selection;

    if (selection.type !== "None") {
        store.value.cursorData = {
            type: selection.type as "Range" | "Caret",
            startNode: selection.anchorNode as Node,
            startOffset: selection.anchorOffset,
            endNode: selection.focusNode as Node,
            endOffset: selection.focusOffset,
        };
    }
}

// 커서 위치 지정
export function _setCursor($target: Node, startIdx: number) {
    const range = document.createRange();
    const selection = window.getSelection() as Selection;

    if ($target.constructor.name === "Text") {
        range.setStart($target, startIdx);
    } else {
        if ($target.hasChildNodes() === true) {
            if ($target.textContent === "") {
                range.setStart($target.childNodes[startIdx], 0);
            } else {
                range.setStart($target.childNodes[0], startIdx);
            }
        } else {
            range.setStart($target, startIdx);
        }
    }

    selection.removeAllRanges();
    selection.addRange(range);
}
