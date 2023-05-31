import type {cursorSelection, arrangementCursorData} from "../../types";
import {findEditableElement} from "./element";

export function setCursor(target: Node, idx: number) {
    console.log(target);
    if (target) {
        let $target: Node;

        if (target.constructor.name === "Text") {
            $target = target;
        } else {
            $target = target.childNodes.length > 0 ? target.childNodes[0] : target;
        }

        const select = window.getSelection() as Selection;
        const range = document.createRange();

        range.setStart($target, idx);
        range.collapse(true);
        select.removeAllRanges();
        select.addRange(range);
    }
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

export function getArrangementCursorData(): arrangementCursorData { // Text 노드 병합 전에 병합 후 커서 위치 연산
    const cursorData = getCursor();
    const startNode = cursorData.startNode as Node;
    const editableElement = findEditableElement(startNode) as HTMLElement;
    let childNode: Node;
    let childIdx: number = -1;
    let fixIdx: number = 0;
    let preNodeType: string = "";
    let childLength: number = 0;

    if (startNode.parentNode === editableElement) {
        childNode = startNode;
    } else {
        childNode = startNode.parentNode as HTMLElement;
    }

    editableElement.childNodes.forEach((child, count) => {
        if (child === childNode) {
            childIdx = count;
        }
    });

    editableElement.childNodes.forEach((child, count) => {
        if (count <= childIdx + fixIdx) {
            const type = child.constructor.name;

            if (preNodeType !== type) {
                childLength = 0;
            }

            if (type === "Text") {
                if (preNodeType === type) {
                    childIdx -= 1;
                    fixIdx += 1;
                    childLength += child.textContent?.length ?? 0;
                } else {
                    childLength = child.textContent?.length ?? 0;
                }
            } else {
                childLength = child.textContent?.length ?? 0;
            }

            preNodeType = type;
        }
    });

    return {
        editableNode: editableElement,
        childCount: childIdx,
        length: childLength,
    }
}
