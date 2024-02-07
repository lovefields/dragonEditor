import type EditorInit from "./init";
import { createTextBlock } from "./block";
import { getIcon } from "./ui";

// 레이아웃 구성
export function setLayout(store: EditorInit) {
    const structureList: HTMLDivElement[] = [];
    const classList: string[] = ["de-wrapper"];

    if (store.mode === "edit") {
        structureList.push(createControlBar(store));
        structureList.push(createBlockStructure(store));

        classList.push("de-editor");
    } else {
        structureList.push(createBlockStructure(store));
        classList.push("de-viewer");
    }

    store.wrap.classList.add(...classList);
    store.wrap.replaceChildren(...structureList);
}

// 컨트롤 바 생성
function createControlBar(store: EditorInit): HTMLDivElement {
    const childList: HTMLElement[] = [];
    const styleButtonList = [
        { value: "bold", iconName: "decorationBold" },
        { value: "italic", iconName: "decorationItalic" },
        { value: "underline", iconName: "decorationUnderline" },
        { value: "strikethrough", iconName: "decorationStrikethrough" },
        { value: "code", iconName: "decorationCode" },
    ];
    const $bar = document.createElement("div");
    const $plusButton = document.createElement("button");
    const $menuArea = document.createElement("div");
    const $menuList = document.createElement("div");

    $bar.classList.add("de-control-bar");
    $menuArea.classList.add("de-block-menu-area");
    $menuList.classList.add("de-list");
    $plusButton.classList.add("de-menu", "de-menu-add");
    $plusButton.appendChild(getIcon("plus"));
    childList.push($plusButton);

    styleButtonList.forEach((item) => {
        const $button = document.createElement("button");

        $button.classList.add("de-menu", "de-add-decoration");
        $button.dataset["style"] = item.value;
        $button.appendChild(getIcon(item.iconName));

        childList.push($button);
    });

    // 블럭 추가 리스트
    store.blockList.forEach((item) => {
        const $button = document.createElement("button");

        $button.classList.add("de-add-block");
        $button.dataset["type"] = item.value;
        $button.textContent = item.name;
        $menuList.appendChild($button);
    });

    $menuArea.appendChild($menuList);
    childList.push($menuArea);
    $bar.replaceChildren(...childList);

    return $bar;
}

// 블록 구조 생성
function createBlockStructure(store: EditorInit): HTMLDivElement {
    const $list = document.createElement("div");

    $list.classList.add("de-block-list");
    $list.appendChild(createTextBlock(store));

    return $list;
}
