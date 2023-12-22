import type EditorInit from "./init";
import { createTextBlock } from "./block";

// 레이아웃 구성
export function setLayout(store: EditorInit) {
    let layoutStructre: string = "";

    if (store.mode === "edit") {
        layoutStructre = setEditorLayout(store);
        store.wrap.classList.add("de-editor");
    } else {
        layoutStructre = setViewerLayout(store);
        store.wrap.classList.add("de-viewer");
    }

    store.wrap.classList.add("de-wrapper");
    store.wrap.innerHTML = layoutStructre;
}

// 에디터 레이아웃 구성
function setEditorLayout(store: EditorInit): string {
    let structure: string = "";

    structure += `<div class="de-control-bar">`;
    structure += "";
    structure += `</div>`;

    structure += `<div class="de-block-list">`;
    structure += createBlockStructure(store);
    structure += `</div>`;

    return structure;
}

// 뷰어 레이아웃 구성
function setViewerLayout(store: EditorInit): string {
    let structure: string = "";

    structure += createBlockStructure(store);

    return structure;
}

// 블록 구조 생성
function createBlockStructure(store: EditorInit): string {
    let structure: string = "";

    if (store.data.length === 0) {
        structure += createTextBlock(store);
    } else {
        store.data.forEach((row) => {});
    }

    return structure;
}
