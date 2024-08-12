import { _setCursor, _setCursorData, _clenupCursor, _soltingCursorDataOnElement } from "./cursor";
import { _getParentElementIfNodeIsText, _findContentEditableElement } from "./element";
import { _getBlockType, _createTextBlock, _createListItemBlock } from "./block";
import { _setNodeStyle } from "./style";

// 에디팅 요소 키 이벤트
let ketEventCount: number = 0;
export function _elementKeyEvent(event: KeyboardEvent, store: any) {
    _setCursorData(store);

    switch (event.code) {
        case "Enter":
            event.preventDefault();

            if (ketEventCount === 0) {
                // 문자 조합에 의한 중복 제거 처리

                _clenupCursor(store);
                // 커서 정렬후 딜레이
                setTimeout(() => {
                    if (event.shiftKey === true) {
                        elementShiftEnterEvent(event, store);
                    } else {
                        elementEnterEvent(event, store);
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
            elementBackspaceEvent(event, store);
            break;
        case "Tab":
            event.preventDefault();

            if (ketEventCount === 0) {
                // 문자 조합에 의한 중복 제거 처리
                _clenupCursor(store);

                // 커서 정렬후 딜레이
                setTimeout(() => {
                    elementTabEvent(event, store);
                });
            }

            // 문자 조합에 의한 중복 이벤트 막는 처리
            ketEventCount += 1;
            setTimeout(() => {
                ketEventCount = 0;
            }, 150);
            break;
        case "Space":
            // TODO: 자동 변환 설정 - list,heading,code,etc
            // console.log("space");
            break;
        case "ArrowUp":
            moveToBlockEvent(event, store, "up");
            break;
        case "ArrowDown":
            moveToBlockEvent(event, store, "down");
            break;
        //         // default:
        //         //     console.log("e.code", e.code);
    }
}

// 엔터 이벤트
function elementEnterEvent(event: KeyboardEvent, store: any) {
    const { $element, type } = _getBlockType(event.target as HTMLElement);

    switch (type) {
        case "text":
        case "heading":
            defaultBlockEnterEvent(store, $element);
            break;
        case "list":
            listBlockEnterEvent(event, store, $element);
            break;
        default:
        // TODO : 다른 타입 블럭 엔터 이벤트
    }
}

// 쉬프트 엔터 이벤트
function elementShiftEnterEvent(event: KeyboardEvent, store: any) {
    const { $element, type } = _getBlockType(event.target as HTMLElement);

    switch (type) {
        case "text":
        case "heading":
            defaultBlockShiftEnterEvent(store, $element);
            break;
        case "list":
            // NOTE: 리스트 블럭은 쉬프트 엔터 비허용
            listBlockEnterEvent(event, store, $element);
            break;
        default:
        // TODO : 다른 타입 블럭 쉬프트 이벤트
    }
}

// 백스페이스 이벤트
function elementBackspaceEvent(e: KeyboardEvent, store: any) {
    const { $element, type } = _getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
        case "heading":
            defaultBlockBackspaceEvent(e, store, $element);
            break;
        default:
            console.log("// TODO : 다른 타입 블럭 백스페이스 이벤트", type);
    }
}

// 기본 블럭 엔터 이벤트
function defaultBlockEnterEvent(store: any, $element: Element) {
    const $textBlock = $element as HTMLElement;

    if (store.cursorData.type === "Caret") {
        // 단일 커서인경우
        if ($textBlock.textContent === "") {
            // 텍스트가 없는 경우
            if ($textBlock.hasChildNodes() === false) {
                // 자식 노드가 없는 경우
                const $newTextBlock = _createTextBlock();

                $textBlock.insertAdjacentElement("afterend", $newTextBlock);
                $newTextBlock.focus();
            } else {
                // br로 이루어진 경우
                let preStructure: HTMLBRElement[] = [];
                let nextStructure: HTMLBRElement[] = [];

                $textBlock.childNodes.forEach((_, i) => {
                    const $br = document.createElement("br");
                    if (store.cursorData.startOffset < i) {
                        preStructure.push($br);
                    } else {
                        nextStructure.push($br);
                    }
                });

                $textBlock.replaceChildren(...preStructure);
                $textBlock.insertAdjacentElement("afterend", _createTextBlock());
                const $nextBlock = $textBlock.nextElementSibling as HTMLParagraphElement;

                if (nextStructure.length === 0) {
                    $nextBlock.focus();
                } else {
                    if (nextStructure.length === 1) {
                        nextStructure.push(document.createElement("br"));
                    }
                    $nextBlock.replaceChildren(...nextStructure);
                    _setCursor(nextStructure[0], 0);
                }
            }
        } else {
            // 자식 노드가 있는 경우
            const childNodeList = [...$element.childNodes];
            const $targetNode = _getParentElementIfNodeIsText(store.cursorData.startNode, $textBlock);
            const preStructure: Node[] = [];
            const nextStructure: Node[] = [];
            let nodeIdx = -1;

            // 노드 위치 파악
            for (let i = 0; childNodeList.length > i; i += 1) {
                if (childNodeList[i] === $targetNode) {
                    nodeIdx = i;
                    break;
                }
            }

            // 구조 정리
            childNodeList.forEach((node: ChildNode, i: number) => {
                if (nodeIdx < i) {
                    nextStructure.push(node);
                } else if (nodeIdx > i) {
                    preStructure.push(node);
                } else if (nodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        const text = node.textContent as string;
                        const preText = document.createTextNode(text.slice(0, store.cursorData.startOffset));
                        const nextText = document.createTextNode(text.slice(store.cursorData.startOffset));

                        preStructure.push(preText);
                        nextStructure.push(nextText);
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent as string;
                        const preSpan = document.createElement("span");
                        const nextSpan = document.createElement("span");

                        preSpan.classList.add(...originalClassList);
                        preSpan.textContent = text.slice(0, store.cursorData.startOffset);
                        preStructure.push(preSpan);
                        nextSpan.classList.add(...originalClassList);
                        nextSpan.textContent = text.slice(store.cursorData.startOffset);
                        nextStructure.push(nextSpan);
                    }
                }
            });

            const $nextBlock = _createTextBlock();

            // 텍스트 블럭 삽입
            $textBlock.insertAdjacentElement("afterend", $nextBlock);
            $textBlock.replaceChildren(...preStructure);
            $nextBlock.replaceChildren(...nextStructure);

            // 커서 위치 지정
            if (nextStructure.length === 0) {
                $nextBlock.focus();
            } else {
                _setCursor($nextBlock.childNodes[0], 0);
            }
        }
    } else {
        // 셀렉트 커서인경우
        const childNodeList = $textBlock.childNodes;
        const cursorData = _soltingCursorDataOnElement(store.cursorData, $textBlock);
        const preStructure: Node[] = [];
        const nextStructure: Node[] = [];

        if (cursorData.startNodeIdx === cursorData.endNodeIdx) {
            // 같은 노드의 경우
            childNodeList.forEach((node: ChildNode, i: number) => {
                if (cursorData.startNodeIdx > i) {
                    preStructure.push(node);
                } else if (cursorData.endNodeIdx < i) {
                    nextStructure.push(node);
                } else if (cursorData.startNodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                        const nextText = (node.textContent as string).slice(cursorData.endOffset);
                        if (preText !== "") {
                            const textNode = document.createTextNode(preText);
                            preStructure.push(textNode);
                        }
                        if (nextText !== "") {
                            const textNode = document.createTextNode(nextText);
                            nextStructure.push(textNode);
                        }
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                        const nextText = (node.textContent as string).slice(cursorData.endOffset);
                        if (preText !== "") {
                            const $span = document.createElement("span");
                            $span.classList.add(...originalClassList);
                            $span.textContent = preText;
                            preStructure.push($span);
                        }
                        if (nextText !== "") {
                            const $span = document.createElement("span");
                            $span.classList.add(...originalClassList);
                            $span.textContent = nextText;
                            nextStructure.push($span);
                        }
                    }
                }
            });
        } else {
            // 다른 노드의 경우
            childNodeList.forEach((node: ChildNode, i: number) => {
                if (cursorData.startNodeIdx > i) {
                    preStructure.push(node);
                } else if (cursorData.startNodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        const text = (node.textContent as string).slice(0, cursorData.startOffset);
                        if (text !== "") {
                            const textNode = document.createTextNode(text);
                            preStructure.push(textNode);
                        }
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = (node.textContent as string).slice(0, cursorData.startOffset);
                        if (text !== "") {
                            const $span = document.createElement("span");
                            $span.classList.add(...originalClassList);
                            $span.textContent = text;
                            preStructure.push($span);
                        }
                    }
                }
                if (cursorData.endNodeIdx < i) {
                    nextStructure.push(node);
                } else if (cursorData.endNodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        const text = (node.textContent as string).slice(cursorData.endOffset);
                        if (text !== "") {
                            const textNode = document.createTextNode(text);
                            nextStructure.push(textNode);
                        }
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = (node.textContent as string).slice(cursorData.endOffset);
                        const $span = document.createElement("span");
                        if (text !== "") {
                            $span.classList.add(...originalClassList);
                            $span.textContent = text;
                            nextStructure.push($span);
                        }
                    }
                }
            });
        }

        const $nextBlock = _createTextBlock(store);

        // 텍스트 블럭 삽입
        $textBlock.insertAdjacentElement("afterend", $nextBlock);
        $textBlock.replaceChildren(...preStructure);
        $nextBlock.replaceChildren(...nextStructure);

        // 커서 위치 지정
        if (nextStructure.length === 0) {
            $nextBlock.focus();
        } else {
            _setCursor($nextBlock.childNodes[0], 0);
        }
    }
}

