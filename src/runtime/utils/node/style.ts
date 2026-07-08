import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _findEditableElement, _findEditableParent, _findParentBlock } from "./index";
import { _arrangementNodeList, _getEditorbleCursorPosition, _isStrictlyEqualArrays } from "../data";
import { _setCursorPosition, _setRangeCursorPosition, _updateCursorData } from "../event";
import type { DEBlockData, DETextBlock, DEHeadingBlock, DEListBlock, DEImageBlock, DETextalign } from "../../type.d.mts";

// 정렬 적용
export async function _setAlign(style: DETextalign): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
    const blockData = newData[editorStore.selectedBlockIndex] as DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock;

    if (blockData !== undefined && editorStore.fn.updateEditorData !== null && editorStore.cursorSelection !== null && editorStore.element.body !== null) {
        let className: string = "";
        const $editableElement = _findEditableParent(editorStore.cursorSelection.anchorNode as HTMLElement);

        if ($editableElement !== null) {
            const offset = _getEditorbleCursorPosition($editableElement);
            const classList: string[] = ["de-align-left", "de-align-right", "de-align-center", "de-align-justify"];

            switch (style) {
                case "left":
                    className = "de-align-left";
                    break;
                case "right":
                    className = "de-align-right";
                    break;
                case "center":
                    className = "de-align-center";
                    break;
                case "justify":
                    className = "de-align-justify";
                    break;
            }

            if (blockData.type === "list") {
                const $block = _findParentBlock($editableElement);

                if ($block !== null) {
                    const $childList = $block.querySelectorAll(".de-item-text");
                    let childIndex: number = -1;

                    for (let i = 0; i < $childList.length; i += 1) {
                        const $child = $childList[i];

                        if ($child === $editableElement) {
                            childIndex = i;
                            break;
                        }
                    }

                    const curruntChildData = blockData.child[childIndex];

                    if (curruntChildData !== undefined) {
                        classList.forEach((name) => {
                            if (name !== className) {
                                const index = curruntChildData.classList.indexOf(name);

                                if (index !== -1) {
                                    curruntChildData.classList.splice(index, 1);
                                }
                            }
                        });

                        const classIndex = curruntChildData.classList.indexOf(className);

                        if (classIndex === -1) {
                            curruntChildData.classList.push(className);
                        } else {
                            curruntChildData.classList.splice(classIndex, 1);
                        }

                        blockData.child[childIndex] = curruntChildData;
                        newData[editorStore.selectedBlockIndex] = blockData;
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $textArea = $block.querySelectorAll(".de-item-text");
                        const $targetTextArea = $textArea[childIndex];

                        if ($targetTextArea !== undefined) {
                            const $node = $targetTextArea.childNodes[offset.nodeIndex];

                            $targetTextArea.dispatchEvent(new Event("blur"));

                            if ($node !== undefined) {
                                _setCursorPosition($node, offset.offset);
                            } else {
                                _setCursorPosition($targetTextArea, 0);
                            }
                        }
                    }
                }
            } else {
                classList.forEach((name) => {
                    if (name !== className) {
                        const index = blockData.classList.indexOf(name);

                        if (index !== -1) {
                            blockData.classList.splice(index, 1);
                        }
                    }
                });

                const classIndex = blockData.classList.indexOf(className);

                if (classIndex === -1) {
                    blockData.classList.push(className);
                } else {
                    blockData.classList.splice(classIndex, 1);
                }

                editorStore.selectedBlockId = "";
                newData[editorStore.selectedBlockIndex] = blockData;
                editorStore.fn.updateEditorData(newData);
                await nextTick();

                const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

                if ($block !== undefined) {
                    if (blockData.type === "image") {
                        const $editableElement = _findEditableElement($block, "down");

                        if ($editableElement !== null) {
                            const $node = $editableElement.childNodes[offset.nodeIndex];

                            if ($node !== undefined) {
                                $node.dispatchEvent(new Event("input"));
                                _setCursorPosition($node, offset.offset);
                            } else {
                                _setCursorPosition($editableElement, offset.offset);
                            }
                        }
                    } else {
                        const $node = $block.childNodes[offset.nodeIndex];

                        if ($node !== undefined) {
                            $block.dispatchEvent(new Event("input"));
                            _setCursorPosition($node, offset.offset);
                        }
                    }
                }
            }
        }
    }
}

