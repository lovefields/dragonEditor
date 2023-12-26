import type EditorInit from "./init";

export function setCursorData(store: EditorInit) {
    const selection = window.getSelection();

    store.cursorData = {
        type: selection.type as "Range" | "Caret",
        startNode: selection.anchorNode,
        startOffset: selection.anchorOffset,
        endNode: selection.focusNode,
        endOffset: selection.focusOffset,
    };
}

export function setCursor($target: Element, startIdx: number) {
    const range = document.createRange();
    const selection = window.getSelection();

    if ($target.hasChildNodes() === true) {
        range.setStart($target.childNodes[0], startIdx);
    } else {
        range.setStart($target, 0);
    }

    selection.removeAllRanges();
    selection.addRange(range);
}

export function setRangeCursor($startTarget: Element, $endTarget: Element, startIdx: number, endIdx: number) {}

export function clenupCursor(store: EditorInit) {
    setCursorData(store);

    if (store.cursorData.startNode !== store.cursorData.endNode || store.cursorData.startOffset !== store.cursorData.endOffset) {
        // setRangeCursor();
    } else {
        setCursor(store.cursorData.startNode as Element, store.cursorData.startOffset);
    }
}
