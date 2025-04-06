import type { Ref } from "vue";
import { _updateModelData, _updateCursorData, _setCursor } from "./index";
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
    if (event.shiftKey === true) {
        // 쉬프트 엔터 이벤트

        switch (store.value.controlStatus.curruntblockType) {
            default:
                __defaultBlockShiftEnterEvent(event, store);
        }
    } else {
        // 일반 엔터 이벤트

        switch (store.value.controlStatus.curruntblockType) {
            default:
                __defaultBlockEnterEvent(event, store);
        }
    }
}

function __defaultBlockEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null) {
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

                                // @ts-ignore : 에디터 인식 못함, 정상임
                                if (store.value.cursorData.startOffset < i) {
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

                    // @ts-ignore : 에디터 인식 못함, 정상임
                    const childNodeList: ChildNode[] = [...$block.childNodes];
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
                                // @ts-ignore : 에디터 인식 못함, 정상임
                                const preText = document.createTextNode(text.slice(0, store.value.cursorData.startOffset));
                                // @ts-ignore : 에디터 인식 못함, 정상임
                                const nextText = document.createTextNode(text.slice(store.value.cursorData.startOffset));

                                preStructure.push(preText);
                                nextStructure.push(nextText);
                            } else {
                                // @ts-ignore : 에디터 인식 못함, 정상임
                                const originalClassList = [...(node as Element).classList];
                                const text = node.textContent as string;
                                const preSpan = document.createElement("span");
                                const nextSpan = document.createElement("span");
                                // @ts-ignore : 에디터 인식 못함, 정상임
                                const nextText = text.slice(store.value.cursorData.startOffset);

                                preSpan.classList.add(...originalClassList);
                                // @ts-ignore : 에디터 인식 못함, 정상임
                                preSpan.textContent = text.slice(0, store.value.cursorData.startOffset);
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

                //     const childNodeList = $textBlock.childNodes;
                //     const cursorData = _soltingCursorDataOnElement(store.cursorData, $textBlock);
                //     const preStructure: Node[] = [];
                //     const nextStructure: Node[] = [];
                
                //     if (cursorData.startNodeIdx === cursorData.endNodeIdx) {
                //         // 같은 노드의 경우
                //         childNodeList.forEach((node: ChildNode, i: number) => {
                //             if (cursorData.startNodeIdx > i) {
                //                 preStructure.push(node);
                //             } else if (cursorData.endNodeIdx < i) {
                //                 nextStructure.push(node);
                //             } else if (cursorData.startNodeIdx === i) {
                //                 if (node.constructor.name === "Text") {
                //                     const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                //                     const nextText = (node.textContent as string).slice(cursorData.endOffset);
                //                     if (preText !== "") {
                //                         const textNode = document.createTextNode(preText);
                //                         preStructure.push(textNode);
                //                     }
                //                     if (nextText !== "") {
                //                         const textNode = document.createTextNode(nextText);
                //                         nextStructure.push(textNode);
                //                     }
                //                 } else {
                //                     const originalClassList = [...(node as Element).classList];
                //                     const preText = (node.textContent as string).slice(0, cursorData.startOffset);
                //                     const nextText = (node.textContent as string).slice(cursorData.endOffset);
                //                     if (preText !== "") {
                //                         const $span = document.createElement("span");
                //                         $span.classList.add(...originalClassList);
                //                         $span.textContent = preText;
                //                         preStructure.push($span);
                //                     }
                //                     if (nextText !== "") {
                //                         const $span = document.createElement("span");
                //                         $span.classList.add(...originalClassList);
                //                         $span.textContent = nextText;
                //                         nextStructure.push($span);
                //                     }
                //                 }
                //             }
                //         });
                //     } else {
                //         // 다른 노드의 경우
                //         childNodeList.forEach((node: ChildNode, i: number) => {
                //             if (cursorData.startNodeIdx > i) {
                //                 preStructure.push(node);
                //             } else if (cursorData.startNodeIdx === i) {
                //                 if (node.constructor.name === "Text") {
                //                     const text = (node.textContent as string).slice(0, cursorData.startOffset);
                //                     if (text !== "") {
                //                         const textNode = document.createTextNode(text);
                //                         preStructure.push(textNode);
                //                     }
                //                 } else {
                //                     const originalClassList = [...(node as Element).classList];
                //                     const text = (node.textContent as string).slice(0, cursorData.startOffset);
                //                     if (text !== "") {
                //                         const $span = document.createElement("span");
                //                         $span.classList.add(...originalClassList);
                //                         $span.textContent = text;
                //                         preStructure.push($span);
                //                     }
                //                 }
                //             }
                //             if (cursorData.endNodeIdx < i) {
                //                 nextStructure.push(node);
                //             } else if (cursorData.endNodeIdx === i) {
                //                 if (node.constructor.name === "Text") {
                //                     const text = (node.textContent as string).slice(cursorData.endOffset);
                //                     if (text !== "") {
                //                         const textNode = document.createTextNode(text);
                //                         nextStructure.push(textNode);
                //                     }
                //                 } else {
                //                     const originalClassList = [...(node as Element).classList];
                //                     const text = (node.textContent as string).slice(cursorData.endOffset);
                //                     const $span = document.createElement("span");
                //                     if (text !== "") {
                //                         $span.classList.add(...originalClassList);
                //                         $span.textContent = text;
                //                         nextStructure.push($span);
                //                     }
                //                 }
                //             }
                //         });
                //     }
                //     const $nextBlock = _createTextBlock({ type: "text", classList: [], textContent: "" });
                //     // 텍스트 블럭 삽입
                //     $textBlock.insertAdjacentElement("afterend", $nextBlock);
                //     $textBlock.replaceChildren(...preStructure);
                //     $nextBlock.replaceChildren(...nextStructure);
                //     // 커서 위치 지정
                //     if (nextStructure.length === 0) {
                //         $nextBlock.focus();
                //     } else {
                //         _setCursor($nextBlock.childNodes[0], 0);
                //     }
                // }
            }
        } else {
            console.error("?!!?!?!?!?!?!?");
        }
    } else {
        console.error("?!!?!?!?!?!?!?");
    }
}

