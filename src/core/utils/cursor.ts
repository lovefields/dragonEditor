import type {cursorSelection, arrangementCursorData} from "../../types";
import {findEditableElement} from "./element";

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

export function getArrangementCursorData(): arrangementCursorData {
    const cursorData = getCursor();
    const editableElement = findEditableElement(cursorData.startNode);
    let childNode: Node;
    let childIdx: number = -1;
    let preNodeType: string = "Text";
    let childLength: number = 0;

    if (cursorData.startNode.parentNode === editableElement) {
        childNode = cursorData.startNode;
    } else {
        childNode = cursorData.startNode.parentNode;
    }

    editableElement.childNodes.forEach((child, count) => {
        if (child === childNode) {
            childIdx = count;
        }
    });

    editableElement.childNodes.forEach((child, count) => {
        const type = child.constructor.name;

        if (type === "Text" && preNodeType === type && count < childIdx) {
            childIdx -= 1;
            childLength += child.textContent?.length ?? 0;
        } else {
            childLength = child.textContent?.length ?? 0;
        }

        preNodeType = type;
    });

    return {
        editableNode: editableElement,
        childCount: childIdx,
        length: childLength,
    }
}
