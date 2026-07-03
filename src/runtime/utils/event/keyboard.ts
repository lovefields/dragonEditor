import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _updateCursorData, _setCursorPosition } from "./index";
import { _createTextBlockData, _createHeadingBlockData, _getMultilinePosition, _getBlockType, _getBeforeAndAfterHTMLOfCursor, _createListBlockData, _createListBlockChildData, _isCursorAtLineBoundary, _getEditorbleEndPosition, _getEditorbleCursorPosition, _createDividerBlockData, _convertMarkdownToEditor, _generateId, _createCodeBlockData } from "../data";
import { _findEditableElement, _findParentBlock } from "../node";
import type { DETextBlock, DEHeadingBlock, DEContentData, DEBlockData } from "../../type.d.mts";

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
    const $target = event.currentTarget as HTMLElement;

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && $target !== null) {
        const offset = _getEditorbleCursorPosition($target);

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

                if (data.depth <= 0) {
                    delete data.depth;
                }
            }
        }

        abortEvent();
        newData.splice(index, 1, data);
        editorStore.fn.updateEditorData(newData);
        await nextTick();
        setEvent();

        const $node = $target.childNodes[offset.nodeIndex];

        if ($node !== undefined) {
            _setCursorPosition($node, offset.offset);
        }
    }
}

