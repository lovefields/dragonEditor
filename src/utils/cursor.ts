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
