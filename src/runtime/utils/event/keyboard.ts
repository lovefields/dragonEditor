import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _updateCursorData, _setCursorPosition } from "./index";
import { _createTextBlockData, _createHeadingBlockData, _getMultilinePosition, _getBlockType, _getBeforeAndAfterHTMLOfCursor, _createListBlockData, _createListBlockChildData, _isCursorAtLineBoundary, _getEditorbleEndPosition } from "../data";
import { _findEditableElement, _findParentBlock } from "../node";
import type { DETextBlock, DEHeadingBlock, DEContentData } from "../../type.mjs";

// 내용 짤라서 새로운 텍스트 블럭 생성 (엔터 이벤트)
export async function _sliceAndNewTextBlock(event: KeyboardEvent, data: DETextBlock | DEHeadingBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const $target = event.currentTarget as HTMLElement;
        const { beforeHTML, afterHTML } = _getBeforeAndAfterHTMLOfCursor($target);

        if (beforeHTML === "" && afterHTML !== "") {
            // 커서 앞이 빈 경우
            newData.splice(index, 0, _createTextBlockData());
            editorStore.fn.updateEditorData(newData);
        } else if ((beforeHTML !== "" && afterHTML === "") || (beforeHTML === "" && afterHTML === "")) {
            // 커서 뒤가 빈 경우 && 내용이 빈 경우
            data.textContent = beforeHTML;
            newData.splice(index + 1, 0, _createTextBlockData());
            newData[index] = data;
            editorStore.fn.updateEditorData(newData);
            await nextTick();
            $target.dispatchEvent(new Event("input"));
            await nextTick();
            ($target.nextElementSibling as HTMLParagraphElement).focus();
        } else {
            // 중간인 경우
            if (data.type === "text") {
                newData.splice(index + 1, 0, _createTextBlockData(afterHTML));
            } else {
                newData.splice(index, 0, _createHeadingBlockData(data.level, beforeHTML));
                newData.splice(index + 1, 1, _createTextBlockData(afterHTML));
            }

            data.textContent = beforeHTML;
            newData[index] = data;
            editorStore.fn.updateEditorData(newData);
            await nextTick();

            if (editorStore.element.body !== null) {
                const $block = editorStore.element.body.children[index + 1] as HTMLParagraphElement;

                $block.focus();
                $block.dispatchEvent(new Event("input"));
            }

            editorStore.selectedBlockIndex += 1;
            _updateCursorData();
        }
    }
}

// 이미지 캡션 엔터 이벤트
export async function _imageEnterEvent(event: KeyboardEvent, data: DEImageBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.element.body !== null && editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const $target = event.currentTarget as HTMLElement;
        const { beforeHTML, afterHTML } = _getBeforeAndAfterHTMLOfCursor($target);

        data.caption = beforeHTML;
        newData.splice(index + 1, 0, _createTextBlockData(afterHTML));
        newData[index] = data;
        editorStore.selectedBlockIndex += 1;
        editorStore.fn.updateEditorData(newData);
        await nextTick();
        $target.dispatchEvent(new Event("input"));
        (editorStore.element.body.children[index + 1] as HTMLParagraphElement).focus();
        _updateCursorData();
    }
}