// 리스트 탭 이벤트
export async function _listChildTabEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, setEvent: (liIndex: number, id: string) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
    const targetChild = data.child[childIndex];
    const $target = event.currentTarget as HTMLParagraphElement;
    let type: "plus" | "minus" = "plus";

    event.preventDefault();
    _updateCursorData();

    if (data.child.length > 1 && editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null && targetChild !== undefined) {
        const offset = _getEditorbleCursorPosition($target);

        // 탭 이벤트
        if (event.shiftKey === false) {
            const preChildData = data.child[childIndex - 1];

            if (targetChild.depth === undefined) {
                targetChild.depth = 1;
            } else {
                targetChild.depth += 1;
            }

            if (targetChild.depth > 5) {
                targetChild.depth = 5;
            }

            if (preChildData !== undefined && targetChild.depth > (preChildData.depth || 0)) {
                targetChild.depth = (preChildData.depth || 0) + 1;
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
                if ((child.depth || 0) <= (targetChild.depth || 0) - 1 || (targetChild.depth || 0) === 0) {
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
            const $textArea = $parentBlock.querySelectorAll(".de-item-text");
            const $targetTextArea = $textArea[childIndex];

            if ($targetTextArea !== undefined) {
                const $node = $targetTextArea.childNodes[offset.nodeIndex];

                if ($node !== undefined) {
                    _setCursorPosition($node, offset.offset);
                } else {
                    _setCursorPosition($targetTextArea, 0);
                }
            }
        }
    }
}

// 코드블럭 탭 이벤트
export async function _codeBlockTabEvent(event: KeyboardEvent): Promise<void> {
    const editorStore = useEditorStore();
    const $target = event.currentTarget as HTMLElement;

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.cursorSelection.rangeCount > 0 && $target !== null && $target.contains(editorStore.cursorSelection.getRangeAt(0).startContainer)) {
        const range = editorStore.cursorSelection.getRangeAt(0);

        // 1. 전체 텍스트 상의 startOffsetChar, endOffsetChar 구하기
        const startRange = range.cloneRange();
        startRange.selectNodeContents($target);
        startRange.setEnd(range.startContainer, range.startOffset);
        const startOffsetChar = startRange.toString().length;

        const endRange = range.cloneRange();
        endRange.selectNodeContents($target);
        endRange.setEnd(range.endContainer, range.endOffset);
        const endOffsetChar = endRange.toString().length;

        const fullText = $target.innerText || $target.textContent || "";
        const lines = fullText.split("\n");

        // 2. 각 라인별 메타데이터 빌드
        const linesInfo: { text: string; start: number; end: number }[] = [];
        let currentOffset = 0;
        lines.forEach((lineText) => {
            const start = currentOffset;
            const end = currentOffset + lineText.length;
            linesInfo.push({ text: lineText, start, end });
            currentOffset = end + 1;
        });

        // 3. 선택 영역(startOffsetChar ~ endOffsetChar)에 포함되는 줄들 식별
        const selectedLineIndices: number[] = [];
        if (startOffsetChar === endOffsetChar) {
            // 단일 커서(Caret)의 경우 커서가 걸쳐진 줄 탐색
            let targetLineIdx = -1;
            for (let i = 0; i < linesInfo.length; i++) {
                const line = linesInfo[i]!;
                const isLast = i === linesInfo.length - 1;
                if (startOffsetChar >= line.start && (startOffsetChar <= line.end || (isLast && startOffsetChar <= line.end + 1))) {
                    targetLineIdx = i;
                    break;
                }
                if (i < linesInfo.length - 1 && startOffsetChar === linesInfo[i + 1]!.start - 1) {
                    targetLineIdx = i;
                    break;
                }
            }
            if (targetLineIdx !== -1) {
                selectedLineIndices.push(targetLineIdx);
            }
        } else {
            // 드래그 선택 범위가 있을 때 겹치는 모든 줄 식별
            linesInfo.forEach((line, idx) => {
                const hasOverlap = Math.max(startOffsetChar, line.start) < Math.min(endOffsetChar, line.end + 1);
                if (hasOverlap) {
                    selectedLineIndices.push(idx);
                }
            });
        }

        // 4. 원래 커서의 줄 기준 상대 오프셋 계산
        let startLineIdx = 0;
        let endLineIdx = 0;

        for (let i = 0; i < linesInfo.length; i++) {
            const line = linesInfo[i]!;
            const isLast = i === linesInfo.length - 1;
            if (startOffsetChar >= line.start && (startOffsetChar <= line.end || (isLast && startOffsetChar <= line.end + 1))) {
                startLineIdx = i;
            }
            if (endOffsetChar >= line.start && (endOffsetChar <= line.end || (isLast && endOffsetChar <= line.end + 1))) {
                endLineIdx = i;
            }
        }

        const startRelative = startOffsetChar - linesInfo[startLineIdx]!.start;
        const endRelative = endOffsetChar - linesInfo[endLineIdx]!.start;

        // 5. 각 줄 탭 가공 및 오프셋 보정량 계산
        const updatedLines = [...lines];
        const lineDiffs: number[] = Array(lines.length).fill(0);
        const codeBlockSpaces = editorStore.option.codeBlockSpaces;
        const addedSpacesStr = " ".repeat(codeBlockSpaces);

        linesInfo.forEach((line, idx) => {
            const isSelected = selectedLineIndices.includes(idx);
            if (isSelected) {
                let lineText = line.text;
                let diff = 0;

                if (event.shiftKey === false) {
                    // Tab 추가
                    lineText = addedSpacesStr + lineText;
                    diff = codeBlockSpaces;
                } else {
                    // Shift + Tab 제거
                    let spacesToRemove = 0;
                    for (let i = 0; i < codeBlockSpaces; i++) {
                        if (lineText[i] === " ") {
                            spacesToRemove++;
                        } else if (lineText[i] === "\t") {
                            spacesToRemove = 1;
                            break;
                        } else {
                            break;
                        }
                    }
                    if (spacesToRemove > 0) {
                        lineText = lineText.slice(spacesToRemove);
                        diff = -spacesToRemove;
                    }
                }
                updatedLines[idx] = lineText;
                lineDiffs[idx] = diff;
            }
        });

        const updatedText = updatedLines.join("\n");

        // 6. 변경된 줄 정보를 기초로 새로운 절대 줄 오프셋 계산
        const newLinesStart: number[] = [];
        let curOffset = 0;
        updatedLines.forEach((lineText) => {
            newLinesStart.push(curOffset);
            curOffset += lineText.length + 1;
        });

        // 7. 최종 Selection 시작 및 끝 오프셋 도출
        let finalStartRelative = startRelative;
        if (selectedLineIndices.includes(startLineIdx)) {
            const diff = lineDiffs[startLineIdx]!;
            if (diff > 0) {
                finalStartRelative += diff;
            } else {
                finalStartRelative = Math.max(0, finalStartRelative + diff);
            }
        }
        const newStartOffset = newLinesStart[startLineIdx]! + finalStartRelative;

        let finalEndRelative = endRelative;
        if (selectedLineIndices.includes(endLineIdx)) {
            const diff = lineDiffs[endLineIdx]!;
            if (diff > 0) {
                finalEndRelative += diff;
            } else {
                finalEndRelative = Math.max(0, finalEndRelative + diff);
            }
        }
        const newEndOffset = newLinesStart[endLineIdx]! + finalEndRelative;

        // 8. 뷰 및 DOM 반영
        $target.textContent = updatedText;
        $target.dispatchEvent(new Event("input"));

        await nextTick();

        // 9. 새로운 캐릭터 범위 기반 Selection 복원
        let selectionOffset = 0;
        let startNode: Node | null = null;
        let startNodeOffset = 0;
        let endNode: Node | null = null;
        let endNodeOffset = 0;

        function traverse(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const len = node.textContent?.length || 0;
                if (startNode === null && selectionOffset + len >= newStartOffset) {
                    startNode = node;
                    startNodeOffset = newStartOffset - selectionOffset;
                }
                if (endNode === null && selectionOffset + len >= newEndOffset) {
                    endNode = node;
                    endNodeOffset = newEndOffset - selectionOffset;
                }
                selectionOffset += len;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    traverse(node.childNodes[i]!);
                    if (startNode !== null && endNode !== null) {
                        break;
                    }
                }
            }
        }

        traverse($target);

        // Fallback 처리
        if (startNode === null) {
            startNode = $target;
            startNodeOffset = 0;
        }
        if (endNode === null) {
            endNode = $target;
            endNodeOffset = 0;
        }

        editorStore.cursorSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(startNode, startNodeOffset);
        newRange.setEnd(endNode, endNodeOffset);
        editorStore.cursorSelection.addRange(newRange);
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

                if ($targetBlock !== null) {
                    $editableTarget = _findEditableElement($targetBlock as HTMLElement, type);
                }
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

