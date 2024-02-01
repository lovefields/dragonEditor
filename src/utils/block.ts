import type EditorInit from "./init";
import { generateId } from "./data";

export function createTextBlock(store: EditorInit, childString?: string): string {
    let structure: string = "";

    structure += `<p `;
    structure += ` class="de-block de-text-block" `;
    structure += setContentEditableAttr(store.mode);
    structure += `>`;

    if (childString !== undefined) {
        structure += childString;
    }

    structure += `</p>`;

    return structure;
}

// 해딩 블럭 생성
export function createHeadingBlock(store: EditorInit, type: string, childString?: string): string {
    const level: number = parseInt(type.replace("heading", ""));
    let structure: string = "";

    structure += `<h${level} `;
    structure += ` class="de-block de-heading-block" id="${generateId()}" data-level="${level}"`;
    structure += setContentEditableAttr(store.mode);
    structure += `>`;

    if (childString !== undefined) {
        structure += childString;
    }

    structure += `</h${level}>`;

    return structure;
}

// 리스트 블럭 생성
export function createListBlock(store: EditorInit, type: string, childString?: string[]): string {
    let structure: string = "";

    structure += `<${type} class="de-block de-list-block">`;

    if (childString !== undefined) {
        // TODO : 리스트 아이템 넣기
    } else {
        structure += `<li class="de-item" `;
        structure += setContentEditableAttr(store.mode);
        structure += `></li>`;
    }

    structure += `</${type}>`;

    return structure;
}

// 리스트 아이템 블럭 생성
export function createListItemBlock(childString?: string): string {
    let structure: string = "";

    structure += `<li class="de-item" contenteditable>`;

    if (childString !== undefined) {
        structure += childString;
    }

    structure += `</li>`;

    return structure;
}

// 에디트 속성
function setContentEditableAttr(mode: string): string {
    return mode === "edit" ? " contenteditable " : "";
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
