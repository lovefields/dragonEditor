import store from "../../core/store/editorStore";
import type { CursorSelection, arrangementCursorData } from "../../../types";
import { findEditableElement } from "./element";

// 화면에 커서 부여
export function setCursorToView() {
    if (store.windowObject !== undefined && store.selection.type !== "") {
        const type: string = store.editorData.value[store.activeIndexNumber].type;
        const $targetRow = document.querySelectorAll(".dragon-editor .d-row-block")[store.activeIndexNumber] as HTMLDivElement | undefined;

        if ($targetRow !== undefined) {
            const range = document.createRange();
            const selection = window.getSelection() as Selection;
            let suitable = true;

            switch (type) {
                case "text":
                    const $textElement = $targetRow.querySelector(".d-text-block") as HTMLParagraphElement;
                    let startChildIdx: number = -1;
                    let endChildIdx: number = -1;

                    $textElement.childNodes.forEach((node: ChildNode, i: number) => {
                        let nodeData: string = "";

                        if (node.constructor.name === "Text") {
                            nodeData = node.textContent ?? "";
                        } else {
                            nodeData = (node as HTMLElement).outerHTML;
                        }

                        if (store.selection.startNode === nodeData) {
                            startChildIdx = i;
                        }

                        if (store.selection.endNode === nodeData) {
                            endChildIdx = i;
                        }
                    });

                    if (store.selection.type === "Caret") {
                        if (startChildIdx < 0) {
                            suitable = false;
                        } else {
                            range.setStart($textElement.childNodes[startChildIdx], store.selection.startOffset as number);
                        }
                    } else {
                        if (startChildIdx < 0 || endChildIdx < 0) {
                            suitable = false;
                        } else {
                            let originStartIdx: number = 0;
                            let originEndIdx: number = 0;
                            let originStartOffset: number = 0;
                            let originEndOffset: number = 0;

                            // 드래그 정렬 로직 : 드래그의 경우 스타트 포인트가 무조건 앞에 있어야 랩핑이 가능함
                            if (startChildIdx > endChildIdx) {
                                originStartIdx = endChildIdx;
                                originEndIdx = startChildIdx;
                                originStartOffset = store.selection.endOffset as number;
                                originEndOffset = store.selection.startOffset as number;
                            } else if (startChildIdx == endChildIdx) {
                                originStartIdx = startChildIdx;
                                originEndIdx = endChildIdx;

                                if ((store.selection.startOffset as number) > (store.selection.endOffset as number)) {
                                    originStartOffset = store.selection.endOffset as number;
                                    originEndOffset = store.selection.startOffset as number;
                                } else {
                                    originStartOffset = store.selection.startOffset as number;
                                    originEndOffset = store.selection.endOffset as number;
                                }
                            } else {
                                originStartIdx = startChildIdx;
                                originEndIdx = endChildIdx;
                                originStartOffset = store.selection.startOffset as number;
                                originEndOffset = store.selection.endOffset as number;
                            }

                            if ($textElement.childNodes[startChildIdx] === $textElement.childNodes[endChildIdx]) {
                                if (originEndOffset === 0) {
                                    originEndOffset = ($textElement.childNodes[startChildIdx].textContent as string).length;
                                }
                            }

                            range.setStart($textElement.childNodes[originStartIdx], originStartOffset);
                            range.setEnd($textElement.childNodes[originEndIdx], originEndOffset);
                        }
                    }
                    break;
            }

            if (suitable === true) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
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
            data.startOffset = select.anchorOffset;
            data.endOffset = select.focusOffset;

            if ((select.anchorNode as Node).constructor.name === "Text") {
                data.startNode = (select.anchorNode as Node).textContent;
            } else {
                data.startNode = (select.anchorNode as HTMLElement).outerHTML;
            }

            if ((select.focusNode as Node).constructor.name === "Text") {
                data.endNode = (select.focusNode as Node).textContent;
            } else {
                data.endNode = (select.focusNode as HTMLElement).outerHTML;
            }
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