// 리스트 블럭 엔터 이벤트
function listBlockEnterEvent(event: KeyboardEvent, store: any, $element: Element) {
    const $listBlock = $element as HTMLElement;
    const $editableElement = _findContentEditableElement(event.target as Node) as HTMLLIElement;
    const liList = $listBlock.querySelectorAll(".de-item");
    let liIdx = -1;

    for (let i = 0; liList.length > i; i += 1) {
        if (liList[i] === $editableElement) {
            liIdx = i;
            break;
        }
    }

    if (store.cursorData.type === "Caret") {
        // 단일 커서인경우

        if ($editableElement.textContent === "") {
            // 텍스트가 없는 경우

            if (liList.length - 1 === liIdx) {
                // 마지막 아이템인 경우

                const $textBlock = _createTextBlock();

                $listBlock.insertAdjacentElement("afterend", $textBlock);

                if (liList.length === 1) {
                    $listBlock.remove();
                } else {
                    $editableElement.remove();
                }

                $textBlock.focus();
            } else {
                // 마지막 아이템이 아닌 경우

                const $liBlock = _createListItemBlock();

                $editableElement.insertAdjacentElement("afterend", $liBlock);
                $liBlock.focus();
            }
        } else {
            // 텍스트가 있는 경우

            const childNodeList = $editableElement.childNodes;
            const targetNode = _getParentElementIfNodeIsText(store.cursorData.startNode, $editableElement);
            const preStructure: Node[] = [];
            const nextStructure: Node[] = [];
            let nodeIdx = -1;

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
                    nextStructure.push(node);
                } else if (nodeIdx > i) {
                    preStructure.push(node);
                } else if (nodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        const preText = (node.textContent as string).slice(0, store.cursorData.startOffset);
                        const nextText = (node.textContent as string).slice(store.cursorData.endOffset);
                        if (preText !== "") {
                            preStructure.push(document.createTextNode(preText));
                        }
                        if (nextText !== "") {
                            nextStructure.push(document.createTextNode(nextText));
                        }
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const preText = (node.textContent as string).slice(0, store.cursorData.startOffset);
                        const nextText = (node.textContent as string).slice(store.cursorData.endOffset);
                        if (preText !== "") {
                            const $span = document.createElement("span");
                            $span.textContent = preText;
                            $span.classList.add(...originalClassList);
                            preStructure.push($span);
                        }
                        if (nextText !== "") {
                            const $span = document.createElement("span");
                            $span.textContent = nextText;
                            $span.classList.add(...originalClassList);
                            nextStructure.push($span);
                        }
                    }
                }
            });

            const $liBlock = _createListItemBlock();

            // 리스트 블럭 삽입
            $editableElement.insertAdjacentElement("afterend", $liBlock);
            $editableElement.replaceChildren(...preStructure);
            $liBlock.replaceChildren(...nextStructure);

            // 커서 위치 지정
            if (nextStructure.length === 0) {
                $liBlock.focus();
            } else {
                _setCursor($liBlock.childNodes[0], 0);
            }
        }
    } else {
        // 셀렉트 커서인 경우

        const childNodeList = $editableElement.childNodes;
        const cursorData = _soltingCursorDataOnElement(store.cursorData, $editableElement);
        const preStructure: Node[] = [];
        const nextStructure: Node[] = [];

        childNodeList.forEach((node: ChildNode, i: number) => {
            if (cursorData.startNodeIdx > i) {
                preStructure.push(node);
            } else if (cursorData.startNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    const text = (node.textContent as string).slice(0, cursorData.startOffset);
                    if (text !== "") {
                        const $textNode = document.createTextNode(text);
                        preStructure.push($textNode);
                    }
                } else {
                    const originalClassList = [...(node as Element).classList];
                    const text = (node.textContent as string).slice(0, cursorData.startOffset);
                    if (text !== "") {
                        const $span = document.createElement("span");
                        $span.classList.add(...originalClassList);
                        $span.textContent = text;
                        preStructure.push($span);
                    }
                }
            }

            if (cursorData.endNodeIdx < i) {
                nextStructure.push(node);
            } else if (cursorData.endNodeIdx === i) {
                if (node.constructor.name === "Text") {
                    const text = (node.textContent as string).slice(cursorData.endOffset);
                    if (text !== "") {
                        const $textNode = document.createTextNode(text);
                        nextStructure.push($textNode);
                    }
                } else {
                    const originalClassList = [...(node as Element).classList];
                    const text = (node.textContent as string).slice(cursorData.endOffset);
                    if (text !== "") {
                        const $span = document.createElement("span");
                        $span.classList.add(...originalClassList);
                        $span.textContent = text;
                        nextStructure.push($span);
                    }
                }
            }
        });

        const $liBlock = _createListItemBlock();

        // 리스트 블럭 삽입
        $editableElement.insertAdjacentElement("afterend", $liBlock);
        $editableElement.replaceChildren(...preStructure);

        // 커서 위치 지정
        if (nextStructure.length === 0) {
            $liBlock.focus();
        } else {
            $liBlock.replaceChildren(...nextStructure);
            _setCursor(nextStructure[0], 0);
        }
    }
}

