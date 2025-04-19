import type { Ref } from "vue";
import { _updateModelData, _updateCursorData, _setCursor, _sortingCursorDataOnElement, _generateId } from "./index";
import { _getCurruntBlock, _createTextBlock, _createHeadingBlock, _createListBlock, _getParentElementIfNodeIsText, _findContentEditableElement, _createListItemBlock, _updateCurruntBlock } from "../node";
import { _getDefaultBlockData } from "../event";

// 키 다운 이벤트
export function _contentKeydownEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    _updateCurruntBlock(event, store);
    _updateCursorData(store);

    switch (event.key) {
        case "Enter":
            if (store.value.eventStatus.preComposing === false) {
                __enterEvent(event, store);
            } else {
                if (store.value.eventStatus.keyboardEnterCount === 1) {
                    __enterEvent(event, store);
                }
            }

            store.value.eventStatus.keyboardEnterCount += 1;

            setTimeout(() => {
                store.value.eventStatus.keyboardEnterCount = 0;
            }, 1);
            break;

        case "Backspace":
            __backspaceEvent(event, store);
            break;

        case "Delete":
            __deleteEvent(event, store);
            break;

        case "Tab":
            __tabEvent(event, store);
            break;

        case " ":
            __spaceEvent(event, store);
            break;

        case "ArrowUp":
            _moveToBlockEvent(event, store, "up");
            break;

        case "ArrowDown":
            _moveToBlockEvent(event, store, "down");
            break;
    }

    _hotKeyEvent(event, store);
    store.value.eventStatus.preComposing = event.isComposing;
}

// 붙여넣기 이벤트
export async function _contentPasteEvent(event: ClipboardEvent, store: Ref<DragonEditorStore>): Promise<void> {
    event.preventDefault();

    const text = await navigator.clipboard.readText();
    const $block = (event.target as HTMLElement).closest(".de-block");

    if ($block !== null) {
        if (text === "") {
            // 이미지인 경우

            const clipboardItems = await navigator.clipboard.read();
            const imageItem = clipboardItems[0].types.find((type) => type.startsWith("image/"));

            if (imageItem !== undefined) {
                const blob = await clipboardItems[0].getType(imageItem);
                const file = new File([blob], `${_generateId()}.${imageItem.split("/")[1]}`);

                store.value.emit("uploadImageEvent", file);
            }
        } else {
            // 텍스트인 경우

            const selection = window.getSelection() as Selection;
            const textNode = document.createTextNode(text);

            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(textNode);

            _setCursor(textNode, textNode.length);
        }
    }
}

// 키보드 엔터 이벤트 (키 다운)
function __enterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (event.shiftKey === true) {
        // 쉬프트 엔터 이벤트

        switch (store.value.controlStatus.curruntblockType) {
            case "image":
                event.preventDefault();
                break;

            case "code":
                __codeBlockShiftEnterEvent(event, store);
                break;

            case "ol":
            case "ul":
                __listBlockShiftEnterEvent(event, store);
                break;

            default:
                __defaultBlockShiftEnterEvent(event, store);
        }
    } else {
        // 일반 엔터 이벤트

        switch (store.value.controlStatus.curruntblockType) {
            case "image":
                event.preventDefault();

                if (store.value.controlStatus.$curruntblock !== null) {
                    const $block = store.value.controlStatus.$curruntblock;
                    const $newTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                    $block.insertAdjacentElement("afterend", $newTextBlock);
                    $newTextBlock.focus();
                }
                break;

            case "code":
                // NOTE : 코드블럭은 별도의 조치 없음
                break;

            case "ol":
            case "ul":
                __listBlockEnterEvent(event, store);
                break;

            default:
                __defaultBlockEnterEvent(event, store);
        }
    }
}

