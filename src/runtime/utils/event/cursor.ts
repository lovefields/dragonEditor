import { useEditorStore } from "../../store/editor";

export function _updateCursorData(): void {
    const editorStore = useEditorStore();

    if (window !== undefined) {
        editorStore.cursorSelection = window.getSelection() as Selection;
    } else {
        console.error("[Dragon Editor]: It's not client environment");
    }
}

// 커서 위치 지정
export function _setCursorPosition(node: Node, offset: number): void {
    const editorStore = useEditorStore();

    if (editorStore.cursorSelection !== null) {
        editorStore.cursorSelection.removeAllRanges();

        const range = document.createRange();

        range.setStart(node, offset);
        range.setEnd(node, offset);
        editorStore.cursorSelection.addRange(range);
    }
}