// 텍스트 블럭 쉬프트 엔터 이벤트
function defaultBlockShiftEnterEvent(store: any, $element: Element) {
    const $textBlock = $element as HTMLElement;

    if (store.cursorData.type === "Caret") {
        // 단일 커서인경우

        if ($textBlock.textContent === "") {
            if ($textBlock.hasChildNodes() === false) {
                // 자식 노드가 없는 경우

                $textBlock.insertAdjacentHTML("beforeend", "<br><br>");
                _setCursor($textBlock.childNodes[1] as Element, 0);
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
                _setCursor($textBlock.childNodes[childIdx + 1] as Element, 0);
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
                        structure += (child.textContent as string).slice(0, store.cursorData.startOffset) + "<br>" + (child.textContent as string).slice(store.cursorData.endOffset);

                        if (child.nextSibling === null) {
                            // 다음 노드가 없는 경우
                            if ((child.textContent as string).slice(store.cursorData.endOffset) === "") {
                                // 뒷 문자가 없는 경우
                                structure += `<br>`;
                            }
                            if ((child.textContent as string).slice(0, store.cursorData.startOffset) === "") {
                                // 앞 문자가 없는 경우
                                curruntIdx -= 1;
                            }
                        } else {
                            // 다음 노드가 있는 경우
                            if ((child.textContent as string).slice(store.cursorData.endOffset) !== "" && (child.textContent as string).slice(0, store.cursorData.startOffset) === "") {
                                // 뒷 문자가 있고 앞 문자가 없는 경우
                                curruntIdx -= 1;
                            }
                        }

                        curruntIdx += 1;
                    } else {
                        // 엘리먼트인 경우

                        if (constructorName === "HTMLBRElement") {
                            // br 태그인 경우 (가장 첫 노드의 첫 커서 인경우)
                            structure += `<br><br>`;
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
            _setCursor($textBlock.childNodes[curruntIdx + 1] as Element, 0);
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
                    structure += (node.textContent as string).slice(0, startOffset);
                    structure += `<br>`;
                } else {
                    if ((node as HTMLElement).tagName === "BR") {
                        structure += `<br>`;
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent as string;

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
                    structure += (node.textContent as string).slice(endOffset);
                } else {
                    if ((node as HTMLElement).tagName === "BR") {
                        structure += `<br>`;
                    } else {
                        const originalClassList = [...(node as Element).classList];
                        const text = node.textContent as string;

                        structure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span><br>`;
                    }
                }
            }
        });

        $textBlock.innerHTML = structure;
        _setCursor($textBlock.childNodes[startNodeIdx + 2] as Element, 0);
    }
}

// 탭 이벤트
function elementTabEvent(e: KeyboardEvent, store: any) {
    const { $element, type } = _getBlockType(e.target as HTMLElement);

    switch (type) {
        case "text":
            defaultTabEvent(e.shiftKey, $element);
            break;
    }
}

// 기본 블럭 백스페이스 이벤트
function defaultBlockBackspaceEvent(e: KeyboardEvent, store: any, $element: Element) {
    const $textBlock = $element as HTMLElement;
    const childList = store.wrap.querySelectorAll(".de-block");
    const childLength: number = childList.length;
    const $target: HTMLElement = _getParentElementIfNodeIsText(store.cursorData.startNode, $textBlock) as HTMLElement;
    let elementIdx: number = -1;

    for (let i = 0; childLength > i; i += 1) {
        if (childList[i] === $element) {
            elementIdx = i;
            break;
        }
    }

    // 블럭의 경우
    if (elementIdx === 0) {
        // 첫번째 블럭인 경우

        if (store.cursorData.startOffset === 0 && $target === $textBlock) {
            // 에디팅 블럭의 첫 커서인 경우

            if ($target.textContent === "") {
                // 내용이 없는 경우 : 상태 초기화를 위한 교체

                $textBlock.insertAdjacentElement("afterend", _createTextBlock());
                _setCursor($textBlock.nextElementSibling as Node, 0);
                $textBlock.remove();
            } else {
                // 내용이 있는 경우

                e.preventDefault();

                if ($textBlock.tagName !== "P") {
                    // 해딩 태그인 경우

                    $textBlock.insertAdjacentElement("afterend", _createTextBlock($textBlock.textContent as string));
                    _setCursor($textBlock.nextElementSibling as Node, 0);
                    $textBlock.remove();
                }
            }
        }
    } else {
        // 첫번째 블럭이 아닌 경우

        if ($textBlock.hasChildNodes() === false) {
            // 내용이 없는 경우

            e.preventDefault();
            const $preBlock = $textBlock.previousElementSibling;

            if ($preBlock !== null) {
                const { type: preBlockType } = _getBlockType($textBlock);

                $textBlock.remove();

                if (preBlockType === "text") {
                    if ($preBlock.hasChildNodes() === true) {
                        const textBlockChildList = $preBlock.childNodes;
                        const textBlockTargetChild = textBlockChildList[textBlockChildList.length - 1];
                        _setCursor(textBlockTargetChild as Element, (textBlockTargetChild.textContent as string).length);
                    } else {
                        _setCursor($preBlock as Element, 0);
                    }
                }
            }
        } else {
            // 내용이 있는 경우

            if (store.cursorData.startOffset === 0 && ($textBlock.childNodes[0] === store.cursorData.startNode || $textBlock.childNodes[0] === $target)) {
                // 커서가 첫번째에 있는 경우

                e.preventDefault();
                const $preBlock = $textBlock.previousElementSibling;

                if ($preBlock !== null) {
                    const { type: preBlockType } = _getBlockType($preBlock as HTMLElement);

                    if (preBlockType === "text") {
                        if ($preBlock.hasChildNodes() === true) {
                            const textBlockChildList = $preBlock.childNodes;
                            const textBlockTargetChildIdx = textBlockChildList.length - 1;
                            const textBlockTargetCursorIdx = ((textBlockChildList[textBlockTargetChildIdx] as ChildNode).textContent as string).length;
                            const thisBlockHTML = $textBlock.innerHTML;

                            $preBlock.innerHTML = $preBlock.innerHTML + thisBlockHTML;

                            _setCursor($preBlock.childNodes[textBlockTargetChildIdx] as Element, textBlockTargetCursorIdx);
                        } else {
                            $preBlock.innerHTML = $textBlock.innerHTML;

                            _setCursor($preBlock as Element, 0);
                        }
                        $textBlock.remove();
                    }
                }
            }
        }
    }

    // 노드의 경우
    if (store.cursorData.startOffset === 1 && $target !== $textBlock) {
        if (($target.textContent as string).length === 1) {
            // 삭제될 노드의 경우
            e.preventDefault();
            const preNode = $target.previousSibling;
            if (preNode !== null) {
                // 이전 노드가 있는 경우
                $target.remove();
                _setCursor(preNode as Element, (preNode.textContent as string).length);
            } else {
                // 이전 노드가 없는 경우
                if ($textBlock.childNodes[1] === undefined) {
                    $textBlock.innerHTML = "";
                    _setCursor($textBlock, 0);
                } else {
                    _setCursor($textBlock.childNodes[1] as Element, 0);
                    $target.remove();
                }
            }
        }
    }

    _setCursorData(store);
}

// 기본 탭 이벤트
function defaultTabEvent(useShiftKey: boolean, $element: Element) {
    const $target = $element as HTMLElement;
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

// 위 아래 화살표 이동 이벤트
function moveToBlockEvent(e: KeyboardEvent, store: any, keyType: "up" | "down") {
    const $editableElement = _findContentEditableElement(store.cursorData.startNode);

    if ($editableElement !== null) {
        const { $element, type } = _getBlockType($editableElement);
        let $target: HTMLElement;

        switch (type) {
            case "list":
                if (keyType === "up") {
                    $target = $editableElement.previousElementSibling as HTMLElement;
                } else {
                    $target = $editableElement.nextElementSibling as HTMLElement;
                }

                if ($target === null) {
                    if (keyType === "up") {
                        $target = $element.previousElementSibling as HTMLElement;
                    } else {
                        $target = $element.nextElementSibling as HTMLElement;
                    }
                }
                break;
            default:
                if (keyType === "up") {
                    $target = $element.previousElementSibling as HTMLElement;
                } else {
                    $target = $element.nextElementSibling as HTMLElement;
                }
        }

        if ($target !== null) {
            if ($target.classList.contains("de-block") == true) {
                // 타겟이 블럭인 경우
                const { $element, type: targetType } = _getBlockType($target);

                switch (targetType) {
                    case "list":
                        const $targetItem = $element.querySelectorAll(".de-item");
                        let $item: Element;

                        if (keyType === "up") {
                            $item = $targetItem[$targetItem.length - 1];
                        } else {
                            $item = $targetItem[0];
                        }

                        _setCursor($item, 0);
                        break;
                    default:
                        _setCursor($element, 0);
                }
            } else {
                // 블럭이 아닌 경우

                _setCursor($target, 0);
            }
        }
    }
}

/**
 * 핫 키 이벤트
 */
export function _hotKeyEvent(event: KeyboardEvent, store: any) {
    _setCursorData(store);
    const isControlKeyActive = event.ctrlKey || event.metaKey;

    if (isControlKeyActive === true) {
        switch (event.key) {
            case "b":
                event.preventDefault();
                _setNodeStyle("de-bold", store);
                break;
            case "i":
                event.preventDefault();
                _setNodeStyle("de-italic", store);
                break;
            case "u":
                event.preventDefault();
                _setNodeStyle("de-underline", store);
                break;
            case "s":
                if (event.shiftKey === true) {
                    event.preventDefault();
                    _setNodeStyle("de-strikethrough", store);
                }
                break;
            case "c":
                if (event.shiftKey === true) {
                    event.preventDefault();
                    _setNodeStyle("de-code", store);
                }
                break;
        }
    }
}

/**
 * 복사 & 붙여넣기 이벤트
 */

export function copyEvent(event: KeyboardEvent, store: any) {}

export function pasteEvent(event: KeyboardEvent, store: any) {}