// 기본 백스페이스 이벤트
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

// 리스트 백스페이스 이벤트
export async function _listBackspaceEvent(event: KeyboardEvent, childIndex: number): Promise<void> {
    const editorStore = useEditorStore();
    const $target = event.currentTarget as HTMLElement;

    _updateCursorData();

    if ($target !== null && editorStore.element.body !== null && editorStore.fn.updateEditorData !== null) {
        const multilinePosition = _getMultilinePosition($target);
        const cursorPosition = _isCursorAtLineBoundary();

        if (multilinePosition.curruntLine === 1 && cursorPosition.isStart === true) {
            event.preventDefault();

            const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
            const curruntData = newData[editorStore.selectedBlockIndex] as DEListBlock;
            const curruntListItem = curruntData.child[childIndex];
            const $block = _findParentBlock($target);

            if ($block !== null && curruntListItem !== undefined) {
                if (childIndex === 0) {
                    if (curruntData.child.length === 1) {
                        newData.splice(editorStore.selectedBlockIndex, 1, _createTextBlockData(curruntListItem.textContent));
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $targetBlock = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

                        if ($targetBlock !== undefined) {
                            $targetBlock.focus();
                        }
                    } else {
                        curruntData.child.splice(childIndex, 1);
                        newData.splice(editorStore.selectedBlockIndex, 1, _createTextBlockData(curruntListItem.textContent), curruntData);
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $targetBlock = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

                        if ($targetBlock !== undefined) {
                            $targetBlock.focus();
                        }
                    }
                } else {
                    const preveiousListItem = curruntData.child[childIndex - 1];
                    const $listItems = $block.querySelectorAll(".de-item-text");
                    const $preveiousListBlock = $listItems[childIndex - 1] as HTMLParagraphElement;

                    if (preveiousListItem !== undefined && $preveiousListBlock !== undefined) {
                        const listChildEndOffset = _getEditorbleEndPosition($preveiousListBlock);

                        preveiousListItem.textContent += curruntListItem.textContent;
                        curruntData.child.splice(childIndex, 1);
                        newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();

                        const $targetNode = $preveiousListBlock.childNodes[listChildEndOffset.nodeIndex];

                        if ($targetNode !== undefined) {
                            _setCursorPosition($targetNode, listChildEndOffset.offset);
                        }
                    }
                }
            }
        }
    }
}

