import type EditorInit from "./init";
import { generateId } from "./data";

export function createTextBlock(store: EditorInit): HTMLParagraphElement {
    const $paragraph = document.createElement("p");

    $paragraph.classList.add("de-block", "de-text-block");

    if (store.mode === "edit") {
        $paragraph.setAttribute("contenteditable", "true");
    }

    return $paragraph;
}

// 해딩 블럭 생성
// TODO : 엘리먼트 방식으로 변경
export function createHeadingBlock(store: EditorInit, type: string): HTMLElement {
    const level: number = parseInt(type.replace("heading", ""));
    const $headingBlock = document.createElement(`h${level}`);

    $headingBlock.classList.add("de-block", "de-heading-block");
    $headingBlock.id = generateId();
    $headingBlock.dataset["level"] = String(level);

    if (store.mode === "edit") {
        $headingBlock.setAttribute("contenteditable", "true");
    }

    return $headingBlock;
}

// 리스트 블럭 생성
// TODO : 엘리먼트 방식으로 변경
export function createListBlock(store: EditorInit, type: string): HTMLElement {
    const $block = document.createElement(type);

    $block.classList.add("de-block", "de-list-block");
    $block.appendChild(createListItemBlock(store));

    return $block;
}

// 리스트 아이템 블럭 생성
export function createListItemBlock(store: EditorInit): HTMLLIElement {
    const $li = document.createElement("li");

    $li.classList.add("de-item");

    if (store.mode === "edit") {
        $li.setAttribute("contenteditable", "true");
    }

    return $li;
}

// 블럭 타입 추출
export function getBlockType(element: HTMLElement) {
    const $block = element.closest(".de-block");
    let typeName: string;

    switch (true) {
        case $block.classList.contains("de-text-block"):
            typeName = "text";
            break;
        case $block.classList.contains("de-heading-block"):
            typeName = "heading";
            break;
        case $block.classList.contains("de-list-block"):
            typeName = "list";
            break;
        default:
            typeName = "other";
    }

    return {
        $element: $block,
        type: typeName,
    };
}