// 기본 엔터 이벤트
function __defaultBlockEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;

        if (store.value.cursorData.type === "Caret") {
            // 단일커서인 경우

            if ($block.textContent === "") {
                // 텍스트가 없는 경우

                if ($block.hasChildNodes() === false) {
                    // 자식 노드가 없는 경우

                    const $newTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                    $block.insertAdjacentElement("afterend", $newTextBlock);
                    $newTextBlock.focus();
                } else {
                    // 자식 노드가 있는 경우 (br로 이루어진 경우)

                    const brList = $block.querySelectorAll("br");

                    if (brList.length === 1) {
                        // 한개일경우 없는것과 동일

                        const $newTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                        $block.insertAdjacentElement("afterend", $newTextBlock);
                        $newTextBlock.focus();
                    } else {
                        const $nextTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);
                        let preStructure: HTMLBRElement[] = [];
                        let nextStructure: HTMLBRElement[] = [];

                        brList.forEach((_, i) => {
                            const $br = document.createElement("br");

                            if (cursorData.startOffset < i) {
                                preStructure.push($br);
                            } else {
                                nextStructure.push($br);
                            }
                        });

                        $block.replaceChildren(...preStructure);
                        $block.insertAdjacentElement("afterend", $nextTextBlock);

                        if (nextStructure.length === 0) {
                            $nextTextBlock.focus();
                        } else {
                            if (nextStructure.length === 1) {
                                nextStructure.push(document.createElement("br"));
                            }

                            $nextTextBlock.replaceChildren(...nextStructure);
                            _setCursor(nextStructure[0], 0);
                        }
                    }
                }
            } else {
                // 자식 노드가 있는 경우

                const childNodeList: ChildNode[] = Array.from($block.childNodes);
                const preStructure: Node[] = [];
                const nextStructure: Node[] = [];
                const $targetNode: Node = _getParentElementIfNodeIsText(store.value.cursorData.startNode, $block);
                let nodeIdx: number = -1;

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
                            const preText = document.createTextNode(text.slice(0, cursorData.startOffset));
                            const nextText = document.createTextNode(text.slice(cursorData.startOffset));

                            preStructure.push(preText);
                            nextStructure.push(nextText);
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = node.textContent as string;
                            const preSpan = document.createElement("span");
                            const nextSpan = document.createElement("span");
                            const nextText = text.slice(cursorData.startOffset);

                            preSpan.classList.add(...originalClassList);
                            preSpan.textContent = text.slice(0, cursorData.startOffset);
                            preStructure.push(preSpan);

                            if (nextText !== "") {
                                nextSpan.classList.add(...originalClassList);
                                nextSpan.textContent = nextText;
                                nextStructure.push(nextSpan);
                            }
                        }
                    }
                });

                const $nextTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                // 텍스트 블럭 삽입
                $block.insertAdjacentElement("afterend", $nextTextBlock);
                $block.replaceChildren(...preStructure);
                $nextTextBlock.replaceChildren(...nextStructure);

                // 커서 위치 지정
                if (nextStructure.length === 0) {
                    $nextTextBlock.focus();
                } else {
                    _setCursor($nextTextBlock.childNodes[0], 0);
                }
            }
        } else {
            // 셀렉트 커서인경우

            const childNodeList = $block.childNodes;
            const srotingCursorData = _sortingCursorDataOnElement(cursorData, $block);
            const preStructure: Node[] = [];
            const nextStructure: Node[] = [];

            if (srotingCursorData.startNodeIdx === srotingCursorData.endNodeIdx) {
                // 같은 노드의 경우

                childNodeList.forEach((node: ChildNode, i: number) => {
                    if (srotingCursorData.startNodeIdx > i) {
                        preStructure.push(node);
                    } else if (srotingCursorData.endNodeIdx < i) {
                        nextStructure.push(node);
                    } else if (srotingCursorData.startNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            const preText = (node.textContent as string).slice(0, srotingCursorData.startOffset);
                            const nextText = (node.textContent as string).slice(srotingCursorData.endOffset);

                            if (preText !== "") {
                                const textNode = document.createTextNode(preText);

                                preStructure.push(textNode);
                            }
                            if (nextText !== "") {
                                const textNode = document.createTextNode(nextText);

                                nextStructure.push(textNode);
                            }
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const preText = (node.textContent as string).slice(0, srotingCursorData.startOffset);
                            const nextText = (node.textContent as string).slice(srotingCursorData.endOffset);

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
                    if (srotingCursorData.startNodeIdx > i) {
                        preStructure.push(node);
                    } else if (srotingCursorData.startNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            const text = (node.textContent as string).slice(0, srotingCursorData.startOffset);

                            if (text !== "") {
                                const textNode = document.createTextNode(text);
                                preStructure.push(textNode);
                            }
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = (node.textContent as string).slice(0, srotingCursorData.startOffset);

                            if (text !== "") {
                                const $span = document.createElement("span");
                                $span.classList.add(...originalClassList);
                                $span.textContent = text;
                                preStructure.push($span);
                            }
                        }
                    }

                    if (srotingCursorData.endNodeIdx < i) {
                        nextStructure.push(node);
                    } else if (srotingCursorData.endNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            const text = (node.textContent as string).slice(srotingCursorData.endOffset);

                            if (text !== "") {
                                const textNode = document.createTextNode(text);
                                nextStructure.push(textNode);
                            }
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = (node.textContent as string).slice(srotingCursorData.endOffset);
                            const $span = document.createElement("span");

                            if (text !== "") {
                                $span.classList.add(...originalClassList);
                                $span.textContent = text;
                                nextStructure.push($span);
                            }
                        }
                    }
                });

                const $nextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                // 텍스트 블럭 삽입
                $block.insertAdjacentElement("afterend", $nextBlock);
                $block.replaceChildren(...preStructure);
                $nextBlock.replaceChildren(...nextStructure);

                // 커서 위치 지정
                if (nextStructure.length === 0) {
                    $nextBlock.focus();
                } else {
                    _setCursor($nextBlock.childNodes[0], 0);
                }
            }
        }
    } else {
        console.error("[Dragon Editor] : Something wrong.");
    }
}