// 기본 딜리트 이벤트
export async function _defaultDeleteEvent(event: KeyboardEvent, setEvent: (index: number, id: string) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const $target = event.currentTarget as HTMLElement;

    _updateCursorData();

    if ($target !== null && editorStore.element.body !== null && editorStore.fn.updateEditorData !== null) {
        const multilinePosition = _getMultilinePosition($target);
        const cursorPosition = _isCursorAtLineBoundary();

        if (multilinePosition.curruntLine === multilinePosition.lineCount && cursorPosition.isEnd === true) {
            event.preventDefault();

            const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
            const curruntData = newData[editorStore.selectedBlockIndex] as DETextBlock | DEHeadingBlock;

            if (editorStore.selectedBlockIndex !== newData.length - 1) {
                const nextData = newData[editorStore.selectedBlockIndex + 1] as DEBlockData;
                const $nextBlock = editorStore.element.body.children[editorStore.selectedBlockIndex + 1] as HTMLElement;
                const blockLastOffset = _getEditorbleEndPosition($target);

                if (nextData.type === "text" || nextData.type === "heading") {
                    curruntData.textContent += nextData.textContent;
                    newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                    newData.splice(editorStore.selectedBlockIndex + 1, 1);
                    abortEvent();
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();
                    setEvent(editorStore.selectedBlockIndex, curruntData.id);

                    const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;
                    const $blockTargetNode = $block.childNodes[blockLastOffset.nodeIndex];

                    if ($blockTargetNode !== undefined) {
                        _setCursorPosition($blockTargetNode, blockLastOffset.offset);
                    }
                } else if (nextData.type === "list") {
                    const $listItems = $nextBlock.querySelectorAll(".de-item-text");
                    const $listLastChild = $listItems[0] as HTMLParagraphElement;

                    if ($listLastChild !== undefined) {
                        const listChildData = nextData.child[0] as DEListItem;

                        curruntData.textContent += listChildData.textContent;
                        nextData.child.splice(0, 1);
                        newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                        newData.splice(editorStore.selectedBlockIndex + 1, 1, nextData);
                        abortEvent();
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();
                        setEvent(editorStore.selectedBlockIndex, curruntData.id);

                        const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;
                        const $blockTargetNode = $block.childNodes[blockLastOffset.nodeIndex];

                        if ($blockTargetNode !== undefined) {
                            _setCursorPosition($blockTargetNode, blockLastOffset.offset);
                        }
                    }
                } else {
                    newData.splice(editorStore.selectedBlockIndex + 1, 1);
                    editorStore.fn.updateEditorData(newData);
                }
            }
        }
    }
}

// 리스트 딜리트 이벤트
export async function _listDeleteEvent(event: KeyboardEvent, childIndex: number, setEvent: (liIndex: number, id: string) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const $target = event.currentTarget as HTMLElement;

    _updateCursorData();

    if ($target !== null && editorStore.element.body !== null && editorStore.fn.updateEditorData !== null) {
        const multilinePosition = _getMultilinePosition($target);
        const cursorPosition = _isCursorAtLineBoundary();

        if (multilinePosition.curruntLine === multilinePosition.lineCount && cursorPosition.isEnd === true) {
            event.preventDefault();

            const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
            const curruntData = newData[editorStore.selectedBlockIndex] as DEListBlock;
            const curruntListItem = curruntData.child[childIndex];
            const blockLastOffset = _getEditorbleEndPosition($target);
            const $block = _findParentBlock($target);

            if ($block !== null && curruntListItem !== undefined) {
                if (childIndex === curruntData.child.length - 1) {
                    const nextData = newData[editorStore.selectedBlockIndex + 1] as DEBlockData;
                    const $nextBlock = editorStore.element.body.children[editorStore.selectedBlockIndex + 1] as HTMLElement;

                    if (nextData.type === "text" || nextData.type === "heading") {
                        curruntListItem.textContent += nextData.textContent;
                        curruntData.child.splice(childIndex, 1, curruntListItem);
                        newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                        newData.splice(editorStore.selectedBlockIndex + 1, 1);
                        abortEvent();
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();
                        setEvent(childIndex, curruntListItem.id);

                        const $targetNode = $target.childNodes[blockLastOffset.nodeIndex];

                        if ($targetNode !== undefined) {
                            _setCursorPosition($targetNode, blockLastOffset.offset);
                        }
                    } else if (nextData.type === "list") {
                        const nextChildData = nextData.child[0] as DEListItem;

                        curruntListItem.textContent += nextChildData.textContent;
                        curruntData.child.splice(childIndex, 1, curruntListItem);
                        nextData.child.splice(0, 1);
                        newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                        newData.splice(editorStore.selectedBlockIndex + 1, 1, nextData);
                        abortEvent();
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();
                        setEvent(childIndex, curruntListItem.id);

                        const $targetNode = $target.childNodes[blockLastOffset.nodeIndex];

                        if ($targetNode !== undefined) {
                            _setCursorPosition($targetNode, blockLastOffset.offset);
                        }
                    } else {
                        newData.splice(editorStore.selectedBlockIndex + 1, 1);
                        editorStore.fn.updateEditorData(newData);
                    }
                } else {
                    const nextListItem = curruntData.child[childIndex + 1];
                    const $listItems = $block.querySelectorAll(".de-item-text");
                    const $nextListBlock = $listItems[childIndex + 1] as HTMLParagraphElement;

                    if (nextListItem !== undefined && $nextListBlock !== undefined) {
                        curruntListItem.textContent += nextListItem.textContent;
                        curruntData.child.splice(childIndex, 1, curruntListItem);
                        curruntData.child.splice(childIndex + 1, 1);
                        newData.splice(editorStore.selectedBlockIndex, 1, curruntData);
                        abortEvent();
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();
                        setEvent(childIndex, curruntListItem.id);

                        const $targetNode = $target.childNodes[blockLastOffset.nodeIndex];

                        if ($targetNode !== undefined) {
                            _setCursorPosition($targetNode, blockLastOffset.offset);
                        }
                    }
                }
            }
        }
    }
}

