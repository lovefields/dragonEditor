import type EditorInit from "./init";
import { createTextBlock } from "./block";
import { getIcon } from "./ui";

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

    structure += createControlBar(store);

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

// 컨트롤 바 생성
function createControlBar(store: EditorInit): string {
    let structure: string = "";

    structure += `<div class="de-control-bar">`;

    structure += `<button class="de-menu de-menu-add">${getIcon("plus")}</button>`;
    structure += `<button class="de-menu de-add-decoration" data-style="bold">${getIcon("decorationBold")}</button>`;

    // 블럭 추가 리스트
    structure += `<div class="de-block-menu-area">`;
    structure += `<div class="de-list">`;
    store.blockList.forEach((item) => {
        structure += `<button class="de-add-block" data-type="${item.value}">${item.name}</button>`;
    });
    structure += `</div>`;
    structure += `</div>`;

    structure += `</div>`;
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
