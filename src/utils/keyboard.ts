import type EditorInit from "./init";
import { getBlockType, createTextBlock } from "./block";
import { setCursorData } from "./cursor";

// 에디팅 요소 키 이벤트
let enterCount: number = 0;
export function elementKeyEvent(e: KeyboardEvent, store: EditorInit) {
    setCursorData(store);

    switch (e.code) {
        case "Enter":
            e.preventDefault();

            if (enterCount === 0) {
                enterCount += 1;

                if (e.shiftKey === true) {
                    elementShiftEnterEvent(e, store);
                } else {
                    elementEnterEvent(e, store);
                }
            }
            break;
        case "Backspace":
            break;
        case "Space":
            break;
        // default:
        //     console.log("e.code", e.code);
    }

    setTimeout(() => {
        enterCount = 0;
    }, 150);
}

// 엔터 이벤트
function elementEnterEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
            textBlockEnterEvent(store, element);
            break;
    }
    console.log("enter");
    console.log("type", type);
}

// 쉬프트 엔터 이벤트
function elementShiftEnterEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    console.log("shift enter");
    console.log("type", type);
}

// 텍스트 블럭 엔터 이벤트
function textBlockEnterEvent(store: EditorInit, element: Element) {
    const $textBlock = element as HTMLParagraphElement;

    if (store.cursorData.type === "Caret") {
        // 단일 커서인경우
        if (element.hasChildNodes() === false) {
            // 자식 노드가 없는 경우
            $textBlock.insertAdjacentHTML("afterend", createTextBlock(store));

            const $nextBlock = $textBlock.nextElementSibling as HTMLParagraphElement;

            $nextBlock.focus();
        } else {
            // 자식 노드가 있는 경우
            const childNodeList = element.childNodes;
            let targetNode = store.cursorData.startNode;
            let nodeIdx = -1;
            let preStructure = "";
            let nextStructure = "";

            if (targetNode.constructor.name === "Text") {
                if (targetNode.parentElement !== $textBlock) {
                    targetNode = targetNode.parentElement;
                }
            }

            for (let i = 0; childNodeList.length > i; i += 1) {
                if (childNodeList[i] === targetNode) {
                    nodeIdx = i;
                    break;
                }
            }

            // 구조 정리
            childNodeList.forEach((node, i) => {
                
            });

            console.log("store.cursorData.startNode", store.cursorData.startNode);
            console.log("element.childNodes", element.childNodes);
            console.log("nodeIdx", nodeIdx);
        }
    } else {
        // 셀렉 커서인경우
    }

    // console.log("store.cursorData", store.cursorData);
}
