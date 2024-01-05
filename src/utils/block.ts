import type EditorInit from "./init";

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
        default:
            typeName = "other";
    }

    return {
        element: $block,
        type: typeName,
    };
}
