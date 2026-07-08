import { useEditorStore } from "../../store/editor";

export function _updateCursorData(): void {
    const editorStore = useEditorStore();

    if (window !== undefined) {
        editorStore.cursorSelection = null;
        editorStore.cursorSelection = window.getSelection() as Selection;

        if (editorStore.cursorSelection.rangeCount > 0) {
            const range = editorStore.cursorSelection.getRangeAt(0);

            editorStore.cursorRange = range.cloneRange();

            if (range.startContainer === range.endContainer) {
                if (range.startContainer.nodeType === Node.TEXT_NODE) {
                    const $parentElement = range.startContainer.parentElement;

                    if ($parentElement !== null && $parentElement.tagName === "A") {
                        editorStore.status.anchorHerf = ($parentElement as HTMLAnchorElement).href;
                    } else {
                        editorStore.status.anchorHerf = "";
                    }
                }
            } else {
                editorStore.status.anchorHerf = "";
            }
        }
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

        if (startNode.nodeType !== Node.TEXT_NODE) {
            if (startNode.childNodes.length !== 0) {
                startNode = startNode.childNodes[0] as Node;
            } else {
                startNodeOffset = 0;
            }
        }

        if (endNode.nodeType !== Node.TEXT_NODE) {
            if (endNode.childNodes.length !== 0) {
                endNode = endNode.childNodes[0] as Node;
            } else {
                endNodeOffset = 0;
            }
        }

        newRange.setStart(startNode, startNodeOffset);
        newRange.setEnd(endNode, endNodeOffset);
        editorStore.cursorSelection.addRange(newRange);
    }
}
