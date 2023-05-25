import type {cursorSelection} from "../../types";

export function setCursor(target: HTMLElement, idx: number) {
    const select = window.getSelection() as Selection;
    const range = document.createRange();

    range.setStart(target, idx);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);
}

export function getCursor(): cursorSelection {
    const select = window.getSelection() as Selection;

    return {
        type: select.type,
        startNode: select.anchorNode,
        startOffset: select.anchorOffset,
        endNode: select.focusNode,
        endOffset: select.focusOffset,
    };
}
