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
        case "ArrowUp":
            console.log("ArrowUp");
            break;
        case "ArrowDown":
            console.log("ArrowDown");
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
        if ($textBlock.textContent === "") {
            if ($textBlock.hasChildNodes() === false) {
                // 자식 노드가 없는 경우
                $textBlock.insertAdjacentHTML("afterend", createTextBlock(store));

                const $nextBlock = $textBlock.nextElementSibling as HTMLParagraphElement;

                $nextBlock.focus();
            } else {
                // br로 이루어진 경우
                let $target = store.cursorData.startNode;
                let preStructure = "";
                let nextStructure = "";
                let targetIdx = -1;

                if ($target.constructor.name === "HTMLParagraphElement") {
                    $target = $target.childNodes[store.cursorData.startOffset];
                }

                for (let i = 0; $textBlock.childNodes.length > 0; i += 1) {
                    if ($textBlock.childNodes[i] === $target) {
                        targetIdx = i;
                        break;
                    }
                }

                $textBlock.childNodes.forEach((_, i) => {
                    if (targetIdx >= i) {
                        preStructure += `<br>`;
                    } else {
                        nextStructure += `<br>`;
                    }
                });

                $textBlock.innerHTML = preStructure;
                $textBlock.insertAdjacentHTML("afterend", createTextBlock(store, nextStructure));

                const $nextBlock = $textBlock.nextElementSibling as HTMLParagraphElement;

                if (nextStructure === "") {
                    $nextBlock.focus();
                } else {
                    setCursor($nextBlock.childNodes[0] as Element, 0);
                }
            }
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
                if (nodeIdx < i) {
                    if (node.constructor.name === "Text") {
                        nextStructure += node.textContent;
                    } else {
                        nextStructure += (node as Element).outerHTML;
                    }
                } else if (nodeIdx > i) {
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
                    const text = node.textContent.slice(endOffset);

                    if (text !== "") {
                        nextStructure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span>`;
                    }
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

    switch (type) {
        case "text":
            textBlockShiftEnterEvent(store, element);
            break;
        // TODO : 다른 타입 블럭 이벤트
    }
}

// 텍스트 블럭 쉬프트 엔터 이벤트
function textBlockShiftEnterEvent(store: EditorInit, element: Element) {
    const $textBlock = element as HTMLParagraphElement;

    if (store.cursorData.type === "Caret") {
        // 단일 커서인경우
        if ($textBlock.textContent === "") {
            if ($textBlock.hasChildNodes() === false) {
                // 자식 노드가 없는 경우
                $textBlock.insertAdjacentHTML("beforeend", "<br><br>");
                setCursor($textBlock.childNodes[1] as Element, 0);
            } else {
                // br로만 이루어진 경우
                let $target = store.cursorData.startNode;
                let childIdx = -1;

                if ($textBlock === $target) {
                    $target = $textBlock.childNodes[store.cursorData.startOffset];
                }

                for (let i = 0; $textBlock.childNodes.length > i; i += 1) {
                    if ($textBlock.childNodes[i] === $target) {
                        childIdx = i;
                        break;
                    }
                }

                ($target as HTMLElement).insertAdjacentHTML("afterend", "<br>");
                setCursor($textBlock.childNodes[childIdx + 1] as Element, 0);
            }
        } else {
            // 자식 노드가 있고 br로만 이루어지지 않은 경우
            const childList = $textBlock.childNodes;
            let $target = store.cursorData.startNode;
            let targetIdx = -1;
            let structure: string = "";

            if ($target.constructor.name === "Text") {
                if ($target.parentNode !== $textBlock) {
                    $target = $target.parentNode;
                }
            }

            if ($textBlock === $target) {
                $target = $textBlock.childNodes[store.cursorData.startOffset];
            }

            for (let i = 0; childList.length > i; i += 1) {
                if (childList[i] === $target) {
                    targetIdx = i;
                    break;
                }
            }

            let curruntIdx = targetIdx;
            childList.forEach((child, i) => {
                if (i === targetIdx) {
                    const constructorName = child.constructor.name;

                    if (constructorName === "Text") {
                        // 텍스트 노드인 경우
                        structure += child.textContent.slice(0, store.cursorData.startOffset) + "<br>" + child.textContent.slice(store.cursorData.endOffset);

                        if (child.nextSibling === null) {
                            // 다음 노드가 없는 경우
                            if (child.textContent.slice(store.cursorData.endOffset) === "") {
                                // 뒷 문자가 없는 경우
                                structure += `<br>`;
                            }

                            if (child.textContent.slice(0, store.cursorData.startOffset) === "") {
                                // 앞 문자가 없는 경우
                                curruntIdx -= 1;
                            }
                        } else {
                            // 다음 노드가 있는 경우
                            if (child.textContent.slice(store.cursorData.endOffset) !== "" && child.textContent.slice(0, store.cursorData.startOffset) === "") {
                                // 뒷 문자가 있고 앞 문자가 없는 경우
                                curruntIdx -= 1;
                            }
                        }

                        curruntIdx += 1;
                    } else {
                        // 엘리먼트인 경우
                        if (constructorName === "HTMLBRElement") {
                            // br 태그인 경우 // 존재 하나?
                            
                            console.log("is br?");
                        } else {
                            // span 태그인 경우
                            // TODO : 스타일 태그 분리 작업
                            console.log("TODO: 스타일 태그 분리 작업");
                        }
                    }
                } else {
                    if (child.constructor.name === "Text") {
                        structure += child.textContent;
                    } else {
                        structure += (child as HTMLElement).outerHTML;
                    }
                }
            });

            $textBlock.innerHTML = structure;
            setCursor($textBlock.childNodes[curruntIdx + 1] as Element, 0);
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
        let structure = "";

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
                    structure += node.textContent;
                } else {
                    structure += (node as Element).outerHTML;
                }
            } else if (startNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    structure += node.textContent.slice(0, startOffset);
                    structure += `<br>`;
                } else {
                    if ((node as HTMLElement).tagName === "BR") {
                        structure += `<br>`;
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent;

                        structure += `<span class="${originalClassList.join(" ")}">${text.slice(0, startOffset)}</span><br>`;
                    }
                }

                if (childNodeList.length === i) {
                    structure += `<br>`;
                }
            }

            if (endNodeIdx < i) {
                if (node.constructor.name === "Text") {
                    structure += node.textContent;
                } else {
                    structure += (node as Element).outerHTML;
                }
            } else if (endNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    structure += node.textContent.slice(endOffset);
                } else {
                    if ((node as HTMLElement).tagName === "BR") {
                        structure += `<br>`;
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent;

                        structure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span><br>`;
                    }
                }
            }
        });

        $textBlock.innerHTML = structure;
        setCursor($textBlock.childNodes[startNodeIdx + 2] as Element, 0);
    }
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
        if (store.cursorData.startOffset === 0 && store.cursorData.startNode === $textBlock) {
            // 커서가 첫번째에 있는 경우
            e.preventDefault();
        }
    } else {
        // 블럭이 한개만 있지 않는 경우
        if ($textBlock.hasChildNodes() === false) {
            // 내용이 없는 경우
            e.preventDefault();

            const $preBlock = $textBlock.previousElementSibling;

            if ($preBlock !== null) {
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
            }
        } else {
            // 내용이 있는 경우
            if (store.cursorData.startOffset === 0 && $textBlock.childNodes[0] === store.cursorData.startNode) {
                // 커서가 첫번째에 있는 경우
                e.preventDefault();

                const $preBlock = $textBlock.previousElementSibling;

                if ($preBlock !== null) {
                    const { type: preBlockType } = getBlockType($preBlock as HTMLElement);

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
