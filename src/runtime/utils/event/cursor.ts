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
        if (node.nodeType !== Node.TEXT_NODE) {
            if (node.childNodes.length !== 0) {
                node = node.childNodes[0] as Node;
            } else {
                offset = 0;
            }
        }

        editorStore.cursorSelection.removeAllRanges();

        const range = document.createRange();

        range.setStart(node, offset);
        range.setEnd(node, offset);
        editorStore.cursorSelection.addRange(range);
    }
}

// 셀렉트 커서 위치 지정
export function _setRangeCursorPosition(startNode: Node, startNodeOffset: number, endNode: Node, endNodeOffset: number): void {
    const editorStore = useEditorStore();

    if (editorStore.cursorSelection !== null) {
        editorStore.cursorSelection.removeAllRanges();

        const newRange = document.createRange();

        newRange.setStart(startNode, startNodeOffset);
        newRange.setEnd(endNode, endNodeOffset);
        editorStore.cursorSelection.addRange(newRange);
    }
}