// 기본 쉬프트 엔터 이벤트
function __defaultBlockShiftEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;

        if (cursorData.type === "Caret") {
            // 단일 커서인경우

            if ($block.textContent === "") {
                // 텍스트가 없는 경우

                if ($block.hasChildNodes() === false) {
                    // 자식 노드가 없는 경우

                    $block.insertAdjacentHTML("beforeend", "<br><br>");
                    _setCursor($block.childNodes[1] as Element, 0);
                } else {
                    // br로만 이루어진 경우

                    const $br = document.createElement("br");
                    $block.insertAdjacentElement("beforeend", $br);
                    _setCursor($br, 0);
                }
            } else {
                // 자식 노드가 있고 br로만 이루어지지 않은 경우

                const childList = $block.childNodes;
                let targetIdx = -1;
                let structure: string = "";
                let $target = cursorData.startNode;

                if ($target.constructor.name === "Text") {
                    if ($target.parentNode !== $block) {
                        $target = $target.parentNode as Node;
                    }
                }

                if ($block === $target) {
                    $target = $block.childNodes[cursorData.startOffset];
                }

                for (let i = 0; childList.length > i; i += 1) {
                    if (childList[i] === $target) {
                        targetIdx = i;
                        break;
                    }
                }

                let curruntIdx: number = targetIdx;

                childList.forEach((child, i) => {
                    if (i === targetIdx) {
                        const constructorName = child.constructor.name;

                        if (constructorName === "Text") {
                            // 텍스트 노드인 경우

                            structure += (child.textContent as string).slice(0, cursorData.startOffset) + "<br>" + (child.textContent as string).slice(cursorData.endOffset);

                            if (child.nextSibling === null) {
                                // 다음 노드가 없는 경우

                                if ((child.textContent as string).slice(cursorData.endOffset) === "") {
                                    // 뒷 문자가 없는 경우

                                    structure += `<br>`;
                                }

                                if ((child.textContent as string).slice(0, cursorData.startOffset) === "") {
                                    // 앞 문자가 없는 경우

                                    curruntIdx -= 1;
                                }
                            } else {
                                // 다음 노드가 있는 경우

                                if ((child.textContent as string).slice(cursorData.endOffset) !== "" && (child.textContent as string).slice(0, cursorData.startOffset) === "") {
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

                                structure += `<span class="${Array.from((child as HTMLSpanElement).classList).join(" ")}">${(child.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                structure += `<br>`;
                                structure += `<span class="${Array.from((child as HTMLSpanElement).classList).join(" ")}">${(child.textContent as string).slice(cursorData.startOffset)}</span>`;
                                curruntIdx += 1;
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

                $block.innerHTML = structure;
                _setCursor($block.childNodes[curruntIdx + 1] as Element, 0);
            }
        } else {
            // 셀렉트 커서인경우

            const childNodeList = $block.childNodes;
            const newCursorData = _sortingCursorDataOnElement(cursorData, $block);
            let structure = "";

            childNodeList.forEach((node: ChildNode, i: number) => {
                if (newCursorData.startNodeIdx > i) {
                    if (node.constructor.name === "Text") {
                        structure += node.textContent;
                    } else {
                        structure += (node as Element).outerHTML;
                    }
                } else if (newCursorData.startNodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        structure += (node.textContent as string).slice(0, newCursorData.startOffset);
                        structure += `<br>`;
                    } else {
                        if ((node as HTMLElement).tagName === "BR") {
                            structure += `<br>`;
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = node.textContent as string;

                            structure += `<span class="${originalClassList.join(" ")}">${text.slice(0, newCursorData.startOffset)}</span><br>`;
                        }
                    }
                    if (childNodeList.length === i) {
                        structure += `<br>`;
                    }
                }
                if (newCursorData.endNodeIdx < i) {
                    if (node.constructor.name === "Text") {
                        structure += node.textContent;
                    } else {
                        structure += (node as Element).outerHTML;
                    }
                } else if (newCursorData.endNodeIdx === i) {
                    if (node.constructor.name === "Text") {
                        structure += (node.textContent as string).slice(newCursorData.endOffset);
                    } else {
                        if ((node as HTMLElement).tagName === "BR") {
                            structure += `<br>`;
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = node.textContent as string;

                            structure += `<span class="${originalClassList.join(" ")}">${text.slice(newCursorData.endOffset)}</span><br>`;
                        }
                    }
                }
            });

            $block.innerHTML = structure;
            _setCursor($block.childNodes[newCursorData.startNodeIdx + 2] as Element, 0);
        }
    } else {
        console.error("[Dragon Editor] : Something wrong.");
    }
}

// 리스트 블럭 엔터 이벤트
function __listBlockEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.controlStatus.$curruntblock !== null && store.value.cursorData !== null) {
        const cursorData = store.value.cursorData;
        const $listBlock = store.value.controlStatus.$curruntblock;
        const $editableElement = _findContentEditableElement(event.target as Node) as HTMLLIElement;
        const liList = $listBlock.querySelectorAll(".de-item");

        if ($editableElement !== null) {
            let liIdx = -1;

            for (let i = 0; liList.length > i; i += 1) {
                if (liList[i] === $editableElement) {
                    liIdx = i;
                    break;
                }
            }

            if (cursorData.type === "Caret") {
                // 단일 커서인경우

                if ($editableElement.textContent === "") {
                    // 텍스트가 없는 경우

                    if ($editableElement.hasChildNodes() === false) {
                        // 자식 노드가 없는 경우

                        if (liList.length - 1 === liIdx) {
                            // 마지막 아이템인 경우

                            $changeToTextBlock($listBlock, liList.length, $editableElement);
                        } else {
                            // 마지막 아이템이 아닌 경우

                            const $liBlock = _createListItemBlock();

                            $editableElement.insertAdjacentElement("afterend", $liBlock);
                            $liBlock.focus();
                        }
                    } else {
                        // 자식 노드가 있는 경우 (br로 이루어진 경우)

                        const brList = $editableElement.querySelectorAll("br");

                        if (brList.length === 1) {
                        } else {
                        }
                    }
                } else {
                    // 텍스트가 있는 경우

                    const childNodeList = $editableElement.childNodes;
                    const targetNode = _getParentElementIfNodeIsText(cursorData.startNode, $editableElement);
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
                                const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                                const nextText = (node.textContent as string).slice(cursorData.endOffset);

                                if (preText !== "") {
                                    preStructure.push(document.createTextNode(preText));
                                }

                                if (nextText !== "") {
                                    nextStructure.push(document.createTextNode(nextText));
                                }
                            } else {
                                const originalClassList = Array.from((node as Element).classList);
                                const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                                const nextText = (node.textContent as string).slice(cursorData.endOffset);

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
                const newCursorData = _sortingCursorDataOnElement(cursorData, $editableElement);
                const preStructure: Node[] = [];
                const nextStructure: Node[] = [];

                childNodeList.forEach((node: ChildNode, i: number) => {
                    if (newCursorData.startNodeIdx > i) {
                        preStructure.push(node);
                    } else if (newCursorData.startNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            const text = (node.textContent as string).slice(0, newCursorData.startOffset);

                            if (text !== "") {
                                const $textNode = document.createTextNode(text);
                                preStructure.push($textNode);
                            }
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = (node.textContent as string).slice(0, newCursorData.startOffset);

                            if (text !== "") {
                                const $span = document.createElement("span");
                                $span.classList.add(...originalClassList);
                                $span.textContent = text;
                                preStructure.push($span);
                            }
                        }
                    }

                    if (newCursorData.endNodeIdx < i) {
                        nextStructure.push(node);
                    } else if (newCursorData.endNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            const text = (node.textContent as string).slice(newCursorData.endOffset);

                            if (text !== "") {
                                const $textNode = document.createTextNode(text);
                                nextStructure.push($textNode);
                            }
                        } else {
                            const originalClassList = Array.from((node as Element).classList);
                            const text = (node.textContent as string).slice(newCursorData.endOffset);

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
    }

    function $changeToTextBlock($listBlock: HTMLElement, licount: number, $editableElement: HTMLLIElement): void {
        const $textBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

        $listBlock.insertAdjacentElement("afterend", $textBlock);

        if (licount === 1) {
            $listBlock.remove();
        } else {
            $editableElement.remove();
        }

        $textBlock.focus();
    }
}

// 리스트 쉬프트 엔터 이벤트
function __listBlockShiftEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null) {
        const cursorData = store.value.cursorData;
        const $editableElement = _findContentEditableElement(event.target as Node) as HTMLLIElement;

        if ($editableElement !== null) {
            if (cursorData.type === "Caret") {
                // 단일 커서인경우

                if ($editableElement.textContent === "") {
                    // 텍스트가 없는 경우

                    if ($editableElement.hasChildNodes() === false) {
                        // 자식 노드가 없는 경우

                        $editableElement.insertAdjacentHTML("beforeend", "<br><br>");
                        _setCursor($editableElement.childNodes[1] as Element, 0);
                    } else {
                        // br로만 이루어진 경우

                        const $br = document.createElement("br");
                        $editableElement.insertAdjacentElement("beforeend", $br);
                        _setCursor($br, 0);
                    }
                } else {
                    // 자식 노드가 있고 br로만 이루어지지 않은 경우

                    const childList = $editableElement.childNodes;
                    let targetIdx = -1;
                    let structure: string = "";
                    let $target = cursorData.startNode;

                    if ($target.constructor.name === "Text") {
                        if ($target.parentNode !== $editableElement) {
                            $target = $target.parentNode as Node;
                        }
                    }

                    if ($editableElement === $target) {
                        $target = $editableElement.childNodes[cursorData.startOffset];
                    }

                    for (let i = 0; childList.length > i; i += 1) {
                        if (childList[i] === $target) {
                            targetIdx = i;
                            break;
                        }
                    }

                    let curruntIdx: number = targetIdx;

                    childList.forEach((child, i) => {
                        if (i === targetIdx) {
                            const constructorName = child.constructor.name;

                            if (constructorName === "Text") {
                                // 텍스트 노드인 경우

                                structure += (child.textContent as string).slice(0, cursorData.startOffset) + "<br>" + (child.textContent as string).slice(cursorData.endOffset);

                                if (child.nextSibling === null) {
                                    // 다음 노드가 없는 경우

                                    if ((child.textContent as string).slice(cursorData.endOffset) === "") {
                                        // 뒷 문자가 없는 경우
                                        structure += `<br>`;
                                    }

                                    if ((child.textContent as string).slice(0, cursorData.startOffset) === "") {
                                        // 앞 문자가 없는 경우
                                        curruntIdx -= 1;
                                    }
                                } else {
                                    // 다음 노드가 있는 경우

                                    if ((child.textContent as string).slice(cursorData.endOffset) !== "" && (child.textContent as string).slice(0, cursorData.startOffset) === "") {
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

                                    structure += `<span class="${Array.from((child as HTMLSpanElement).classList).join(" ")}">${(child.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                    structure += `<br>`;
                                    structure += `<span class="${Array.from((child as HTMLSpanElement).classList).join(" ")}">${(child.textContent as string).slice(cursorData.startOffset)}</span>`;
                                    curruntIdx += 1;
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

                    $editableElement.innerHTML = structure;
                    _setCursor($editableElement.childNodes[curruntIdx + 1] as Element, 0);
                }
            } else {
                // 셀렉트 커서인경우

                const childNodeList = $editableElement.childNodes;
                const newCursorData = _sortingCursorDataOnElement(cursorData, $editableElement);
                let structure = "";

                childNodeList.forEach((node: ChildNode, i: number) => {
                    if (newCursorData.startNodeIdx > i) {
                        if (node.constructor.name === "Text") {
                            structure += node.textContent;
                        } else {
                            structure += (node as Element).outerHTML;
                        }
                    } else if (newCursorData.startNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            structure += (node.textContent as string).slice(0, newCursorData.startOffset);
                            structure += `<br>`;
                        } else {
                            if ((node as HTMLElement).tagName === "BR") {
                                structure += `<br>`;
                            } else {
                                const originalClassList = Array.from((node as Element).classList);
                                const text = node.textContent as string;
                                structure += `<span class="${originalClassList.join(" ")}">${text.slice(0, newCursorData.startOffset)}</span><br>`;
                            }
                        }
                        if (childNodeList.length === i) {
                            structure += `<br>`;
                        }
                    }

                    if (newCursorData.endNodeIdx < i) {
                        if (node.constructor.name === "Text") {
                            structure += node.textContent;
                        } else {
                            structure += (node as Element).outerHTML;
                        }
                    } else if (newCursorData.endNodeIdx === i) {
                        if (node.constructor.name === "Text") {
                            structure += (node.textContent as string).slice(newCursorData.endOffset);
                        } else {
                            if ((node as HTMLElement).tagName === "BR") {
                                structure += `<br>`;
                            } else {
                                const originalClassList = Array.from((node as Element).classList);
                                const text = node.textContent as string;
                                structure += `<span class="${originalClassList.join(" ")}">${text.slice(newCursorData.endOffset)}</span><br>`;
                            }
                        }
                    }
                });

                $editableElement.innerHTML = structure;
                _setCursor($editableElement.childNodes[newCursorData.startNodeIdx + 2] as Element, 0);
            }
        }
    } else {
        console.error("[Dragon Editor] : Something wrong.");
    }
}

// 코드블럭 쉬프트 엔터 이벤트
function __codeBlockShiftEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.controlStatus.$curruntblock !== null) {
        const $block = store.value.controlStatus.$curruntblock;
        const $newTextBlock = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

        $block.insertAdjacentElement("afterend", $newTextBlock);
        $newTextBlock.focus();
    }
}

// 키보드 백스페이스 이벤트 (키 다운)
function __backspaceEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    switch (store.value.controlStatus.curruntblockType) {
        case "image":
        case "code":
            // NOTE : 별도 처리 불필요
            break;

        case "ol":
        case "ul":
            ___listBlockBackspaceEvent(event, store);
            break;

        default:
            ___defaultBlockBackspaceEvent(event, store);
    }
}

// 기본 백스페이스 이벤트
function ___defaultBlockBackspaceEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const cursorData = store.value.cursorData;
        const childList = store.value.$body.querySelectorAll(".de-block");
        const $block = store.value.controlStatus.$curruntblock;
        let $target = cursorData.startNode;
        let elementIdx: number = -1;

        for (let i = 0; childList.length > i; i += 1) {
            if (childList[i] === $block) {
                elementIdx = i;
                break;
            }
        }

        if ($target.constructor.name === "Text") {
            $target = $target.parentNode as Node;
        }

        // 블럭의 경우
        if (elementIdx === 0) {
            // 첫번째 블럭인 경우

            if (cursorData.startOffset === 0 && $target === $block) {
                // 에디팅 블럭의 첫 커서인 경우

                if ($target.textContent === "") {
                    // 내용이 없는 경우 : 상태 초기화를 위한 교체

                    $block.insertAdjacentElement("afterend", _createTextBlock(_getDefaultBlockData("text") as DETextBlock));
                    _setCursor($block.nextElementSibling as Node, 0);
                    $block.remove();
                } else {
                    // 내용이 있는 경우
                    event.preventDefault();

                    if (store.value.controlStatus.curruntblockType !== "text") {
                        const $newBlock = _createTextBlock({ type: "text", classList: [], textContent: $block.textContent ?? "" });

                        $block.insertAdjacentElement("afterend", $newBlock);
                        _setCursor($newBlock, 0);
                        $block.remove();
                    }
                }
            }
        } else {
            // 첫번째 블럭이 아닌 경우

            if ($block.textContent === "") {
                // 내용이 없는 경우

                event.preventDefault();

                let hasChild: boolean = false;
                let childHTML: string = "";

                if ($block.hasChildNodes() === true) {
                    // br 만 있는 경우

                    const $brList = $block.querySelectorAll("br");

                    if ($brList.length > 1) {
                        hasChild = true;
                        childHTML = $block.innerHTML;
                    }
                }

                ____backspackeLogic(hasChild, childHTML, $block, $block);
            } else {
                // 내용이 있는 경우

                if (cursorData.type === "Caret" && cursorData.startOffset === 0 && ($block.childNodes[0] === cursorData.startNode || $block.childNodes[0] === $target)) {
                    // 커서가 첫번째에 있는 경우

                    event.preventDefault();

                    let childHTML: string = $block.innerHTML;

                    ____backspackeLogic(true, childHTML, $block, $block);
                }
            }
        }

        // 노드의 경우
        ____nodeBackspaceEvent(event, cursorData, $block, $target);
        _updateCursorData(store);
    }
}

