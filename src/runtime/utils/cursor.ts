import "../type.d.ts";

export function _setCursorData(store: any) {
    const selection = window.getSelection() as Selection;

    if (selection.type !== "None") {
        store.setCursorData({
            type: selection.type as "Range" | "Caret",
            startNode: selection.anchorNode as Node,
            startOffset: selection.anchorOffset,
            endNode: selection.focusNode as Node,
            endOffset: selection.focusOffset,
        });
    }
}

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

export function _clenupCursor(store: any) {
    _setCursorData(store);

    if (store.cursorData.startNode !== store.cursorData.endNode || store.cursorData.startOffset !== store.cursorData.endOffset) {
        // setRangeCursor();
    } else {
        if (store.cursorData.startNode.hasChildNodes() === true) {
            _setCursor(store.cursorData.startNode.childNodes[store.cursorData.startOffset] as Element, 0);
        } else {
            _setCursor(store.cursorData.startNode as Element, store.cursorData.startOffset);
        }
    }
}

// 엘리먼트 기준 커서 데이터 정렬
export function _soltingCursorDataOnElement(cursorData: DEditorCursor, $element: HTMLElement): DEArrangeCursorData {
    const childList = $element.childNodes;
    let startNode = cursorData.startNode;
    let startIdx = -1;
    let startOffset = cursorData.startOffset;
    let endNode = cursorData.endNode;
    let endIdx = -1;
    let endOffset = cursorData.endOffset;

    if (startNode.constructor.name === "Text") {
        if (startNode.parentElement !== $element) {
            startNode = startNode.parentElement as HTMLElement;
        }
    }
    if (endNode.constructor.name === "Text") {
        if (endNode.parentElement !== $element) {
            endNode = endNode.parentElement as HTMLElement;
        }
    }

    for (let i = 0; childList.length > i; i += 1) {
        if (startIdx !== -1 && endIdx !== -1) {
            break;
        }

        if (startNode === childList[i]) {
            startIdx = i;
        }

        if (endNode === childList[i]) {
            endIdx = i;
        }
    }

    if (startIdx === endIdx) {
        // 같은 노드인 경우

        if (cursorData.startOffset > cursorData.endOffset) {
            startOffset = cursorData.endOffset;
            endOffset = cursorData.startOffset;
        }
    } else {
        // 다른 노드인 경우
        if (startIdx > endIdx) {
            const originStartNode = startNode;
            const originStartIdx = startIdx;
            const originEndNode = endNode;
            const originEndIdx = endIdx;

            startNode = originEndNode;
            startIdx = originEndIdx;
            startOffset = cursorData.endOffset;
            endNode = originStartNode;
            endIdx = originStartIdx;
            endOffset = cursorData.startOffset;
        }
    }

    return {
        startNode: startNode,
        startNodeIdx: startIdx,
        startOffset: startOffset,
        endNode: endNode,
        endNodeIdx: endIdx,
        endOffset: endOffset,
    };
}