// 리스트 블럭 엔터 이벤트
export async function _listBlockEnterEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, setEvent: (liIndex: number, id: string) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const targetChildrenCount = data.child.length;
        const targetChild = data.child[childIndex];
        const $target = event.currentTarget as HTMLElement;

        if (targetChild !== undefined) {
            const { beforeHTML, afterHTML } = _getBeforeAndAfterHTMLOfCursor($target);

            abortEvent();

            if (targetChildrenCount === 1) {
                // 자식이 한개인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    // 내용이 비어있는 경우
                    newData.splice(index, 1, _createTextBlockData());
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    (editorStore.element.body.children[index] as HTMLElement).focus();
                } else {
                    data.child[childIndex]!.textContent = beforeHTML;
                    data.child.push(_createListBlockChildData(afterHTML, targetChild.depth));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

                    if ($parentBlock !== undefined) {
                        const $childElement = $parentBlock.children[childIndex + 1] as HTMLLIElement;

                        if ($childElement !== undefined) {
                            const $textArea = $childElement.querySelector(".de-item-text") as HTMLParagraphElement;

                            if ($textArea !== null) {
                                $textArea.focus();
                            }
                        }
                    }
                }
            } else if (targetChildrenCount - 1 === childIndex) {
                // 마지막 자식인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    if (targetChild.depth === undefined) {
                        data.child.splice(childIndex, 1);
                        newData[index] = data;
                        newData.splice(index + 1, 0, _createTextBlockData());
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        (editorStore.element.body.children[index + 1] as HTMLElement).focus();
                    } else {
                        if (targetChild.depth === 1) {
                            delete targetChild.depth;
                        } else {
                            targetChild.depth -= 1;
                        }

                        data.child[childIndex] = targetChild;
                        newData[index] = data;
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

                        if ($parentBlock !== undefined) {
                            const $childElement = $parentBlock.querySelectorAll("li")[childIndex];

                            if ($childElement !== undefined) {
                                const $textArea = $childElement.querySelector(".de-item-text") as HTMLParagraphElement;

                                if ($textArea !== null) {
                                    $textArea.focus();
                                }
                            }
                        }
                    }
                } else {
                    data.child[childIndex]!.textContent = beforeHTML;
                    data.child.push(_createListBlockChildData(afterHTML, targetChild.depth));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

                    if ($parentBlock !== undefined) {
                        const $childElement = $parentBlock.querySelectorAll("li")[childIndex + 1];

                        if ($childElement !== undefined) {
                            const $textArea = $childElement.querySelector(".de-item-text") as HTMLParagraphElement;

                            if ($textArea !== null) {
                                $textArea.focus();
                            }
                        }
                    }
                }
            } else {
                // 중간 자식인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    if (targetChild.depth === undefined) {
                        const beforeChildList = data.child.slice(0, childIndex);
                        const afterChildList = data.child.slice(childIndex + 1);
                        newData.splice(index, 1, _createListBlockData(data.element, beforeChildList));
                        newData.splice(index + 1, 0, _createTextBlockData());
                        newData.splice(index + 2, 0, _createListBlockData(data.element, afterChildList));

                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $block = editorStore.element.body.children[index + 1] as HTMLElement;

                        if ($block !== undefined) {
                            $block.focus();
                        }
                    } else {
                        if (targetChild.depth === 1) {
                            delete targetChild.depth;
                        } else {
                            targetChild.depth -= 1;
                        }

                        data.child[childIndex] = targetChild;
                        newData[index] = data;
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

                        if ($parentBlock !== undefined) {
                            const $childElement = $parentBlock.querySelectorAll("li")[childIndex];

                            if ($childElement !== undefined) {
                                const $textArea = $childElement.querySelector(".de-item-text") as HTMLParagraphElement;

                                if ($textArea !== null) {
                                    $textArea.focus();
                                }
                            }
                        }
                    }
                } else {
                    targetChild.textContent = beforeHTML;
                    data.child[childIndex] = targetChild;
                    data.child.splice(childIndex + 1, 0, _createListBlockChildData(afterHTML, targetChild.depth || 0));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

                    if ($parentBlock !== undefined) {
                        const $targetChildElement = $parentBlock.querySelectorAll(".de-item-text")[childIndex];
                        const $childElement = $parentBlock.querySelectorAll(".de-item-text")[childIndex + 1];

                        if ($childElement !== undefined) {
                            ($childElement as HTMLParagraphElement).focus();
                        }
                    }
                }
            }
        }
    }
}