// 리스트 블럭 백스페이스 이벤트
function ___listBlockBackspaceEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const cursorData = store.value.cursorData;
        const $listBlock = store.value.controlStatus.$curruntblock;
        const $targetItem = _findContentEditableElement(cursorData.startNode as HTMLElement) as HTMLLIElement;
        const $liList = $listBlock.querySelectorAll(".de-item");
        let $target = cursorData.startNode;
        let liIdx: number = -1;

        if ($target.constructor.name === "Text") {
            $target = $target.parentNode as Node;
        }

        for (let i = 0; $liList.length > i; i += 1) {
            if ($liList[i] === $targetItem) {
                liIdx = i;
                break;
            }
        }

        // 블럭의 경우
        if ($liList.length === 1) {
            // 자식이 하나인 경우

            if ($targetItem.textContent === "") {
                // 텍스트가 없는 경우

                event.preventDefault();

                let hasChild: boolean = false;
                let childHTML: string = "";

                if ($targetItem.hasChildNodes() === true) {
                    // br 만 있는 경우

                    const $brList = $targetItem.querySelectorAll("br");

                    if ($brList.length > 1) {
                        hasChild = true;
                        childHTML = $targetItem.innerHTML;
                    }
                }

                ____backspackeLogic(hasChild, childHTML, $listBlock, $targetItem);
                $listBlock.remove();
            } else {
                // 텍스트가 있는 경우

                if (cursorData.type === "Caret" && cursorData.startOffset === 0 && ($targetItem.childNodes[0] === cursorData.startNode || $targetItem.childNodes[0] === $target)) {
                    // 커서가 첫번째에 있는 경우
                    event.preventDefault();

                    let childHTML: string = $targetItem.innerHTML;

                    ____backspackeLogic(true, childHTML, $listBlock, $targetItem);
                    $listBlock.remove();
                }
            }
        } else {
            // 자식이 여러개인 경우

            if (liIdx === 0) {
                // 첫번째 자식인 경우

                if ($targetItem.textContent === "") {
                    // 텍스트가 없는 경우

                    event.preventDefault();

                    let hasChild: boolean = false;
                    let childHTML: string = "";

                    if ($targetItem.hasChildNodes() === true) {
                        // br 만 있는 경우

                        const $brList = $targetItem.querySelectorAll("br");

                        if ($brList.length > 1) {
                            hasChild = true;
                            childHTML = $targetItem.innerHTML;
                        }
                    }

                    ____backspackeLogic(hasChild, childHTML, $listBlock, $targetItem);
                } else {
                    // 텍스트가 있는 경우

                    if (cursorData.type === "Caret" && cursorData.startOffset === 0 && ($targetItem.childNodes[0] === cursorData.startNode || $targetItem.childNodes[0] === $target)) {
                        // 커서가 첫번째에 있는 경우

                        event.preventDefault();

                        let childHTML: string = $targetItem.innerHTML;

                        ____backspackeLogic(true, childHTML, $listBlock, $targetItem);
                    }
                }
            } else {
                // 첫번째 자식이 아닌 경우

                if ($targetItem.textContent === "") {
                    // 텍스트가 없는 경우

                    event.preventDefault();

                    const $preLi = $targetItem.previousElementSibling as HTMLElement;
                    const hasChild: boolean = $preLi.hasChildNodes();
                    let childHTML: string = "";

                    if ($targetItem.hasChildNodes() === true) {
                        // br 만 있는 경우

                        const $brList = $targetItem.querySelectorAll("br");

                        if ($brList.length > 1) {
                            childHTML = $targetItem.innerHTML;
                        }
                    }

                    if ($preLi.hasChildNodes() === true) {
                        const textBlockChildList = $preLi.childNodes;
                        const textBlockTargetChild = textBlockChildList[textBlockChildList.length - 1];

                        if (hasChild === true) {
                            $preLi.insertAdjacentHTML("beforeend", childHTML);
                        }

                        _setCursor(textBlockTargetChild as Element, (textBlockTargetChild.textContent as string).length);
                    } else {
                        if (hasChild === true) {
                            $preLi.insertAdjacentHTML("beforeend", childHTML);
                        }

                        _setCursor($preLi as Element, 0);
                    }

                    $targetItem.remove();
                } else {
                    // 텍스트가 있는 경우

                    if (cursorData.type === "Caret" && cursorData.startOffset === 0 && ($targetItem.childNodes[0] === cursorData.startNode || $targetItem.childNodes[0] === $target)) {
                        // 커서가 첫번째에 있는 경우

                        event.preventDefault();

                        const $preLi = $targetItem.previousElementSibling as HTMLElement;
                        const hasChild: boolean = $preLi.hasChildNodes();
                        let childHTML: string = $targetItem.innerHTML;

                        if ($preLi.hasChildNodes() === true) {
                            const textBlockChildList = $preLi.childNodes;
                            const textBlockTargetChild = textBlockChildList[textBlockChildList.length - 1];

                            if (hasChild === true) {
                                $preLi.insertAdjacentHTML("beforeend", childHTML);
                            }

                            _setCursor(textBlockTargetChild as Element, (textBlockTargetChild.textContent as string).length);
                        } else {
                            if (hasChild === true) {
                                $preLi.insertAdjacentHTML("beforeend", childHTML);
                            }

                            _setCursor($preLi as Element, 0);
                        }

                        $targetItem.remove();
                    }
                }
            }
        }

        // 노드의 경우
        // ____nodeBackspaceEvent(event, cursorData, $listBlock, $target);
    }
}

