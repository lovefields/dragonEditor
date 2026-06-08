import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _updateCursorData } from "./index";
import { _createTextBlockData, _createHeadingBlockData, _getMultilinePosition, _getBlockType } from "../data";
import { _findEditableElement } from "../node";
import type { DETextBlock, DEHeadingBlock, DEContentData } from "../../type.mjs";

// 내용 짤라서 새로운 텍스트 블럭 생성 (엔터 이벤트)
export async function _sliceAndNewTextBlock(event: KeyboardEvent, data: DETextBlock | DEHeadingBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const range = editorStore.cursorSelection.getRangeAt(0);
        const cloneRange = range.cloneRange();
        const $target = event.currentTarget as HTMLElement;

        cloneRange.selectNodeContents($target);
        cloneRange.setEnd(range.endContainer, range.endOffset);

        const extractedFragment = cloneRange.extractContents();
        const tempDiv = document.createElement("div");

        tempDiv.appendChild(extractedFragment);

        const beforeHTML = tempDiv.innerHTML;
        const afterHTLM = $target.innerHTML;

        if (beforeHTML === "" && afterHTLM !== "") {
            // 커서 앞이 빈 경우
            newData.splice(index, 0, _createTextBlockData());
            editorStore.fn.updateEditorData(newData);
        } else if ((beforeHTML !== "" && afterHTLM === "") || (beforeHTML === "" && afterHTLM === "")) {
            // 커서 뒤가 빈 경우 && 내용이 빈 경우
            newData.splice(index + 1, 0, _createTextBlockData());
            editorStore.fn.updateEditorData(newData);
            await nextTick();
            $target.innerHTML = beforeHTML;
            $target.dispatchEvent(new Event("input"));
            await nextTick();
            ($target.nextElementSibling as HTMLParagraphElement).focus();
        } else {
            // 중간인 경우
            if (data.type === "text") {
                newData.splice(index, 0, _createTextBlockData(beforeHTML));
            } else {
                newData.splice(index, 0, _createHeadingBlockData(data.level, beforeHTML));
                newData.splice(index + 1, 1, _createTextBlockData(afterHTLM));
            }

            editorStore.fn.updateEditorData(newData);
            await nextTick();

            if (data.type === "text") {
                $target.innerHTML = afterHTLM;
                $target.focus();
                $target.dispatchEvent(new Event("input"));
            } else {
                if (editorStore.element.body !== null) {
                    const $block = editorStore.element.body.children[index + 1] as HTMLParagraphElement;

                    $block.focus();
                    $block.dispatchEvent(new Event("input"));
                }
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
        const range = editorStore.cursorSelection.getRangeAt(0);
        const cloneRange = range.cloneRange();
        const $target = event.currentTarget as HTMLElement;

        cloneRange.selectNodeContents($target);
        cloneRange.setEnd(range.endContainer, range.endOffset);

        const extractedFragment = cloneRange.extractContents();
        const tempDiv = document.createElement("div");

        tempDiv.appendChild(extractedFragment);

        const beforeHTML = tempDiv.innerHTML;
        const afterHTLM = $target.innerHTML;

        newData.splice(index + 1, 0, _createTextBlockData(afterHTLM));
        editorStore.fn.updateEditorData(newData);
        await nextTick();
        $target.innerHTML = beforeHTML;
        $target.dispatchEvent(new Event("input"));
        await nextTick();
        (editorStore.element.body.children[index + 1] as HTMLParagraphElement).focus();
        editorStore.selectedBlockIndex += 1;
        _updateCursorData();
    }
}

// 블록 탭 이벤트
export async function _blockTabEvent(event: KeyboardEvent, data: DETextBlock | DEHeadingBlock | DEListBlock, index: number, setEvent: Function, abortEvent: Function): Promise<void> {
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

