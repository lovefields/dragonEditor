import type { Ref } from "vue";
import { _updateModelData, _updateCursorData, _setCursor, _sortingCursorDataOnElement } from "./index";
import { _getCurruntBlock, _createTextBlock, _getParentElementIfNodeIsText } from "../node";
import { _getDefaultBlockData } from "../layout";

// 키 다운 이벤트
export function _contentKeydownEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (event.target !== null) {
        const { type, $element } = _getCurruntBlock(event.target);
        store.value.controlStatus.curruntblockType = type;
        store.value.controlStatus.$curruntblock = $element;
    }

    _updateCursorData(store);

    switch (event.key) {
        case "Enter":
            __enterEvent(event, store);
            break;
    }

    store.value.eventStatus.preComposing = event.isComposing;
}

// 붙여넣기 이벤트
export function _contentPasteEvent(event: ClipboardEvent, store: Ref<DragonEditorStore>): void {
    console.log("paste");
}

// 키보드 엔터 이벤트 (키 다운)
function __enterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    if (store.value.eventStatus.preComposing === false) {
        if (event.shiftKey === true) {
            // 쉬프트 엔터 이벤트

            switch (store.value.controlStatus.curruntblockType) {
                default:
                    __defaultBlockShiftEnterEvent(event, store);
            }
        } else {
            // 일반 엔터 이벤트

            switch (store.value.controlStatus.curruntblockType) {
                case "ol":
                case "ul":
                    __listBlockEnterEvent(event, store);
                    break;

                default:
                    __defaultBlockEnterEvent(event, store);
            }
        }
    }
}

// 기본 엔터 이벤트
function __defaultBlockEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;

        if ($block !== null) {
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
    } else {
        console.error("[Dragon Editor] : Something wrong.");
    }
}