// 기본 붙여넣기 이벤트
export async function _allDataPasteEvent(event: ClipboardEvent, setEvent: Function, abortEvent: Function): Promise<void> {
    event.preventDefault();
    _updateCursorData();

    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
    const curruntData = newData[editorStore.selectedBlockIndex];
    const textData = await navigator.clipboard.readText();
    const $target = event.target as HTMLElement;

    if (editorStore.fn.updateEditorData !== null && editorStore.cursorSelection !== null) {
        if (textData === "") {
            // 이미지 데이터
            const clipboardItems = await navigator.clipboard.read();

            if (editorStore.fn.uploadImage !== null) {
                const imageItem = clipboardItems[0]!.types.find((type) => type.startsWith("image/"));

                if (imageItem !== undefined) {
                    const blob = await clipboardItems[0]!.getType(imageItem);
                    const file = new File([blob], `${_generateId()}.${imageItem.split("/")[1]}`);

                    editorStore.fn.uploadImage([file]);
                }
            }
        } else {
            // 텍스트 데이터
            const dataLine: string[] = textData.split("\n");
            const blockData = await _convertMarkdownToEditor(dataLine);
            const firstBlockData = blockData[0] as DEBlockData;

            if (dataLine.length === 1 && firstBlockData.type === "text") {
                // 단순 붙여넣기
                const textNode = document.createTextNode(firstBlockData.textContent);
                abortEvent();
                editorStore.cursorSelection.deleteFromDocument();
                editorStore.cursorSelection.getRangeAt(0).insertNode(textNode);
                $target.dispatchEvent(new Event("input"));
                setEvent();
                _setCursorPosition(textNode, textNode.length);
            } else {
                // 마크다운 붙여넣기
                if (editorStore.selectedBlockIndex > -1) {
                    newData.splice(editorStore.selectedBlockIndex + 1, 0, ...blockData);
                } else {
                    newData.push(...blockData);
                }

                abortEvent();
                editorStore.fn.updateEditorData(newData);
                await nextTick();
            }
        }
    }
}

// 코드 블럭 붙여넣기 이벤트
export async function _normalPasteEvent(event: ClipboardEvent, setEvent: Function, abortEvent: Function): Promise<void> {
    event.preventDefault();
    _updateCursorData();

    const editorStore = useEditorStore();
    const textData = await navigator.clipboard.readText();
    const $target = event.target as HTMLElement;

    if (textData !== "" && editorStore.cursorSelection !== null && $target !== null) {
        const textNode = document.createTextNode(textData);

        if ($target.classList.contains("de-item-text") === true) {
            // 리스트 블럭 화면 컨트롤 겹침에 의한 분리
            editorStore.cursorSelection.deleteFromDocument();
            editorStore.cursorSelection.getRangeAt(0).insertNode(textNode);
            $target.dispatchEvent(new Event("input"));
            _setCursorPosition(textNode, textNode.length);
        } else {
            abortEvent();
            editorStore.cursorSelection.deleteFromDocument();
            editorStore.cursorSelection.getRangeAt(0).insertNode(textNode);
            $target.dispatchEvent(new Event("input"));
            setEvent();
            _setCursorPosition(textNode, textNode.length);
        }
    }
}

