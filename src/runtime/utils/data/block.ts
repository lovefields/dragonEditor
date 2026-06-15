import { _generateId } from "../data";
import type { DETextBlock, DEHeadingBlock, DEHeadingElementLevel, DEBlockType } from "../../type.mjs";

// 텍스트 블럭 데이터 생성
export function _createTextBlockData(textContent: string = ""): DETextBlock {
    return {
        id: _generateId(),
        type: "text",
        classList: [],
        textContent: textContent,
    };
}

// 해딩 블럭 데이터 생성
export function _createHeadingBlockData(level: DEHeadingElementLevel, textContent: string = ""): DEHeadingBlock {
    return {
        id: _generateId(),
        type: "heading",
        level: level,
        classList: [],
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
    return { id: _generateId(), depth: depth === 0 ? undefined : depth, classList: [], textContent: textContent };
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
