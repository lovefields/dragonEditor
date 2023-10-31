import store from "../../core/store/editorStore";
import type { CursorSelection, arrangementCursorData } from "../../../types";
import { findEditableElement } from "./element";

// 화면에 커서 부여
export function setCursorToView() {
    if (store.windowObject !== undefined) {
    }
    // // 노드 기준 커서 위치 설정
    // if (target) {
    //     let $target: Node;
    //     if (target.constructor.name === "Text") {
    //         $target = target;
    //     } else {
    //         $target = target.childNodes.length > 0 ? target.childNodes[0] : target;
    //     }
    //     const select = window.getSelection() as Selection;
    //     const range = document.createRange();
    //     const realLength = $target.textContent?.length as number;
    //     if (realLength < idx) {
    //         idx = realLength;
    //     }
    //     range.setStart($target, idx);
    //     range.collapse(true);
    //     select.removeAllRanges();
    //     select.addRange(range);
    // }
}

// 커서 위치 설정
export function setCursorData() {
    const data: CursorSelection = {
        type: "",
        startNode: null,
        startOffset: null,
        endNode: null,
        endOffset: null,
    };

    if (store.windowObject !== undefined) {
        const select: Selection | null = store.windowObject.getSelection();

        if (select !== null) {
            data.type = select.type;
            data.startNode = select.anchorNode;
            data.startOffset = select.anchorOffset;
            data.endNode = select.focusNode;
            data.endOffset = select.focusOffset;
        }
    }

    store.selection = data;
}

// export function getArrangementCursorData(parentCursorData): arrangementCursorData {
//     // Text 노드 병합 전에 병합 후 커서 위치 연산
//     let cursorData = getCursor();

//     if (cursorData.startNode === null) {
//         // 커서위치가 올바르지 않은경우 부모의 커서 위치 사용
//         cursorData = parentCursorData;
//     }

//     let startNode = cursorData.startNode as Node;
//     let editableElement = findEditableElement(startNode) as HTMLElement;

//     if (editableElement === null) {
//         // 에디터블 노드가 없는 경우 부모의 커서 위치를 사용해 재지정
//         cursorData = parentCursorData;
//         startNode = cursorData.startNode as Node;
//         editableElement = findEditableElement(startNode) as HTMLElement;
//     }

//     let childNode: Node;
//     let childIdx: number = -1;
//     let fixIdx: number = 0;
//     let preNodeType: string = "";
//     let childLength: number = 0;

//     // 하위 노드 확인
//     if (startNode.parentNode === editableElement) {
//         childNode = startNode;
//     } else {
//         childNode = startNode.parentNode as HTMLElement;
//     }

//     // 하위 노드 순서 값 획득
//     editableElement.childNodes.forEach((child, count) => {
//         if (child === childNode) {
//             childIdx = count;
//         }
//     });

//     // 기존값 대비 병합 처리되는 노드 수와 커서 위치 제정의
//     editableElement.childNodes.forEach((child, count) => {
//         if (count <= childIdx + fixIdx) {
//             const type = child.constructor.name;

//             if (preNodeType !== type) {
//                 childLength = 0;
//             }

//             if (type === "Text") {
//                 if (preNodeType === type) {
//                     childIdx -= 1;
//                     fixIdx += 1;
//                     childLength += child.textContent?.length ?? 0;
//                 } else {
//                     childLength = child.textContent?.length ?? 0;
//                 }
//             } else {
//                 childLength = child.textContent?.length ?? 0;
//             }

//             preNodeType = type;
//         }
//     });

//     return {
//         editableNode: editableElement,
//         childCount: childIdx,
//         length: childLength,
//     };
// }