// 기본 쉬프트 엔터 이벤트
function __defaultBlockShiftEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null) {
        const cursorData = store.value.cursorData;
        const $block = store.value.controlStatus.$curruntblock;

        if ($block !== null) {
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

                        let $target = cursorData.startNode;
                        let childIdx = -1;

                        if ($block === $target) {
                            $target = $block.childNodes[cursorData.startOffset];
                        }

                        for (let i = 0; $block.childNodes.length > i; i += 1) {
                            if ($block.childNodes[i] === $target) {
                                childIdx = i;
                                break;
                            }
                        }

                        ($target as HTMLElement).insertAdjacentHTML("afterend", "<br>");
                        _setCursor($block.childNodes[childIdx + 1] as Element, 0);
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
                let startTargetNode = cursorData.startNode;
                let startNodeIdx: number = -1;
                let startOffset: number = cursorData.startOffset;
                let endTargetNode = cursorData.endNode;
                let endNodeIdx: number = -1;
                let endOffset: number = cursorData.endOffset;
                let structure = "";

                if (startTargetNode.constructor.name === "Text") {
                    if (startTargetNode.parentElement !== $block) {
                        startTargetNode = startTargetNode.parentElement as Node;
                    }
                }

                if (endTargetNode.constructor.name === "Text") {
                    if (endTargetNode.parentElement !== $block) {
                        endTargetNode = endTargetNode.parentElement as Node;
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
                                const originalClassList = Array.from((node as Element).classList);
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
                                const originalClassList = Array.from((node as Element).classList);
                                const text = node.textContent as string;

                                structure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span><br>`;
                            }
                        }
                    }
                });

                $block.innerHTML = structure;
                _setCursor($block.childNodes[startNodeIdx + 2] as Element, 0);
            }
        } else {
            console.error("[Dragon Editor] : Something wrong.");
        }
    } else {
        console.error("[Dragon Editor] : Something wrong.");
    }
}

// 리스트 블럭 엔터 이벤트
function __listBlockEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>) {
    // const $listBlock = $element as HTMLElement;
    // const $editableElement = _findContentEditableElement(event.target as Node) as HTMLLIElement;
    // const liList = $listBlock.querySelectorAll(".de-item");
    // let liIdx = -1;
    // for (let i = 0; liList.length > i; i += 1) {
    //     if (liList[i] === $editableElement) {
    //         liIdx = i;
    //         break;
    //     }
    // }
    // if (store.cursorData.type === "Caret") {
    //     // 단일 커서인경우
    //     if ($editableElement.textContent === "") {
    //         // 텍스트가 없는 경우
    //         if (liList.length - 1 === liIdx) {
    //             // 마지막 아이템인 경우
    //             const $textBlock = _createTextBlock();
    //             $listBlock.insertAdjacentElement("afterend", $textBlock);
    //             if (liList.length === 1) {
    //                 $listBlock.remove();
    //             } else {
    //                 $editableElement.remove();
    //             }
    //             $textBlock.focus();
    //         } else {
    //             // 마지막 아이템이 아닌 경우
    //             const $liBlock = _createListItemBlock();
    //             $editableElement.insertAdjacentElement("afterend", $liBlock);
    //             $liBlock.focus();
    //         }
    //     } else {
    //         // 텍스트가 있는 경우
    //         const childNodeList = $editableElement.childNodes;
    //         const targetNode = _getParentElementIfNodeIsText(store.cursorData.startNode, $editableElement);
    //         const preStructure: Node[] = [];
    //         const nextStructure: Node[] = [];
    //         let nodeIdx = -1;
    //         // 노드 위치 파악
    //         for (let i = 0; childNodeList.length > i; i += 1) {
    //             if (childNodeList[i] === targetNode) {
    //                 nodeIdx = i;
    //                 break;
    //             }
    //         }
    //         // 구조 정리
    //         childNodeList.forEach((node: ChildNode, i: number) => {
    //             if (nodeIdx < i) {
    //                 nextStructure.push(node);
    //             } else if (nodeIdx > i) {
    //                 preStructure.push(node);
    //             } else if (nodeIdx === i) {
    //                 if (node.constructor.name === "Text") {
    //                     const preText = (node.textContent as string).slice(0, store.cursorData.startOffset);
    //                     const nextText = (node.textContent as string).slice(store.cursorData.endOffset);
    //                     if (preText !== "") {
    //                         preStructure.push(document.createTextNode(preText));
    //                     }
    //                     if (nextText !== "") {
    //                         nextStructure.push(document.createTextNode(nextText));
    //                     }
    //                 } else {
    //                     const originalClassList = [...(node as Element).classList];
    //                     const preText = (node.textContent as string).slice(0, store.cursorData.startOffset);
    //                     const nextText = (node.textContent as string).slice(store.cursorData.endOffset);
    //                     if (preText !== "") {
    //                         const $span = document.createElement("span");
    //                         $span.textContent = preText;
    //                         $span.classList.add(...originalClassList);
    //                         preStructure.push($span);
    //                     }
    //                     if (nextText !== "") {
    //                         const $span = document.createElement("span");
    //                         $span.textContent = nextText;
    //                         $span.classList.add(...originalClassList);
    //                         nextStructure.push($span);
    //                     }
    //                 }
    //             }
    //         });
    //         const $liBlock = _createListItemBlock();
    //         // 리스트 블럭 삽입
    //         $editableElement.insertAdjacentElement("afterend", $liBlock);
    //         $editableElement.replaceChildren(...preStructure);
    //         $liBlock.replaceChildren(...nextStructure);
    //         // 커서 위치 지정
    //         if (nextStructure.length === 0) {
    //             $liBlock.focus();
    //         } else {
    //             _setCursor($liBlock.childNodes[0], 0);
    //         }
    //     }
    // } else {
    //     // 셀렉트 커서인 경우
    //     const childNodeList = $editableElement.childNodes;
    //     const cursorData = _soltingCursorDataOnElement(store.cursorData, $editableElement);
    //     const preStructure: Node[] = [];
    //     const nextStructure: Node[] = [];
    //     childNodeList.forEach((node: ChildNode, i: number) => {
    //         if (cursorData.startNodeIdx > i) {
    //             preStructure.push(node);
    //         } else if (cursorData.startNodeIdx === i) {
    //             if (node.constructor.name === "Text") {
    //                 const text = (node.textContent as string).slice(0, cursorData.startOffset);
    //                 if (text !== "") {
    //                     const $textNode = document.createTextNode(text);
    //                     preStructure.push($textNode);
    //                 }
    //             } else {
    //                 const originalClassList = [...(node as Element).classList];
    //                 const text = (node.textContent as string).slice(0, cursorData.startOffset);
    //                 if (text !== "") {
    //                     const $span = document.createElement("span");
    //                     $span.classList.add(...originalClassList);
    //                     $span.textContent = text;
    //                     preStructure.push($span);
    //                 }
    //             }
    //         }
    //         if (cursorData.endNodeIdx < i) {
    //             nextStructure.push(node);
    //         } else if (cursorData.endNodeIdx === i) {
    //             if (node.constructor.name === "Text") {
    //                 const text = (node.textContent as string).slice(cursorData.endOffset);
    //                 if (text !== "") {
    //                     const $textNode = document.createTextNode(text);
    //                     nextStructure.push($textNode);
    //                 }
    //             } else {
    //                 const originalClassList = [...(node as Element).classList];
    //                 const text = (node.textContent as string).slice(cursorData.endOffset);
    //                 if (text !== "") {
    //                     const $span = document.createElement("span");
    //                     $span.classList.add(...originalClassList);
    //                     $span.textContent = text;
    //                     nextStructure.push($span);
    //                 }
    //             }
    //         }
    //     });
    //     const $liBlock = _createListItemBlock();
    //     // 리스트 블럭 삽입
    //     $editableElement.insertAdjacentElement("afterend", $liBlock);
    //     $editableElement.replaceChildren(...preStructure);
    //     // 커서 위치 지정
    //     if (nextStructure.length === 0) {
    //         $liBlock.focus();
    //     } else {
    //         $liBlock.replaceChildren(...nextStructure);
    //         _setCursor(nextStructure[0], 0);
    //     }
    // }
}

// 키 업 이벤트
let contentKeyupEvent: NodeJS.Timeout;
export function _contentKeyupEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    clearTimeout(contentKeyupEvent);
    contentKeyupEvent = setTimeout(() => {
        _updateModelData(store);
    }, 250);
}