// 기본 백스페이스 처리 로직
function ____backspackeLogic(hasChild: boolean, childHTML: string, $block: HTMLElement, $targetItem: HTMLElement): void {
    const $preBlock = $block.previousElementSibling as HTMLElement;

    if ($preBlock !== null) {
        const { type: preBlockType } = _getCurruntBlock($preBlock);
        let preDelete: boolean = false;
        let $targetBlock: HTMLElement = $preBlock;

        switch (preBlockType) {
            case "custom":
            case "image":
            case "code":
                preDelete = true;
                break;

            case "ul":
            case "ol":
                const $liList = $preBlock.querySelectorAll(".de-item");

                $targetBlock = $liList[$liList.length - 1] as HTMLElement;
                break;

            default:
                $targetBlock = $preBlock;
        }

        if (preDelete === false) {
            if ($targetBlock.hasChildNodes() === true) {
                const textBlockChildList = $targetBlock.childNodes;
                const textBlockTargetChild = textBlockChildList[textBlockChildList.length - 1];

                if (hasChild === true) {
                    $targetBlock.insertAdjacentHTML("beforeend", childHTML);
                }

                _setCursor(textBlockTargetChild as Element, (textBlockTargetChild.textContent as string).length);
            } else {
                if (hasChild === true) {
                    $targetBlock.insertAdjacentHTML("beforeend", childHTML);
                }

                _setCursor($targetBlock as Element, 0);
            }

            $targetItem.remove();
        } else {
            // 이동 안하고 이전 블럭 삭제

            $preBlock.remove();
        }
    } else {
        const newTextBlockData = _getDefaultBlockData("text") as DETextBlock;

        newTextBlockData.textContent = childHTML;

        const $newTextBlock = _createTextBlock(newTextBlockData);

        $block.insertAdjacentElement("afterend", $newTextBlock);
        $newTextBlock.focus();
        $block.remove();
    }
}