// 스타일 적용
export async function _setDecoration(className: DEDecorationClass): Promise<void> {
    const editorStore = useEditorStore();

    if (editorStore.cursorRange !== null) {
        const cloneRange = editorStore.cursorRange.cloneRange();
        const $editableParent = _findEditableParent(cloneRange.startContainer.nodeType === Node.TEXT_NODE ? cloneRange.startContainer.parentElement : (cloneRange.startContainer as HTMLElement));

        if ($editableParent !== null) {
            const nodeList: Node[] = [];
            let selectedAll: boolean = false;
            let cursorStartNode: Node | null = null;
            let cursorStartNodeOffset: number = 0;
            let cursorEndNode: Node | null = null;
            let cursorEndNodeOffset: number = 0;

            if (cloneRange.collapsed === true) {
                // 단일커서

                $editableParent.childNodes.forEach((node: Node) => {
                    if (cloneRange.startContainer.parentElement === $editableParent) {
                        // 최상위 노드

                        if (node.nodeType === Node.TEXT_NODE) {
                            const styleNode = document.createElement("span");

                            styleNode.className = className;
                            styleNode.textContent = node.textContent;

                            nodeList.push(styleNode);
                        } else {
                            const $span = node as HTMLSpanElement;

                            $span.classList.add(className);
                            nodeList.push($span);
                        }

                        selectedAll = true;
                    } else {
                        // 스타일 노드

                        const $span = node as HTMLSpanElement;

                        if (cloneRange.startContainer.parentElement === $span) {
                            if ($span.classList.contains(className) === true) {
                                $span.classList.remove(className);
                            } else {
                                $span.classList.add(className);
                            }

                            if ($span.className === "") {
                                const textNode = document.createTextNode($span.textContent || "");

                                nodeList.push(textNode);
                                cursorStartNode = textNode;
                                cursorStartNodeOffset = 0;
                                cursorEndNode = textNode;
                                cursorEndNodeOffset = textNode.textContent.length;
                            } else {
                                nodeList.push($span);
                                cursorStartNode = $span.childNodes[0] || null;
                                cursorStartNodeOffset = 0;
                                cursorEndNode = $span.childNodes[0] || null;
                                cursorEndNodeOffset = $span.textContent.length;
                            }
                        } else {
                            nodeList.push(node);
                        }
                    }
                });
            } else {
                // 선택커서

                let isBettween: boolean = false;

                $editableParent.childNodes.forEach((node: Node) => {
                    if (cloneRange.startContainer === cloneRange.endContainer) {
                        // 같은 노드

                        if (cloneRange.startContainer.parentElement === $editableParent) {
                            // 최상위 노드

                            let textNode: Node | null = node;

                            if (node.nodeType !== Node.TEXT_NODE) {
                                if (node.textContent === "") {
                                    textNode = null;
                                } else {
                                    textNode = node.childNodes[0] || null;
                                }
                            }

                            if (textNode !== null && textNode === cloneRange.startContainer) {
                                const text = textNode.textContent;

                                if (text !== null) {
                                    const $firstNode = document.createTextNode(text.substring(0, cloneRange.startOffset));
                                    const $middleNode = document.createElement("span");
                                    const $lastNode = document.createTextNode(text.substring(cloneRange.endOffset, text.length));

                                    $middleNode.className = className;
                                    $middleNode.textContent = text.substring(cloneRange.startOffset, cloneRange.endOffset);

                                    nodeList.push($firstNode, $middleNode, $lastNode);

                                    cursorStartNode = $middleNode.childNodes[0] || null;
                                    cursorStartNodeOffset = 0;
                                    cursorEndNode = $middleNode.childNodes[0] || null;
                                    cursorEndNodeOffset = $middleNode.textContent.length;
                                }
                            } else {
                                nodeList.push(node);
                            }
                        } else {
                            // 스타일 노드

                            if (cloneRange.startContainer.parentElement === node) {
                                const $span = node as HTMLSpanElement;

                                if (cloneRange.startOffset === 0 && cloneRange.endOffset === (node.textContent || "").length) {
                                    // 노드 전체 선택

                                    if ($span.classList.contains(className) === true) {
                                        $span.classList.remove(className);
                                    } else {
                                        $span.classList.add(className);
                                    }

                                    if ($span.className === "") {
                                        const textNode = document.createTextNode($span.textContent || "");

                                        nodeList.push(textNode);
                                        cursorStartNode = textNode;
                                        cursorStartNodeOffset = 0;
                                        cursorEndNode = textNode;
                                        cursorEndNodeOffset = textNode.textContent.length;
                                    } else {
                                        nodeList.push($span);
                                        cursorStartNode = $span.childNodes[0] || null;
                                        cursorStartNodeOffset = 0;
                                        cursorEndNode = $span.childNodes[0] || null;
                                        cursorEndNodeOffset = $span.textContent.length;
                                    }
                                } else {
                                    // 노드 일부 선택

                                    const text = $span.textContent;
                                    const $firstNode = $span.cloneNode() as HTMLSpanElement;
                                    const $middleNode = $span.cloneNode() as HTMLSpanElement;
                                    const $lastNode = $span.cloneNode() as HTMLSpanElement;

                                    $firstNode.textContent = text.substring(0, cloneRange.startOffset);
                                    $middleNode.textContent = text.substring(cloneRange.startOffset, cloneRange.endOffset);
                                    $lastNode.textContent = text.substring(cloneRange.endOffset, text.length);

                                    if ($middleNode.classList.contains(className) === false) {
                                        $middleNode.classList.add(className);
                                    }

                                    nodeList.push($firstNode, $middleNode, $lastNode);
                                    cursorStartNode = $middleNode.childNodes[0] || null;
                                    cursorStartNodeOffset = 0;
                                    cursorEndNode = $middleNode.childNodes[0] || null;
                                    cursorEndNodeOffset = $middleNode.textContent.length;
                                }
                            } else {
                                nodeList.push(node);
                            }
                        }
                    } else {
                        // 다른 노드

                        if (cloneRange.startContainer === node || cloneRange.endContainer === node || cloneRange.startContainer.parentElement === node || cloneRange.endContainer.parentElement === node) {
                            const text = node.textContent;

                            if (text !== null) {
                                const textStartOffset = cloneRange.startOffset;
                                const textEndOffset = cloneRange.endOffset;

                                if (cloneRange.startContainer === node) {
                                    const $span = document.createElement("span");

                                    $span.className = className;
                                    $span.textContent = text.substring(textStartOffset);
                                    nodeList.push(document.createTextNode(text.substring(0, textStartOffset)));
                                    nodeList.push($span);
                                    cursorStartNode = $span.childNodes[0] || null;
                                    cursorStartNodeOffset = 0;
                                    isBettween = true;
                                }

                                if (cloneRange.startContainer.parentElement === node) {
                                    const $span = node as HTMLSpanElement;

                                    if ($span.classList.contains(className) === true) {
                                        nodeList.push($span);
                                        cursorStartNode = $span.childNodes[0] || null;
                                        cursorStartNodeOffset = textStartOffset;
                                    } else {
                                        const $newSpan = $span.cloneNode() as HTMLSpanElement;

                                        $span.textContent = text.substring(0, textStartOffset);
                                        $newSpan.textContent = text.substring(textStartOffset);

                                        if ($newSpan.classList.contains(className) === false) {
                                            $newSpan.classList.add(className);
                                        }

                                        nodeList.push($span);
                                        nodeList.push($newSpan);
                                        cursorStartNode = $newSpan.childNodes[0] || null;
                                        cursorStartNodeOffset = 0;
                                    }

                                    isBettween = true;
                                }

                                if (cloneRange.endContainer === node) {
                                    const $span = document.createElement("span");

                                    $span.className = className;
                                    $span.textContent = text.substring(0, textEndOffset);
                                    nodeList.push($span);
                                    nodeList.push(document.createTextNode(text.substring(textEndOffset)));
                                    cursorEndNode = $span.childNodes[0] || null;
                                    cursorEndNodeOffset = text.substring(0, textEndOffset).length;
                                    isBettween = false;
                                }

                                if (cloneRange.endContainer.parentElement === node) {
                                    const $span = node as HTMLSpanElement;
                                    const $newSpan = $span.cloneNode() as HTMLSpanElement;

                                    if ($span.classList.contains(className) === true) {
                                        nodeList.push($span);
                                        cursorEndNode = $span.childNodes[0] || null;
                                        cursorEndNodeOffset = textEndOffset;
                                    } else {
                                        $newSpan.textContent = text.substring(0, textEndOffset);
                                        $span.textContent = text.substring(textEndOffset);

                                        if ($newSpan.classList.contains(className) === false) {
                                            $newSpan.classList.add(className);
                                        }

                                        nodeList.push($newSpan);
                                        nodeList.push($span);
                                        cursorEndNode = $newSpan.childNodes[0] || null;
                                        cursorEndNodeOffset = text.substring(0, textEndOffset).length;
                                    }

                                    isBettween = false;
                                }
                            }
                        } else {
                            if (isBettween === false) {
                                nodeList.push(node);
                            } else {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    const $span = document.createElement("span");

                                    $span.className = className;
                                    $span.textContent = node.textContent || "";

                                    nodeList.push($span);
                                } else {
                                    const $span = node as HTMLSpanElement;

                                    if ($span.classList.contains(className) === false) {
                                        $span.classList.add(className);
                                    }

                                    nodeList.push($span);
                                }
                            }
                        }
                    }
                });
            }

            $editableParent.innerHTML = "";

            const { list: newList, cursorStartNode: StartNode, cursorStartNodeOffset: StartNodeOffset, cursorEndNode: EndNode, cursorEndNodeOffset: EndNodeOffset } = _arrangementNodeList(nodeList, cursorStartNode, cursorStartNodeOffset, cursorEndNode, cursorEndNodeOffset);

            // @ts-ignore : 순회문에 의한 재할당 확인 불가 이슈로 제외처리
            if (selectedAll === true) {
                const targetStartNode = newList[0];
                const targetEndNode = newList[newList.length - 1];

                if (targetStartNode !== undefined) {
                    if (targetStartNode.nodeType === Node.TEXT_NODE) {
                        cursorStartNode = targetStartNode;
                    } else {
                        cursorStartNode = targetStartNode.childNodes[0] || null;
                    }
                }

                if (targetEndNode !== undefined) {
                    if (targetEndNode.nodeType === Node.TEXT_NODE) {
                        cursorEndNode = targetEndNode;
                    } else {
                        cursorEndNode = targetEndNode.childNodes[0] || null;
                    }
                }

                cursorStartNodeOffset = 0;

                if (cursorEndNode !== null) {
                    cursorEndNodeOffset = cursorEndNode.textContent?.length || 0;
                }
            }

            newList.forEach((node) => {
                if (node.textContent !== "") {
                    $editableParent.appendChild(node);
                }
            });

            $editableParent.dispatchEvent(new Event("input"));
            await nextTick();

            if (StartNode !== null && EndNode !== null) {
                _setRangeCursorPosition(StartNode, StartNodeOffset, EndNode, EndNodeOffset);
                _updateCursorData();
            }
        }
    }
}