// 코드블럭 쉬프트 엔터 이벤트
export async function _codeBlockShiftEnterEvent(event: KeyboardEvent, index: number) {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.element.body !== null && editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const newTextBlockData = _createTextBlockData();

        newData.splice(index + 1, 0, newTextBlockData);
        editorStore.fn.updateEditorData(newData);
        editorStore.selectedBlockIndex += 1;
        editorStore.selectedBlockId = newTextBlockData.id;
        await nextTick();
        (editorStore.element.body.children[index + 1] as HTMLParagraphElement).focus();
        _updateCursorData();
    }
}

// 블록 탭 이벤트
export async function _blockTabEvent(event: KeyboardEvent, data: DETextBlock | DEHeadingBlock, index: number, setEvent: Function, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        // 탭 이벤트
        if (event.shiftKey === false) {
            if (data.depth === undefined) {
                data.depth = 1;
            } else {
                data.depth += 1;
            }

            if (data.depth > 5) {
                data.depth = 5;
            }
        } else {
            if (data.depth !== undefined) {
                data.depth -= 1;

                if (data.depth < 0) {
                    delete data.depth;
                }
            }
        }

        abortEvent();
        newData.splice(index, 1, data);
        editorStore.fn.updateEditorData(newData);
        await nextTick();
        setEvent();
    }
}

// 리스트 탭 이벤트
export async function _listChildTabEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, setEvent: (liIndex: number, id: string) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
    const targetChild = data.child[childIndex];
    let type: "plus" | "minus" = "plus";

    event.preventDefault();
    _updateCursorData();

    if (data.child.length > 1 && editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null && targetChild !== undefined) {
        // 탭 이벤트
        if (event.shiftKey === false) {
            if (targetChild.depth === undefined) {
                targetChild.depth = 1;
            } else {
                targetChild.depth += 1;
            }

            if (targetChild.depth > 5) {
                targetChild.depth = 5;
            }
        } else {
            type = "minus";

            if (targetChild.depth !== undefined) {
                targetChild.depth -= 1;

                if (targetChild.depth <= 0) {
                    delete targetChild.depth;
                }
            }
        }

        data.child[childIndex] = targetChild;

        for (let i = 0; i < data.child.length; i += 1) {
            const child = data.child[i];

            if (i > childIndex && child !== undefined) {
                if ((child.depth || 0) <= (targetChild.depth || 0) - 1) {
                    break;
                } else {
                    if (type === "plus") {
                        if (child.depth === undefined) {
                            child.depth = 1;
                        } else {
                            child.depth += 1;
                        }

                        if (child.depth > 5) {
                            child.depth = 5;
                        }
                    } else {
                        if (child.depth !== undefined) {
                            child.depth -= 1;

                            if (child.depth <= 0) {
                                delete child.depth;
                            }
                        }
                    }
                }
            }
        }

        newData[index] = data;
        abortEvent();
        editorStore.fn.updateEditorData(newData);
        await nextTick();
        setEvent(childIndex, targetChild.id);

        const $parentBlock = editorStore.element.body.children[index] as HTMLElement;

        if ($parentBlock !== undefined) {
            const $childElement = $parentBlock.querySelectorAll("li")[childIndex];

            if ($childElement !== undefined) {
                const $textArea = $childElement.querySelector(".de-item-text") as HTMLParagraphElement;

                if ($textArea !== null) {
                    $textArea.focus();
                }
            }
        }
    }
}

