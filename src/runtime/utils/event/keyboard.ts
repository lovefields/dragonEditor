import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _updateCursorData } from "./index";
import { _createTextBlockData, _createHeadingBlockData, _getMultilinePosition, _getBlockType, _getBeforeAndAfterHTMLOfCursor, _createListBlockData, _createListBlockChildData } from "../data";
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
export async function _listBlockEnterEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, setEvent: (liIndex: number) => void, abortEvent: Function): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const $target = event.currentTarget as HTMLElement;
        const $parentBlock = _findParentBlock($target);

        if ($parentBlock !== null) {
            const childCount = $parentBlock.querySelectorAll(".de-item").length;
            const depth = parseInt($target.dataset["depth"] || "0");
            const { beforeHTML, afterHTML } = _getBeforeAndAfterHTMLOfCursor($target);

            if (childCount === 1) {
                // 자식이 한개인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    // 내용이 비어있는 경우
                    newData.splice(index, 1, _createTextBlockData());
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();

                    (editorStore.element.body.children[index] as HTMLElement).focus();
                } else {
                    data.child[childIndex]!.textContent = beforeHTML;
                    data.child.push(_createListBlockChildData(afterHTML, depth));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();
                    ($target.nextElementSibling as HTMLElement).focus();
                }
            } else if (childIndex === childCount - 1) {
                // 마지막 자식인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    // 내용이 비어있는 경우
                    data.child.splice(childIndex, 1);
                    newData[index] = data;
                    newData.splice(index + 1, 0, _createTextBlockData());
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();
                    (editorStore.element.body.children[index + 1] as HTMLElement).focus();
                } else {
                    data.child[childIndex]!.textContent = beforeHTML;
                    data.child.push(_createListBlockChildData(afterHTML, depth));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();
                    ($target.nextElementSibling as HTMLElement).focus();
                }
            } else {
                // 중간 자식인 경우

                if (beforeHTML === "" && afterHTML === "") {
                    // 내용이 비어있는 경우

                    if (depth === 0) {
                        const beforeChildList = data.child.slice(0, childIndex);
                        const afterChildList = data.child.slice(childIndex + 1);

                        newData.splice(index, 1, _createListBlockData(data.element, data.style, beforeChildList));
                        newData.splice(index + 1, 0, _createTextBlockData());
                        newData.splice(index + 2, 0, _createListBlockData(data.element, data.style, afterChildList));
                        editorStore.fn.updateEditorData(newData);
                        await nextTick();
                        (editorStore.element.body.children[index + 1] as HTMLElement).focus();
                    } else {
                        const targetChild = data.child[childIndex];

                        if (targetChild !== undefined && targetChild.depth !== undefined) {
                            if (depth === 1) {
                                delete targetChild.depth;
                            } else {
                                targetChild.depth -= 1;
                            }

                            data.child[childIndex] = targetChild;
                            newData[index] = data;
                            abortEvent();
                            editorStore.fn.updateEditorData(newData);
                            await nextTick();
                            setEvent(childIndex);
                        }
                    }
                } else {
                    data.child[childIndex]!.textContent = beforeHTML;
                    data.child.splice(childIndex + 1, 0, _createListBlockChildData(afterHTML, depth));
                    newData[index] = data;
                    editorStore.fn.updateEditorData(newData);
                    await nextTick();
                    ($target.nextElementSibling as HTMLElement).focus();
                }
            }
        }
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
export async function _listChildTabEvent(event: KeyboardEvent, data: DEListBlock, index: number, childIndex: number, setEvent: (liIndex: number) => void, abortEvent: Function): Promise<void> {
    // const editorStore = useEditorStore();
    // const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
    // const targetChild = data.child[childIndex];

    // event.preventDefault();
    // _updateCursorData();

    // if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null && targetChild !== undefined) {
    //     // 탭 이벤트
    //     if (event.shiftKey === false) {
    //         if (targetChild.depth === undefined) {
    //             targetChild.depth = 1;
    //         } else {
    //             targetChild.depth += 1;
    //         }

    //         if (targetChild.depth > 5) {
    //             targetChild.depth = 5;
    //         }
    //     } else {
    //         if (targetChild.depth !== undefined) {
    //             targetChild.depth -= 1;

    //             if (targetChild.depth < 0) {
    //                 delete targetChild.depth;
    //             }
    //         }
    //     }

    //     data.child[childIndex] = targetChild;
    //     newData[index] = data;
    //     abortEvent();
    //     editorStore.fn.updateEditorData(newData);
    //     await nextTick();
    //     setEvent(childIndex);
    // }
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
