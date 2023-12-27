import type EditorInit from "./init";
import { getBlockType, createTextBlock } from "./block";
import { setCursorData, setCursor, clenupCursor } from "./cursor";

// 에디팅 요소 키 이벤트
let ketEventCount: number = 0;
export function elementKeyEvent(e: KeyboardEvent, store: EditorInit) {
    setCursorData(store);

    switch (e.code) {
        case "Enter":
            e.preventDefault();

            if (ketEventCount === 0) {
                // 문자 조합에 의한 중복 제거 처리
                clenupCursor(store);

                // 커서 정렬후 딜레이
                setTimeout(() => {
                    if (e.shiftKey === true) {
                        elementShiftEnterEvent(e, store);
                    } else {
                        elementEnterEvent(e, store);
                    }
                });
            }

            // 문자 조합에 의한 중복 이벤트 막는 처리
            ketEventCount += 1;
            setTimeout(() => {
                ketEventCount = 0;
            }, 150);
            break;
        case "Backspace":
            elementBackspaceEvent(e, store);
            break;
        case "Tab":
            e.preventDefault();

            if (ketEventCount === 0) {
                // 문자 조합에 의한 중복 제거 처리
                clenupCursor(store);

                // 커서 정렬후 딜레이
                setTimeout(() => {
                    elementTabEvent(e, store);
                });
            }

            // 문자 조합에 의한 중복 이벤트 막는 처리
            ketEventCount += 1;
            setTimeout(() => {
                ketEventCount = 0;
            }, 150);
            break;
        case "Space":
            console.log("space");
            break;
        // default:
        //     console.log("e.code", e.code);
    }
}