// 커서 위치 이동
export function _moveBlockDefaultEvent(event: KeyboardEvent, type: "up" | "down"): void {
    const editorStore = useEditorStore();

    _updateCursorData();

    if (editorStore.element.body !== null && editorStore.selectedBlockIndex !== -1) {
        const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;
        const $targetBlock = type === "up" ? $block.previousElementSibling : $block.nextElementSibling;
        const blockType = _getBlockType($block);
        let positionData = _getMultilinePosition($block);

        if (blockType === "image") {
            positionData = _getMultilinePosition($block.querySelector(".de-caption") as HTMLParagraphElement);
        }

        if ($targetBlock !== null) {
            let logicWork: boolean = false;

            if (positionData.lineCount === 1) {
                logicWork = true;
            } else {
                if (type === "up") {
                    if (positionData.curruntLine === 1) {
                        logicWork = true;
                    }
                } else {
                    if (positionData.curruntLine === positionData.lineCount) {
                        logicWork = true;
                    }
                }
            }

            if (logicWork === true) {
                event.preventDefault();

                const $editableTarget = _findEditableElement($targetBlock as HTMLElement, type);

                if (editorStore.cursorSelection !== null && $editableTarget !== null) {
                    const range = document.createRange();

                    $editableTarget.focus();
                    range.selectNodeContents($editableTarget);

                    if (type === "up") {
                        range.collapse(false); // 마지막 줄 끝으로 이동
                    } else {
                        range.collapse(true); // 첫 번째 줄 처음으로 이동
                    }

                    editorStore.cursorSelection.removeAllRanges();
                    editorStore.cursorSelection.addRange(range);
                    _updateCursorData();
                }
            }
        }
    }
}

// 리스트 커서 위치 이동
export function _moveListChildEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, type: "up" | "down"): void {
    const editorStore = useEditorStore();

    _updateCursorData();

    if (editorStore.element.body !== null) {
        const $target = event.currentTarget as HTMLParagraphElement;
        let positionData = _getMultilinePosition($target);
        let targetType: "block" | "child" = "child";
        let logicWork: boolean = false;

        if (data.child.length === 1) {
            targetType = "block";
        } else {
            if (childIndex === 0 && type === "up") {
                targetType = "block";
            }

            if (childIndex === data.child.length - 1 && type === "down") {
                targetType = "block";
            }
        }

        if (positionData.lineCount === 1) {
            logicWork = true;
        } else {
            if (type === "up") {
                if (positionData.curruntLine === 1) {
                    logicWork = true;
                }
            } else {
                if (positionData.curruntLine === positionData.lineCount) {
                    logicWork = true;
                }
            }
        }

        if (logicWork === true) {
            const $block = editorStore.element.body.children[index] as HTMLElement;
            let $editableTarget: HTMLElement | null = null;

            event.preventDefault();

            if (targetType === "block") {
                const $targetBlock = type === "up" ? $block.previousElementSibling : $block.nextElementSibling;

                $editableTarget = _findEditableElement($targetBlock as HTMLElement, type);
            } else {
                const $targetChildElement = $block.querySelectorAll(".de-item-text");

                $editableTarget = type === "up" ? ($targetChildElement[childIndex - 1] as HTMLElement) : ($targetChildElement[childIndex + 1] as HTMLElement);
            }

            if (editorStore.cursorSelection !== null && $editableTarget !== null) {
                const range = document.createRange();

                $editableTarget.focus();
                range.selectNodeContents($editableTarget);
                if (type === "up") {
                    range.collapse(false); // 마지막 줄 끝으로 이동
                } else {
                    range.collapse(true); // 첫 번째 줄 처음으로 이동
                }
                editorStore.cursorSelection.removeAllRanges();
                editorStore.cursorSelection.addRange(range);
                _updateCursorData();
            }
        }
    }
}