// 링크 적용
export async function _setLink(url: string): Promise<void> {
    const editorStore = useEditorStore();

    if (editorStore.cursorRange !== null && editorStore.cursorRange.collapsed === false) {
        const $editableParent = _findEditableParent(editorStore.cursorRange.startContainer.nodeType === Node.TEXT_NODE ? editorStore.cursorRange.startContainer.parentElement : (editorStore.cursorRange.startContainer as HTMLElement));

        if ($editableParent !== null) {
            const cloneRange = editorStore.cursorRange.cloneRange();
            const nodeList: Node[] = [];
            let cursorStartNode: Node | null = null;
            let cursorStartNodeOffset: number = 0;
            let cursorEndNode: Node | null = null;
            let cursorEndNodeOffset: number = 0;
            let isBettween: boolean = false;

            $editableParent.childNodes.forEach((node: Node) => {
                if (cloneRange.startContainer === cloneRange.endContainer) {
                    // 같은 노드

                    if (cloneRange.startContainer.parentElement === $editableParent) {
                        // 최상위 노드

                        let textNode: Node | null = node;

                        if (node.nodeType !== Node.TEXT_NODE) {
                            if (node.textContent === "") {
                                textNode = null;
                            } else {
                                textNode = node.childNodes[0] || null;
                            }
                        }

                        if (textNode !== null && textNode === cloneRange.startContainer) {
                            const text = textNode.textContent;

                            if (text !== null) {
                                const $firstNode = document.createTextNode(text.substring(0, cloneRange.startOffset));
                                const $middleNode = document.createElement("a");
                                const $lastNode = document.createTextNode(text.substring(cloneRange.endOffset, text.length));

                                if (editorStore.option.anchorTagTarget !== "") {
                                    $middleNode.target = editorStore.option.anchorTagTarget;
                                }

                                $middleNode.className = "de-link";
                                $middleNode.href = url;
                                $middleNode.textContent = text.substring(cloneRange.startOffset, cloneRange.endOffset);
                                nodeList.push($firstNode, $middleNode, $lastNode);
                                cursorStartNode = $middleNode.childNodes[0] || null;
                                cursorStartNodeOffset = 0;
                                cursorEndNode = $middleNode.childNodes[0] || null;
                                cursorEndNodeOffset = $middleNode.textContent.length;
                            }
                        } else {
                            nodeList.push(node);
                        }
                    } else {
                        // 스타일 노드

                        if (cloneRange.startContainer.parentElement === node) {
                            const $span = node as HTMLSpanElement;

                            if (cloneRange.startOffset === 0 && cloneRange.endOffset === (node.textContent || "").length) {
                                const $aTag = document.createElement("a");

                                if (editorStore.option.anchorTagTarget !== "") {
                                    $aTag.target = editorStore.option.anchorTagTarget;
                                }

                                $aTag.className = "de-link";
                                $aTag.href = url;
                                $aTag.textContent = $span.textContent;
                                nodeList.push($aTag);
                                cursorStartNode = $aTag.childNodes[0] || null;
                                cursorStartNodeOffset = 0;
                                cursorEndNode = $aTag.childNodes[0] || null;
                                cursorEndNodeOffset = $aTag.textContent.length;
                            } else {
                                // 노드 일부 선택

                                const text = $span.textContent;
                                const $firstNode = $span.cloneNode() as HTMLSpanElement;
                                const $middleNode = document.createElement("a");
                                const $lastNode = $span.cloneNode() as HTMLSpanElement;

                                if (editorStore.option.anchorTagTarget !== "") {
                                    $middleNode.target = editorStore.option.anchorTagTarget;
                                }

                                $middleNode.className = "de-link";
                                $middleNode.href = url;

                                $firstNode.textContent = text.substring(0, cloneRange.startOffset);
                                $middleNode.textContent = text.substring(cloneRange.startOffset, cloneRange.endOffset);
                                $lastNode.textContent = text.substring(cloneRange.endOffset, text.length);
                                nodeList.push($firstNode, $middleNode, $lastNode);
                                cursorStartNode = $middleNode.childNodes[0] || null;
                                cursorStartNodeOffset = 0;
                                cursorEndNode = $middleNode.childNodes[0] || null;
                                cursorEndNodeOffset = $middleNode.textContent.length;
                            }
                        } else {
                            nodeList.push(node);
                        }
                    }
                } else {
                    // 다른 노드

                    if (cloneRange.startContainer === node || cloneRange.endContainer === node || cloneRange.startContainer.parentElement === node || cloneRange.endContainer.parentElement === node) {
                        const text = node.textContent;

                        if (text !== null) {
                            const textStartOffset = cloneRange.startOffset;
                            const textEndOffset = cloneRange.endOffset;

                            if (cloneRange.startContainer === node || cloneRange.startContainer.parentElement === node) {
                                const $aTag = document.createElement("a");

                                if (editorStore.option.anchorTagTarget !== "") {
                                    $aTag.target = editorStore.option.anchorTagTarget;
                                }

                                $aTag.className = "de-link";
                                $aTag.href = url;
                                $aTag.textContent = text.substring(textStartOffset);
                                nodeList.push(document.createTextNode(text.substring(0, textStartOffset)));
                                nodeList.push($aTag);
                                cursorStartNode = $aTag.childNodes[0] || null;
                                cursorStartNodeOffset = 0;
                                isBettween = true;
                            }

                            if (cloneRange.endContainer === node || cloneRange.endContainer.parentElement === node) {
                                const $aTag = document.createElement("a");

                                if (editorStore.option.anchorTagTarget !== "") {
                                    $aTag.target = editorStore.option.anchorTagTarget;
                                }

                                $aTag.className = "de-link";
                                $aTag.href = url;
                                $aTag.textContent = text.substring(0, textEndOffset);
                                nodeList.push($aTag);
                                nodeList.push(document.createTextNode(text.substring(textEndOffset)));
                                cursorEndNode = $aTag.childNodes[0] || null;
                                cursorEndNodeOffset = text.substring(0, textEndOffset).length;
                                isBettween = false;
                            }
                        }
                    } else {
                        if (isBettween === false) {
                            nodeList.push(node);
                        } else {
                            const $aTag = document.createElement("a");

                            if (editorStore.option.anchorTagTarget !== "") {
                                $aTag.target = editorStore.option.anchorTagTarget;
                            }

                            $aTag.className = "de-link";
                            $aTag.href = url;
                            $aTag.textContent = node.textContent;
                            nodeList.push($aTag);
                        }
                    }
                }
            });

            $editableParent.innerHTML = "";

            const { list: newList, cursorStartNode: StartNode, cursorStartNodeOffset: StartNodeOffset, cursorEndNode: EndNode, cursorEndNodeOffset: EndNodeOffset } = _arrangementNodeList(nodeList, cursorStartNode, cursorStartNodeOffset, cursorEndNode, cursorEndNodeOffset);

            newList.forEach((node) => {
                if (node.textContent !== "") {
                    $editableParent.appendChild(node);
                }
            });

            editorStore.status.anchorHerf = "";
            $editableParent.dispatchEvent(new Event("input"));
            await nextTick();

            if (StartNode !== null && EndNode !== null) {
                _setRangeCursorPosition(StartNode, StartNodeOffset, EndNode, EndNodeOffset);
                _updateCursorData();
            }
        }
    }
}

// 링크 해제
export async function _removeLink(): Promise<void> {
    const editorStore = useEditorStore();
}
