import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _generateId } from "../data";
import { _findEditableElement } from "../node";
import { DECodeLanguage } from "../../enums/codeLanguage";
import type { DEContentData, DETextBlock, DEHeadingBlock, DEHeadingElementLevel, DEBlockType, DEBlockMenutype, DECodeBlock, DEImageBlock, DEDividerBlock, DECustomBlock } from "../../type.d.mts";

// 데이터 정리
export function _arrangementContentData(data: DEContentData): DEContentData {
    const editorStore = useEditorStore();

    data.forEach((block) => {
        if ("classList" in block) {
            delete block.classList;
        }

        switch (block.type) {
            case "text":
                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;

            case "heading":
                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;

            case "list":
                block.child.forEach((child) => {
                    if ("classList" in child) {
                        delete child.classList;
                    }

                    if (child.textContent === "<br>") {
                        child.textContent = "";
                    }
                });
                break;

            case "image":
                if (editorStore.option.mediaHostURL !== "") {
                    block.src = block.src.replace(editorStore.option.mediaHostURL, "");
                }

                if (block.caption === "<br>") {
                    block.caption = "";
                }
                break;

            case "code":
                if ("theme" in block) {
                    delete block.theme;
                }

                if (block.filename === "<br>") {
                    block.filename = "";
                }

                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;
        }
    });

    return data;
}

// 텍스트 블럭 데이터 생성
export function _createTextBlockData(textContent: string = ""): DETextBlock {
    return {
        id: _generateId(),
        type: "text",
        textContent: textContent,
    };
}

// 해딩 블럭 데이터 생성
export function _createHeadingBlockData(level: DEHeadingElementLevel, textContent: string = ""): DEHeadingBlock {
    return {
        id: _generateId(),
        type: "heading",
        level: level,
        textContent: textContent,
    };
}

// 리스트 블럭 데이터 생성
export function _createListBlockData(element: DEListElementName, childList: DEListItem[] = [_createListBlockChildData()]): DEListBlock {
    return {
        id: _generateId(),
        type: "list",
        element: element,
        child: childList,
    };
}

// 리스트 블럭 자식 데이터 생성
export function _createListBlockChildData(textContent: string = "", depth: number = 0): DEListItem {
    return { id: _generateId(), depth: depth === 0 ? undefined : depth, textContent: textContent };
}

// 이미지 블럭 데이터 생성
export function _createImageBlockData(src: string, width: number, height: number): DEImageBlock {
    const editorStore = useEditorStore();

    return {
        id: _generateId(),
        type: "image",
        maxWidth: 50,
        src: editorStore.option.mediaHostURL + src,
        width: width,
        height: height,
        caption: "",
    };
}

// 코드 블럭 데이터 생성
export function _createCodeBlockData(language: keyof typeof DECodeLanguage = "text", textContent: string = "", filename: string = ""): DECodeBlock {
    return {
        id: _generateId(),
        type: "code",
        language: language,
        filename: filename,
        textContent: textContent,
    };
}

// 디바이더 블럭 데이터 생성
export function _createDividerBlockData(): DEDividerBlock {
    return {
        id: _generateId(),
        type: "divider",
    };
}

// 커스텀 블럭 데이터 생성
export function _createCustomBlockData(textContent: string = ""): DECustomBlock {
    return {
        id: _generateId(),
        type: "custom",
        textContent: textContent,
    };
}

// 블럭 타입 반환
export function _getBlockType($block: HTMLElement): DEBlockType {
    let type: DEBlockType = "text";

    switch (true) {
        case $block.classList.contains("de-text-block"):
            type = "text";
            break;

        case $block.classList.contains("de-heading-block"):
            type = "heading";
            break;

        case $block.classList.contains("de-list-block"):
            type = "list";
            break;

        case $block.classList.contains("de-image-block"):
            type = "image";
            break;

        case $block.classList.contains("de-code-block"):
            type = "code";
            break;

        case $block.classList.contains("de-custom-block"):
            type = "custom";
            break;

        case $block.classList.contains("de-divider-block"):
            type = "divider";
            break;
    }

    return type;
}

// 블럭 데이터 추가
export async function _addBlock(name: DEBlockMenutype, textContent: string = ""): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
    let newBlock: DEBlockData = _createTextBlockData(textContent);
    let targetIndex = editorStore.selectedBlockIndex;

    if (editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        switch (name) {
            case "text":
                newBlock = _createTextBlockData(textContent);
                break;

            case "heading1":
                newBlock = _createHeadingBlockData(1, textContent);
                break;

            case "heading2":
                newBlock = _createHeadingBlockData(2, textContent);
                break;

            case "heading3":
                newBlock = _createHeadingBlockData(3, textContent);
                break;

            case "unordered-list":
                newBlock = _createListBlockData("ul", [_createListBlockChildData(textContent)]);
                break;

            case "ordered-list":
                newBlock = _createListBlockData("ol", [_createListBlockChildData(textContent)]);
                break;

            case "code":
                newBlock = _createCodeBlockData("text", textContent);
                break;

            case "custom":
                newBlock = _createCustomBlockData(textContent);
                break;

            case "divider":
                newBlock = _createDividerBlockData();
                break;
        }

        if (targetIndex === -1) {
            newData.push(newBlock);
            targetIndex = newData.length - 1;
        } else {
            newData.splice(editorStore.selectedBlockIndex + 1, 0, newBlock);
            targetIndex = editorStore.selectedBlockIndex + 1;
        }

        editorStore.fn.updateEditorData(newData as DEContentData);
        await nextTick();

        const $targetBlock = editorStore.element.body.children[targetIndex] as HTMLElement;

        if ($targetBlock !== undefined) {
            const $targetNode = _findEditableElement($targetBlock, "down");

            if ($targetNode !== null) {
                $targetNode.focus();
                $targetNode.dispatchEvent(new Event("input"));
            }
        }
    }
}
