import { _generateId } from "../data";
import type { DEContentData, DETextBlock, DEHeadingBlock, DEHeadingElementLevel, DEBlockType } from "../../type.mjs";

// 데이터 정리
export function _arrangementContentData(data: DEContentData): DEContentData {
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
