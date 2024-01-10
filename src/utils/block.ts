import type EditorInit from "./init";
import { generateId } from "./data";

export function createTextBlock(store: EditorInit, childString?: string) {
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
export function createHeadingBlock(store: EditorInit, type: string, childString?: string) {
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
        default:
            typeName = "other";
    }

    return {
        element: $block,
        type: typeName,
    };
}