// 노드 백스페이스 처리용 이벤트
function ____nodeBackspaceEvent(event: KeyboardEvent, cursorData: DEditorCursor, $block: HTMLElement, $target: Node): void {
    if (cursorData.startOffset === 1 && $target !== $block) {
        if (($target.textContent as string).length === 1) {
            // 삭제될 노드의 경우

            event.preventDefault();
            const preNode = $target.previousSibling;

            if (preNode !== null) {
                // 이전 노드가 있는 경우

                ($target as HTMLElement).remove();
                _setCursor(preNode as Element, (preNode.textContent as string).length);
            } else {
                // 이전 노드가 없는 경우

                if ($block.childNodes[1] === undefined) {
                    $block.innerHTML = "";
                    _setCursor($block, 0);
                } else {
                    _setCursor($block.childNodes[1] as Element, 0);
                    ($target as HTMLElement).remove();
                }
            }
        }
    }
}

// 탭 이벤트 (키 다운)
function __tabEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$curruntblock !== null) {
        event.preventDefault();

        const $block = store.value.controlStatus.$curruntblock;

        switch (store.value.controlStatus.curruntblockType) {
            case "code":
            case "custom":
            case "image":
                // NOTE : 뎁스처리 안함
                break;

            default:
                let value: number = $block.dataset["depth"] === undefined ? 0 : parseInt($block.dataset["depth"]);

                if (event.shiftKey === true) {
                    if (value !== 0) {
                        value -= 1;
                    }
                } else {
                    if (value < 5) {
                        value += 1;
                    }
                }

                if (value === 0) {
                    delete $block.dataset["depth"];
                } else {
                    $block.dataset["depth"] = String(value);
                }
        }
    }
}

