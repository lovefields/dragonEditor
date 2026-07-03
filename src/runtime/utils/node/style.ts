import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _findEditableElement, _findEditableParent, _findParentBlock } from "./index";
import { _getEditorbleCursorPosition } from "../data";
import { _setCursorPosition } from "../event";
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