// 엔터 이벤트
function elementEnterEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
            textBlockEnterEvent(store, element);
            break;
        // TODO : 다른 타입 블럭 이벤트
    }

    // console.log("enter");
    // console.log("type", type);
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

            // 노드 위치 파악
            for (let i = 0; childNodeList.length > i; i += 1) {
                if (childNodeList[i] === targetNode) {
                    nodeIdx = i;
                    break;
                }
            }

            // 구조 정리
            childNodeList.forEach((node: ChildNode, i: number) => {
                if (i < nodeIdx) {
                    if (node.constructor.name === "Text") {
                        preStructure += node.textContent;
                    } else {
                        preStructure += (node as Element).outerHTML;
                    }
                } else if (nodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        preStructure += node.textContent.slice(0, store.cursorData.startOffset);
                        nextStructure += node.textContent.slice(store.cursorData.startOffset);
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent;

                        preStructure += `<span class="${originalClassList.join(" ")}">${text.slice(0, store.cursorData.startOffset)}</span>`;
                        nextStructure += `<span class="${originalClassList.join(" ")}">${text.slice(store.cursorData.startOffset)}</span>`;
                    }
                } else if (nodeIdx > i) {
                    if (node.constructor.name === "Text") {
                        nextStructure += node.textContent;
                    } else {
                        nextStructure += (node as Element).outerHTML;
                    }
                }
            });

            // 텍스트 블럭 삽입
            const nextBlockStructure = createTextBlock(store, nextStructure);
            $textBlock.insertAdjacentHTML("afterend", nextBlockStructure);
            $textBlock.innerHTML = preStructure;

            // 커서 위치 지정
            const $nextBlock = $textBlock.nextElementSibling;
            setCursor($nextBlock, 0);
        }
    } else {
        // 셀렉트 커서인경우
        const childNodeList = $textBlock.childNodes;
        let startTargetNode = store.cursorData.startNode;
        let startNodeIdx: number = -1;
        let startOffset: number = store.cursorData.startOffset;
        let endTargetNode = store.cursorData.endNode;
        let endNodeIdx: number = -1;
        let endOffset: number = store.cursorData.endOffset;
        let preStructure = "";
        let nextStructure = "";

        if (startTargetNode.constructor.name === "Text") {
            if (startTargetNode.parentElement !== $textBlock) {
                startTargetNode = startTargetNode.parentElement;
            }
        }

        if (endTargetNode.constructor.name === "Text") {
            if (endTargetNode.parentElement !== $textBlock) {
                endTargetNode = endTargetNode.parentElement;
            }
        }

        for (let i: number = 0; childNodeList.length > i; i += 1) {
            if (startTargetNode === childNodeList[i]) {
                startNodeIdx = i;
            }

            if (endTargetNode === childNodeList[i]) {
                endNodeIdx = i;
            }

            if (startNodeIdx !== -1 && endNodeIdx !== -1) {
                break;
            }
        }

        // 역 드레그 인 경우 정리
        if (startNodeIdx !== endNodeIdx) {
            if (startNodeIdx > endNodeIdx) {
                const originalEndNodeIdx: number = endNodeIdx;
                const originalEndOffset: number = endOffset;
                const originalStartNodeIdx: number = startNodeIdx;
                const originalStartOffset: number = startOffset;

                startNodeIdx = originalEndNodeIdx;
                startOffset = originalEndOffset;
                endNodeIdx = originalStartNodeIdx;
                endOffset = originalStartOffset;
            }
        } else {
            if (startOffset > endOffset) {
                const originalEndOffset: number = endOffset;
                const originalStartOffset: number = startOffset;

                startOffset = originalEndOffset;
                endOffset = originalStartOffset;
            }
        }

        childNodeList.forEach((node: ChildNode, i: number) => {
            if (startNodeIdx > i) {
                if (node.constructor.name === "Text") {
                    preStructure += node.textContent;
                } else {
                    preStructure += (node as Element).outerHTML;
                }
            } else if (startNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    preStructure += node.textContent.slice(0, startOffset);
                } else {
                    const originalClassList = [...(node as Element).classList];
                    const text = node.textContent;

                    preStructure += `<span class="${originalClassList.join(" ")}">${text.slice(0, startOffset)}</span>`;
                }
            }

            if (endNodeIdx < i) {
                if (node.constructor.name === "Text") {
                    nextStructure += node.textContent;
                } else {
                    nextStructure += (node as Element).outerHTML;
                }
            } else if (endNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    nextStructure += node.textContent.slice(endOffset);
                } else {
                    const originalClassList = [...(node as Element).classList];
                    const text = node.textContent;

                    nextStructure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span>`;
                }
            }
        });

        // 텍스트 블럭 삽입
        const nextBlockStructure = createTextBlock(store, nextStructure);
        $textBlock.insertAdjacentHTML("afterend", nextBlockStructure);
        $textBlock.innerHTML = preStructure;

        // 커서 위치 지정
        const $nextBlock = $textBlock.nextElementSibling;
        setCursor($nextBlock, 0);
    }
}

// 쉬프트 엔터 이벤트
function elementShiftEnterEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    // TODO : 쉬프트 엔터 이벤트 지정
    console.log("shift enter");
    console.log("type", type);
}

// 백스페이스 이벤트
function elementBackspaceEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
            textBlockBackspaceEvent(e, store, element);
            break;
        // TODO : 다른 타입 블럭 이벤트
    }
}

// 텍스트 블럭 백스페이스 이벤트
function textBlockBackspaceEvent(e: KeyboardEvent, store: EditorInit, element: Element) {
    const $textBlock = element as HTMLParagraphElement;
    const childLength = store.wrap.querySelectorAll(".de-block").length;

    if (childLength === 1) {
        // 블럭이 한개만 있는 경우
        if (store.cursorData.startOffset === 0) {
            // 커서가 첫번째에 있는 경우
            e.preventDefault();
        }
    } else {
        // 블럭이 한개만 있지 않는 경우
        if ($textBlock.textContent === "") {
            // 내용이 없는 경우
            e.preventDefault();

            const $preBlock = $textBlock.previousElementSibling;
            const { type: preBlockType } = getBlockType($textBlock);

            $textBlock.remove();

            if (preBlockType === "text") {
                if ($preBlock.hasChildNodes() === true) {
                    const textBlockChildList = $preBlock.childNodes;
                    const textBlockTargetChild = textBlockChildList[textBlockChildList.length - 1];
                    setCursor(textBlockTargetChild as Element, textBlockTargetChild.textContent.length);
                } else {
                    setCursor($preBlock as Element, 0);
                }
            }
        } else {
            // 내용이 있는 경우
            if (store.cursorData.startOffset === 0) {
                // 커서가 첫번째에 있는 경우
                e.preventDefault();

                const $preBlock = $textBlock.previousElementSibling;
                const { type: preBlockType } = getBlockType($textBlock);

                if (preBlockType === "text") {
                    if ($preBlock.hasChildNodes() === true) {
                        const textBlockChildList = $preBlock.childNodes;
                        const textBlockTargetChildIdx = textBlockChildList.length - 1;
                        const textBlockTargetCursorIdx = textBlockChildList[textBlockTargetChildIdx].textContent.length;
                        const thisBlockHTML = $textBlock.innerHTML;

                        $preBlock.innerHTML = $preBlock.innerHTML + thisBlockHTML;
                        setCursor($preBlock.childNodes[textBlockTargetChildIdx] as Element, textBlockTargetCursorIdx);
                    } else {
                        $preBlock.innerHTML = $textBlock.innerHTML;
                        setCursor($preBlock as Element, 0);
                    }

                    $textBlock.remove();
                }
            }
        }
    }
}

// 탭 이벤트
function elementTabEvent(e: KeyboardEvent, store: EditorInit) {
    const { element, type } = getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
            defaultTabEvent(e.shiftKey, element);
            break;
    }
}

// 기본 탭 이벤트
function defaultTabEvent(useShiftKey: boolean, element: Element) {
    const $target = element as HTMLElement;
    let value: number = $target.dataset["depth"] === undefined ? 0 : parseInt($target.dataset["depth"]);

    if (useShiftKey === true) {
        if (value !== 0) {
            value -= 1;
        }
    } else {
        if (value < 5) {
            value += 1;
        }
    }

    if (value === 0) {
        delete $target.dataset["depth"];
    } else {
        $target.dataset["depth"] = String(value);
    }
}
