import store from "../sotre";

// 레이아웃 구성
export function setLayout() {
    let layoutStructre: string = "";

    if (store.mode === "edit") {
        layoutStructre = setEditorLayout();
        store.wrap.classList.add("de-editor");
    } else {
        layoutStructre = setViewerLayout();
        store.wrap.classList.add("de-viewer");
    }

    store.wrap.classList.add("de-wrapper");
    store.wrap.innerHTML = layoutStructre;
}

// 에디터 레이아웃 구성
function setEditorLayout(): string {
    let structure: string = "";

    structure += `<div class="de-block-list">`;
    structure += createBlockStructure();
    structure += `</div>`;

    return structure;
}

// 뷰어 레이아웃 구성
function setViewerLayout(): string {
    let structure: string = "";

    return structure;
}

// 블록 구조 생성
function createBlockStructure(): string {
    let structure: string = "";

    console.log(store.data);

    return structure;
}