// 딜리트 이벤트 (키 다운)
function __deleteEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    switch (store.value.controlStatus.curruntblockType) {
        case "image":
        case "code":
            // NOTE : 별도 처리 불필요
            break;

        case "ol":
        case "ul":
            ___listBlockDeleteEvent(event, store);
            break;

        default:
            ___defaultBlockDeleteEvent(event, store);
    }
}

// 기본 딜리트 이벤트
function ___defaultBlockDeleteEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;
        let $target = cursorData.startNode;

        if ($target.constructor.name === "Text") {
            $target = $target.parentNode as Node;
        }

        if ($block.textContent === "") {
            // 내용이 없는 경우

            event.preventDefault();
            let hasChild: boolean = false;

            if ($block.hasChildNodes() === true) {
                // br 만 있는 경우

                const $brList = $block.querySelectorAll("br");

                if ($brList.length === 1) {
                    // br이 한개만 있는 경우 없는것과 동일 처리

                    $block.innerHTML = "";
                } else {
                    hasChild = true;
                }
            }

            ____deleteLogic($block, $block);
        } else {
            // 내용이 있는 경우
            const lastChild = $block.childNodes[$block.childNodes.length - 1] as Node;

            if (cursorData.type === "Caret" && lastChild !== undefined && lastChild.textContent && cursorData.startOffset === lastChild.textContent.length && (lastChild === cursorData.startNode || lastChild === $target)) {
                event.preventDefault();
                ____deleteLogic($block, $block);
            }
        }

        // TODO : 노드의 경우 제작
        //     // 노드의 경우
        //     ____nodeBackspaceEvent(event, cursorData, $block, $target);
        //     _updateCursorData(store);
    }
}

// 리스트 블럭 딜리트 이벤트
function ___listBlockDeleteEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const cursorData = store.value.cursorData;
        const $listBlock = store.value.controlStatus.$curruntblock;
        const $targetItem = _findContentEditableElement(cursorData.startNode as HTMLElement) as HTMLLIElement;
        const $liList = $listBlock.querySelectorAll(".de-item");
        let $target = cursorData.startNode;
        let liIdx: number = -1;

        if ($target.constructor.name === "Text") {
            $target = $target.parentNode as Node;
        }

        for (let i = 0; $liList.length > i; i += 1) {
            if ($liList[i] === $targetItem) {
                liIdx = i;
                break;
            }
        }

        // 블럭의 경우
        if ($liList.length === 1) {
            // 자식이 하나인 경우

            if ($targetItem.textContent === "") {
                // 텍스트가 없는 경우

                event.preventDefault();
                ____deleteLogic($targetItem, $listBlock);
            } else {
                // 텍스트가 있는 경우

                const lastChild = $targetItem.childNodes[$targetItem.childNodes.length - 1] as Node;

                if (cursorData.type === "Caret" && lastChild !== undefined && lastChild.textContent && cursorData.startOffset === lastChild.textContent.length && (lastChild === cursorData.startNode || lastChild === $target)) {
                    event.preventDefault();
                    ____deleteLogic($targetItem, $listBlock);
                }
            }
        } else {
            // 자식이 여러개인 경우

            const $nextLi = $targetItem.nextElementSibling;

            if ($nextLi === null) {
                // 다음 리스트가 없는 경우

                if ($targetItem.textContent === "") {
                    event.preventDefault();
                    ____deleteLogic($targetItem, $listBlock);
                } else {
                    const lastChild = $targetItem.childNodes[$targetItem.childNodes.length - 1] as Node;

                    if (cursorData.type === "Caret" && lastChild !== undefined && lastChild.textContent && cursorData.startOffset === lastChild.textContent.length && (lastChild === cursorData.startNode || lastChild === $target)) {
                        event.preventDefault();
                        ____deleteLogic($targetItem, $listBlock);
                    }
                }
            } else {
                // 다음 리스트가 있는 경우

                if ($targetItem.textContent === "") {
                    event.preventDefault();
                    ____deleteLogic($targetItem, $targetItem);
                } else {
                    const lastChild = $targetItem.childNodes[$targetItem.childNodes.length - 1] as Node;

                    if (cursorData.type === "Caret" && lastChild !== undefined && lastChild.textContent && cursorData.startOffset === lastChild.textContent.length && (lastChild === cursorData.startNode || lastChild === $target)) {
                        event.preventDefault();
                        ____deleteLogic($targetItem, $targetItem);
                    }
                }
            }
        }

        // TODO : 노드의 경우 제작
    }
}

// 딜리트 기본 로직
function ____deleteLogic($targetElement: HTMLElement, $block: HTMLElement) {
    let $nextBlock = $block.nextElementSibling as HTMLElement;

    if ($nextBlock !== null) {
        const { type: nextBlockType } = _getCurruntBlock($nextBlock);
        let nextDelete: boolean = false;

        switch (nextBlockType) {
            case "custom":
            case "image":
            case "code":
                nextDelete = true;
                break;

            case "ul":
            case "ol":
                if ($block.tagName !== "LI") {
                    // 리스트 자식이 아닌경우만
                    const $liList = $nextBlock.querySelectorAll(".de-item");

                    $nextBlock = $liList[0] as HTMLElement;
                }
                break;
        }

        if (nextDelete === false) {
            if ($nextBlock.hasChildNodes() === true) {
                const childHTML = $nextBlock.innerHTML;

                if ($targetElement.hasChildNodes() === true) {
                    $targetElement.insertAdjacentHTML("beforeend", childHTML);
                } else {
                    $targetElement.innerHTML = childHTML;
                }
            }

            $nextBlock.remove();
        } else {
            // 이동 안하고 다음 블럭 삭제

            $nextBlock.remove();
        }
    }
}