// 텍스트블럭 포멧 변경 단축키
export async function _convertTextBlockType(event: KeyboardEvent, data: DETextBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();
    const headingReg = new RegExp("^(#{1,3})");
    const orderedReg = new RegExp("^\\d*\\.");
    const unorderedReg = new RegExp("^-");

    if (editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;

        switch (true) {
            case headingReg.test(data.textContent):
                event.preventDefault();

                const match = data.textContent.match(headingReg);

                if (match !== null) {
                    const level = match[0].length as DEHeadingElementLevel;

                    newData.splice(index, 1, _createHeadingBlockData(level, data.textContent.replace(headingReg, "")));
                }
                break;

            case orderedReg.test(data.textContent):
                event.preventDefault();
                newData.splice(index, 1, _createListBlockData("ol", [_createListBlockChildData(data.textContent.replace(orderedReg, ""))]));
                break;

            case unorderedReg.test(data.textContent):
                event.preventDefault();
                newData.splice(index, 1, _createListBlockData("ul", [_createListBlockChildData(data.textContent.replace(unorderedReg, ""))]));
                break;
        }

        editorStore.fn.updateEditorData(newData);
        await nextTick();

        const $block = editorStore.element.body.children[index] as HTMLHeadingElement;

        if ($block !== undefined) {
            const $target = _findEditableElement($block, "down");

            if ($target !== null) {
                $target.focus();
                $target.dispatchEvent(new Event("input"));
            }
        }
    }
}

// 텍스트 블럭 코드블럭 전환
export async function _convertTextBlockToCodeBlock(event: KeyboardEvent, data: DETextBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();
    const regexp = new RegExp("^``");

    if (regexp.test(data.textContent) === true && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        event.preventDefault();

        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;

        newData.splice(index, 1, _createCodeBlockData());
        editorStore.fn.updateEditorData(newData);
        await nextTick();

        const $block = editorStore.element.body.children[index] as HTMLHeadingElement;

        if ($block !== undefined) {
            const $target = _findEditableElement($block, "down");

            if ($target !== null) {
                $target.focus();
                $target.dispatchEvent(new Event("input"));
            }
        }
    }
}

// 텍스트 블럭 구분선 전환
export async function _convertTextBlockToDividerBlock(event: KeyboardEvent, data: DETextBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();
    const regexp = new RegExp("^--");

    if (regexp.test(data.textContent) === true && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        event.preventDefault();

        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;

        data.textContent = "";
        newData.splice(index - 1, 0, _createDividerBlockData());
        newData.splice(index + 1, 1, data);
        editorStore.fn.updateEditorData(newData);
        await nextTick();

        const $block = editorStore.element.body.children[index + 1] as HTMLHeadingElement;

        if ($block !== undefined) {
            const $target = _findEditableElement($block, "down");

            if ($target !== null) {
                $target.innerHTML = ""; // 데이터 강제 업데이트
                $target.focus();
                $target.dispatchEvent(new Event("input"));
            }
        }
    }
}

// 헤딩 블럭 포멧 변경 단축키
export async function _convertHeadingBlockType(event: KeyboardEvent, data: DEHeadingBlock, index: number, setEvent: Function, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();
    const regexp = new RegExp("^(#{1,3})");

    if (regexp.test(data.textContent) === true && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        event.preventDefault();

        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const match = regexp.exec(data.textContent);

        if (match !== null) {
            const level = match[0].length;

            data.level = level as DEHeadingElementLevel;
            data.textContent = data.textContent.replace(regexp, "");
            newData.splice(index, 1, data);
            abortEvent();
            editorStore.fn.updateEditorData(newData);
            await nextTick();
            setEvent();

            const $block = editorStore.element.body.children[index] as HTMLHeadingElement;

            if ($block !== undefined) {
                $block.focus();
                $block.dispatchEvent(new Event("input"));
            }
        }
    }
}