function __defaultBlockShiftEnterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    event.preventDefault();

    if (store.value.cursorData !== null) {
        const $block = store.value.controlStatus.$curruntblock;

        if ($block !== null) {
            if (store.value.cursorData.type === "Caret") {
                // 단일 커서인경우

                if ($block.textContent === "") {
                    // 텍스트가 없는 경우

                    if ($block.hasChildNodes() === false) {
                        // 자식 노드가 없는 경우

                        $block.insertAdjacentHTML("beforeend", "<br><br>");
                        _setCursor($block.childNodes[1] as Element, 0);
                    } else {
                        // br로만 이루어진 경우

                        let $target = store.value.cursorData.startNode;
                        let childIdx = -1;

                        if ($block === $target) {
                            $target = $block.childNodes[store.value.cursorData.startOffset];
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
                }

                //     } else {
                //         // 자식 노드가 있고 br로만 이루어지지 않은 경우
                //         const childList = $textBlock.childNodes;
                //         let targetIdx = -1;
                //         let structure: string = "";
                //         let $target = store.cursorData.startNode;
                //         if ($target.constructor.name === "Text") {
                //             if ($target.parentNode !== $textBlock) {
                //                 $target = $target.parentNode;
                //             }
                //         }
                //         if ($textBlock === $target) {
                //             $target = $textBlock.childNodes[store.cursorData.startOffset];
                //         }
                //         for (let i = 0; childList.length > i; i += 1) {
                //             if (childList[i] === $target) {
                //                 targetIdx = i;
                //                 break;
                //             }
                //         }
                //         let curruntIdx = targetIdx;
                //         childList.forEach((child, i) => {
                //             if (i === targetIdx) {
                //                 const constructorName = child.constructor.name;
                //                 if (constructorName === "Text") {
                //                     // 텍스트 노드인 경우
                //                     structure += (child.textContent as string).slice(0, store.cursorData.startOffset) + "<br>" + (child.textContent as string).slice(store.cursorData.endOffset);
                //                     if (child.nextSibling === null) {
                //                         // 다음 노드가 없는 경우
                //                         if ((child.textContent as string).slice(store.cursorData.endOffset) === "") {
                //                             // 뒷 문자가 없는 경우
                //                             structure += `<br>`;
                //                         }
                //                         if ((child.textContent as string).slice(0, store.cursorData.startOffset) === "") {
                //                             // 앞 문자가 없는 경우
                //                             curruntIdx -= 1;
                //                         }
                //                     } else {
                //                         // 다음 노드가 있는 경우
                //                         if ((child.textContent as string).slice(store.cursorData.endOffset) !== "" && (child.textContent as string).slice(0, store.cursorData.startOffset) === "") {
                //                             // 뒷 문자가 있고 앞 문자가 없는 경우
                //                             curruntIdx -= 1;
                //                         }
                //                     }
                //                     curruntIdx += 1;
                //                 } else {
                //                     // 엘리먼트인 경우
                //                     if (constructorName === "HTMLBRElement") {
                //                         // br 태그인 경우 (가장 첫 노드의 첫 커서 인경우)
                //                         structure += `<br><br>`;
                //                     } else {
                //                         // span 태그인 경우
                //                         structure += `<span class="${[...(child as HTMLSpanElement).classList].join(" ")}">${(child.textContent as string).slice(0, store.cursorData.startOffset)}</span>`;
                //                         structure += `<br>`;
                //                         structure += `<span class="${[...(child as HTMLSpanElement).classList].join(" ")}">${(child.textContent as string).slice(store.cursorData.startOffset)}</span>`;
                //                         curruntIdx += 1;
                //                     }
                //                 }
                //             } else {
                //                 if (child.constructor.name === "Text") {
                //                     structure += child.textContent;
                //                 } else {
                //                     structure += (child as HTMLElement).outerHTML;
                //                 }
                //             }
                //         });
                //         $textBlock.innerHTML = structure;
                //         _setCursor($textBlock.childNodes[curruntIdx + 1] as Element, 0);
                //     }
            } else {
                //     // 셀렉트 커서인경우
                //     const childNodeList = $textBlock.childNodes;
                //     let startTargetNode = store.cursorData.startNode;
                //     let startNodeIdx: number = -1;
                //     let startOffset: number = store.cursorData.startOffset;
                //     let endTargetNode = store.cursorData.endNode;
                //     let endNodeIdx: number = -1;
                //     let endOffset: number = store.cursorData.endOffset;
                //     let structure = "";
                //     if (startTargetNode.constructor.name === "Text") {
                //         if (startTargetNode.parentElement !== $textBlock) {
                //             startTargetNode = startTargetNode.parentElement;
                //         }
                //     }
                //     if (endTargetNode.constructor.name === "Text") {
                //         if (endTargetNode.parentElement !== $textBlock) {
                //             endTargetNode = endTargetNode.parentElement;
                //         }
                //     }
                //     for (let i: number = 0; childNodeList.length > i; i += 1) {
                //         if (startTargetNode === childNodeList[i]) {
                //             startNodeIdx = i;
                //         }
                //         if (endTargetNode === childNodeList[i]) {
                //             endNodeIdx = i;
                //         }
                //         if (startNodeIdx !== -1 && endNodeIdx !== -1) {
                //             break;
                //         }
                //     }
                //     // 역 드레그 인 경우 정리
                //     if (startNodeIdx !== endNodeIdx) {
                //         if (startNodeIdx > endNodeIdx) {
                //             const originalEndNodeIdx: number = endNodeIdx;
                //             const originalEndOffset: number = endOffset;
                //             const originalStartNodeIdx: number = startNodeIdx;
                //             const originalStartOffset: number = startOffset;
                //             startNodeIdx = originalEndNodeIdx;
                //             startOffset = originalEndOffset;
                //             endNodeIdx = originalStartNodeIdx;
                //             endOffset = originalStartOffset;
                //         }
                //     } else {
                //         if (startOffset > endOffset) {
                //             const originalEndOffset: number = endOffset;
                //             const originalStartOffset: number = startOffset;
                //             startOffset = originalEndOffset;
                //             endOffset = originalStartOffset;
                //         }
                //     }
                //     childNodeList.forEach((node: ChildNode, i: number) => {
                //         if (startNodeIdx > i) {
                //             if (node.constructor.name === "Text") {
                //                 structure += node.textContent;
                //             } else {
                //                 structure += (node as Element).outerHTML;
                //             }
                //         } else if (startNodeIdx === i) {
                //             if (node.constructor.name === "Text") {
                //                 structure += (node.textContent as string).slice(0, startOffset);
                //                 structure += `<br>`;
                //             } else {
                //                 if ((node as HTMLElement).tagName === "BR") {
                //                     structure += `<br>`;
                //                 } else {
                //                     const originalClassList = [...(node as Element).classList];
                //                     const text = node.textContent as string;
                //                     structure += `<span class="${originalClassList.join(" ")}">${text.slice(0, startOffset)}</span><br>`;
                //                 }
                //             }
                //             if (childNodeList.length === i) {
                //                 structure += `<br>`;
                //             }
                //         }
                //         if (endNodeIdx < i) {
                //             if (node.constructor.name === "Text") {
                //                 structure += node.textContent;
                //             } else {
                //                 structure += (node as Element).outerHTML;
                //             }
                //         } else if (endNodeIdx === i) {
                //             if (node.constructor.name === "Text") {
                //                 structure += (node.textContent as string).slice(endOffset);
                //             } else {
                //                 if ((node as HTMLElement).tagName === "BR") {
                //                     structure += `<br>`;
                //                 } else {
                //                     const originalClassList = [...(node as Element).classList];
                //                     const text = node.textContent as string;
                //                     structure += `<span class="${originalClassList.join(" ")}">${text.slice(endOffset)}</span><br>`;
                //                 }
                //             }
                //         }
                //     });
                //     $textBlock.innerHTML = structure;
                //     _setCursor($textBlock.childNodes[startNodeIdx + 2] as Element, 0);
            }
        } else {
            console.error("?!!?!?!?!?!?!?");
        }
    } else {
        console.error("?!!?!?!?!?!?!?");
    }
}

// 키 업 이벤트
let contentKeyupEvent: NodeJS.Timeout;
export function _contentKeyupEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    clearTimeout(contentKeyupEvent);
    contentKeyupEvent = setTimeout(() => {
        _updateModelData(store);
    }, 250);
}