// 스페이스 이벤트 (키 다운)
function __spaceEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;
        const $targetItem = _findContentEditableElement(cursorData.startNode as HTMLElement) as HTMLLIElement;

        if ($targetItem !== null && $targetItem.textContent !== "") {
            switch ($targetItem.textContent) {
                case "#":
                    event.preventDefault();

                    const $newHeading1Block = _createHeadingBlock(_getDefaultBlockData("heading1") as DEHeadingBlock);

                    $block.insertAdjacentElement("afterend", $newHeading1Block);
                    $newHeading1Block.focus();
                    $block.remove();
                    break;

                case "##":
                    event.preventDefault();

                    const $newHeading2Block = _createHeadingBlock(_getDefaultBlockData("heading2") as DEHeadingBlock);

                    $block.insertAdjacentElement("afterend", $newHeading2Block);
                    $newHeading2Block.focus();
                    $block.remove();
                    break;

                case "###":
                    event.preventDefault();

                    const $newHeading3Block = _createHeadingBlock(_getDefaultBlockData("heading3") as DEHeadingBlock);

                    $block.insertAdjacentElement("afterend", $newHeading3Block);
                    $newHeading3Block.focus();
                    $block.remove();
                    break;

                case "-":
                    event.preventDefault();

                    const $newUlBlock = _createListBlock(_getDefaultBlockData("ul") as DEListBlock);

                    $block.insertAdjacentElement("afterend", $newUlBlock);
                    ($newUlBlock.children[0] as HTMLLIElement).focus();
                    $block.remove();
                    break;

                case "1.":
                    event.preventDefault();

                    const $newOlBlock = _createListBlock(_getDefaultBlockData("ol") as DEListBlock);

                    $block.insertAdjacentElement("afterend", $newOlBlock);
                    ($newOlBlock.children[0] as HTMLLIElement).focus();
                    $block.remove();
                    break;
            }
        }
    }
}

// 위 아래 화살표 이동 이벤트
function _moveToBlockEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>, keyType: "up" | "down"): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$curruntblock !== null) {
        const cursorData = store.value.cursorData;
        const $editableElement = _findContentEditableElement(cursorData.startNode);
        const $block = store.value.controlStatus.$curruntblock;

        if ($editableElement !== null && $block !== null) {
            let $targetElement: Element | null = null;

            switch (store.value.controlStatus.curruntblockType) {
                case "code":
                    // NOTE : 코드블럭은 없음
                    break;

                case "ol":
                case "ul":
                    if (keyType === "up") {
                        $targetElement = $editableElement.previousElementSibling;

                        if ($targetElement === null) {
                            $targetElement = $block.previousElementSibling;
                        }
                    } else {
                        $targetElement = $editableElement.nextElementSibling;

                        if ($targetElement === null) {
                            $targetElement = $block.nextElementSibling;
                        }
                    }
                    break;

                default:
                    if (keyType === "up") {
                        $targetElement = $block.previousElementSibling;
                    } else {
                        $targetElement = $block.nextElementSibling;
                    }
            }

            if ($targetElement !== null) {
                const { type, $element } = _getCurruntBlock($targetElement);

                switch (type) {
                    case "image":
                        if ($element !== null) {
                            const $caption = $element.querySelector(".de-caption");

                            if ($caption !== null) {
                                $targetElement = $caption;
                            }
                        }
                        break;

                    case "ol":
                    case "ul":
                        if ($targetElement.tagName !== "LI" && $element !== null) {
                            const $childList = $element.querySelectorAll(".de-item");

                            if (keyType === "up") {
                                $targetElement = $childList[$childList.length - 1];
                            } else {
                                $targetElement = $childList[0];
                            }
                        }

                        break;
                }

                _setCursor($targetElement, 0);
            }
        }
    }
}

// 핫 키 이벤트
export function _hotKeyEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    // _setCursorData(store);
    const isControlKeyActive = event.ctrlKey || event.metaKey;

    if (isControlKeyActive === true) {
        switch (event.key) {
            case "b":
                event.preventDefault();
                //             _setNodeStyle("de-bold", store);
                break;

            case "i":
                event.preventDefault();
                //             _setNodeStyle("de-italic", store);
                break;

            case "u":
                event.preventDefault();
                //             _setNodeStyle("de-underline", store);
                break;

            case "s":
                if (event.shiftKey === true) {
                    event.preventDefault();
                    //                 _setNodeStyle("de-strikethrough", store);
                }
                break;

            case "c":
                if (event.shiftKey === true) {
                    event.preventDefault();
                    //                 _setNodeStyle("de-code", store);
                }
                break;
        }
    }
}

// 키 업 이벤트
let contentKeyupEvent: NodeJS.Timeout;
export function _contentKeyupEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    _updateCursorData(store);
    __checkBlock(store);

    clearTimeout(contentKeyupEvent);
    contentKeyupEvent = setTimeout(() => {
        _updateModelData(store);
    }, 250);
}

// 내용 정리용 이벤트 (키 업)
function __checkBlock(store: Ref<DragonEditorStore>) {
    if (store.value.$body !== null) {
        const blockList = store.value.$body.querySelectorAll(".de-block");

        blockList.forEach(($block) => {
            const { type } = _getCurruntBlock($block);

            switch (type) {
                case "ol":
                case "ul":
                    if ($block.hasChildNodes() === false) {
                        $block.remove();
                    }
                    break;

                case "text":
                case "heading":
                    if ($block.textContent === "" && $block.hasChildNodes() === true) {
                        const textNodeType = $block.childNodes[0].constructor.name;

                        if (textNodeType === "HTMLBRElement") {
                            $block.innerHTML = "";
                        }
                    }
                    break;
            }
        });
    }
}