// 코드블럭 커서 위치 이동
export function _moveCodeBlockEvent(event: KeyboardEvent, direction: "up" | "down", type: "filename" | "content", $targetElement: HTMLElement): void {
    const editorStore = useEditorStore();

    _updateCursorData();

    if (editorStore.cursorSelection !== null) {
        if (type === "filename") {
            event.preventDefault();

            if (direction === "up") {
                _moveBlockDefaultEvent(event, direction);
            } else {
                const range = document.createRange();

                $targetElement.focus();
                range.selectNodeContents($targetElement);
                range.collapse(true); // 첫 번째 줄 처음으로 이동

                editorStore.cursorSelection.removeAllRanges();
                editorStore.cursorSelection.addRange(range);
                _updateCursorData();
            }
        } else {
            const $content = event.currentTarget as HTMLElement;
            const positionData = _getMultilinePosition($content);

            if (direction === "up") {
                if (positionData.curruntLine === 1) {
                    event.preventDefault();

                    const range = document.createRange();

                    $targetElement.focus();
                    range.selectNodeContents($targetElement);
                    range.collapse(false);

                    editorStore.cursorSelection.removeAllRanges();
                    editorStore.cursorSelection.addRange(range);
                    _updateCursorData();
                }
            } else {
                if (positionData.curruntLine === positionData.lineCount) {
                    _moveBlockDefaultEvent(event, direction);
                }
            }
        }
    }
}

// 기본 삭제 이벤트
export async function _defaultBackspaceEvent(event: KeyboardEvent): Promise<void> {
    const editorStore = useEditorStore();
    const $target = event.currentTarget as HTMLElement;

    _updateCursorData();

    if ($target !== null && editorStore.element.body !== null && editorStore.fn.updateEditorData !== null) {
        const multilinePosition = _getMultilinePosition($target);
        const cursorPosition = _isCursorAtLineBoundary();

        if (multilinePosition.curruntLine === 1 && cursorPosition.isStart === true) {
            event.preventDefault();

            const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
            const curruntData = newData[editorStore.selectedBlockIndex] as DETextBlock | DEHeadingBlock;

            if (editorStore.selectedBlockIndex === 0) {
                if (curruntData.type === "heading") {
                    newData.splice(editorStore.selectedBlockIndex, 1, _createTextBlockData(curruntData.textContent));
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    const $block = editorStore.element.body.children[0] as HTMLElement;

                    $block.focus();
                }
            } else {
                const preveiousData = newData[editorStore.selectedBlockIndex - 1] as DEBlockData;
                const $preveiousBlock = editorStore.element.body.children[editorStore.selectedBlockIndex - 1] as HTMLElement;

                if (preveiousData.type === "text" || preveiousData.type === "heading") {
                    const blockLastOffset = _getEditorbleEndPosition($preveiousBlock);

                    preveiousData.textContent += curruntData.textContent;
                    newData.splice(editorStore.selectedBlockIndex - 1, 1, preveiousData);
                    newData.splice(editorStore.selectedBlockIndex, 1);
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    const $block = editorStore.element.body.children[editorStore.selectedBlockIndex - 1] as HTMLElement;
                    const $blockTargetNode = $block.childNodes[blockLastOffset.nodeIndex];

                    if ($blockTargetNode !== undefined) {
                        _setCursorPosition($blockTargetNode, blockLastOffset.offset);
                    }
                } else if (preveiousData.type === "list") {
                    const $listItems = $preveiousBlock.querySelectorAll(".de-item-text");
                    const $listLastChild = $listItems[$listItems.length - 1] as HTMLParagraphElement;

                    if ($listLastChild !== undefined) {
                        const listChildOffset = _getEditorbleEndPosition($listLastChild);
                        const listChildData = preveiousData.child[preveiousData.child.length - 1] as DEListItem;

                        listChildData.textContent += curruntData.textContent;
                        preveiousData.child[preveiousData.child.length - 1] = listChildData;
                        newData.splice(editorStore.selectedBlockIndex - 1, 1, preveiousData);
                        newData.splice(editorStore.selectedBlockIndex, 1);
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $node = $listLastChild.childNodes[listChildOffset.nodeIndex];

                        if ($node !== undefined) {
                            _setCursorPosition($node, listChildOffset.offset);
                        }
                    }
                } else {
                    newData.splice(editorStore.selectedBlockIndex - 1, 1);
                    editorStore.fn.updateEditorData(newData);
                    editorStore.selectedBlockIndex -= 1;
                }
            }
        }
    }
}

