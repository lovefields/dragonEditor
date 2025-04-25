import type { Ref } from "vue";
import { _getDefaultBlockData, _generateId, _updateModelData, _updateCursorData, _decideWhetherOpenControlBar, _updateControlBarStatus, CODEBLOCKLANG } from "../event";
import hljs from "highlight.js/lib/core";

// 블럭 추가
export function _addBlock(type: DEBlockMenutype, store: Ref<DragonEditorStore>, data?: DEBlockData) {
    const blockData = data === undefined ? _getDefaultBlockData(type) : data;
    let $block: DEBlockElement = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

    switch (blockData.type) {
        case "text":
            $block = _createTextBlock(blockData);
            break;

        case "heading":
            $block = _createHeadingBlock(blockData);
            break;

        case "image":
            $block = _createImageBlock(blockData, store.value.imageHostURL);
            break;

        case "list":
            $block = _createListBlock(blockData);
            break;

        case "code":
            $block = _createCodeBlock(blockData, store);
            break;

        case "custom":
            $block = _createCustomBlock(blockData);
            break;
    }

    if (store.value.controlStatus.$currentBlock === null) {
        if (store.value.$body !== null) {
            store.value.$body.insertAdjacentElement("beforeend", $block);
        } else {
        }
    } else {
        store.value.controlStatus.$currentBlock.insertAdjacentElement("afterend", $block);
    }

    if (blockData.type === "list") {
        ($block.children[0] as HTMLLIElement).focus();
    } else if (blockData.type === "code") {
        ($block.querySelector(".de-code-content") as HTMLElement).focus();
    } else if (blockData.type === "text" || blockData.type === "heading") {
        $block.focus();
    } else if (blockData.type === "image") {
        ($block.querySelector(".de-caption") as HTMLElement).focus();
    }

    const { type: blockType, $element } = _getCurrentBlock($block);

    store.value.activeStatus.addBlockMenu = false;
    store.value.controlStatus.currentBlockType = blockType;
    store.value.controlStatus.$currentBlock = $element;
    _updateModelData(store);
    _updateCursorData(store);
    _decideWhetherOpenControlBar(store);
}

// 현재 활성화된 블럭 찾기
export function _getCurrentBlock($target: EventTarget): {
    type: DEBlock;
    $element: HTMLDivElement | null;
} {
    const $block = ($target as HTMLElement).closest(".de-block") as HTMLDivElement;
    let typeName: DEBlock = "text";

    if ($block !== null) {
        switch (true) {
            case $block.classList.contains("de-text-block"):
                typeName = "text";
                break;

            case $block.classList.contains("de-heading-block"):
                typeName = "heading";
                break;

            case $block.classList.contains("de-list-block"):
                if ($block.tagName === "OL") {
                    typeName = "ol";
                } else {
                    typeName = "ul";
                }
                break;

            case $block.classList.contains("de-image-block"):
                typeName = "image";
                break;

            case $block.classList.contains("de-code-block"):
                typeName = "code";
                break;

            default:
                typeName = "custom";
        }
    }

    return {
        type: typeName,
        $element: $block,
    };
}

// 문단 블럭 생성
export function _createTextBlock(data: DETextBlock): HTMLParagraphElement {
    const $paragraph = document.createElement("p");

    $paragraph.classList.add("de-block", "de-text-block", ...data.classList);
    $paragraph.setAttribute("contenteditable", "true");
    $paragraph.innerHTML = data.textContent;

    return $paragraph;
}

// 해딩 블럭 생성
export function _createHeadingBlock(data: DEHeadingBlock): HTMLHeadingElement {
    const $headingBlock = document.createElement(`h${data.level}`) as HTMLHeadingElement;

    if (data.id === "") {
        $headingBlock.id = _generateId();
    } else {
        $headingBlock.id = data.id;
    }

    $headingBlock.classList.add("de-block", "de-heading-block", ...data.classList);
    $headingBlock.dataset["level"] = String(data.level);
    $headingBlock.setAttribute("contenteditable", "true");
    $headingBlock.innerHTML = data.textContent;

    return $headingBlock;
}

// 리스트 블럭 생성
export function _createListBlock(data: DEListBlock): HTMLElement {
    const $block = document.createElement(data.element) as HTMLElement;

    $block.classList.add("de-block", "de-list-block");
    $block.dataset["style"] = data.style;

    data.child.forEach((child: DEListItem) => {
        $block.appendChild(_createListItemBlock(child));
    });

    return $block;
}

// 리스트 아이템 블럭 생성
export function _createListItemBlock(child: DEListItem = { textContent: "", classList: [] }): HTMLLIElement {
    const $li = document.createElement("li") as HTMLLIElement;

    $li.classList.add("de-item", ...child.classList);
    $li.setAttribute("contenteditable", "true");
    $li.innerHTML = child.textContent;

    return $li;
}

// 이미지 블럭 생성
export function _createImageBlock(data: DEImageBlock, imageHostURL: string = ""): HTMLDivElement {
    const $wrap = document.createElement("div") as HTMLDivElement;
    const $div = document.createElement("div") as HTMLDivElement;
    const $leftBtn = document.createElement("button") as HTMLButtonElement;
    const $rightBtn = document.createElement("button") as HTMLButtonElement;
    const $image = document.createElement("img") as HTMLImageElement;
    const $p = document.createElement("p") as HTMLParagraphElement;

    $wrap.classList.add("de-block", "de-image-block", ...data.classList);
    $div.classList.add("de-image-area");
    $leftBtn.classList.add("de-btn", "de-btn-left");
    $rightBtn.classList.add("de-btn", "de-btn-right");
    $image.classList.add("de-img");
    $p.contentEditable = "true";
    $p.classList.add("de-caption");

    if (data.width / data.height < 1) {
        $div.dataset["maxwidth"] = "40";
    } else {
        $div.dataset["maxwidth"] = String(data.maxWidth);
    }

    $image.src = imageHostURL + data.src;
    $image.width = data.width;
    $image.height = data.height;
    $image.draggable = false;

    if (data.caption !== undefined) {
        $p.textContent = data.caption;
    }

    $div.appendChild($image);
    $div.appendChild($leftBtn);
    $div.appendChild($rightBtn);
    $wrap.appendChild($div);
    $wrap.appendChild($p);

    return $wrap;
}

// 코드 블럭 생성
export function _createCodeBlock(data: DECodeBlock, store: Ref<DragonEditorStore>): HTMLDivElement {
    const $wrap = document.createElement("div") as HTMLDivElement;
    const $file = document.createElement("p") as HTMLParagraphElement;
    const $lang = document.createElement("p") as HTMLParagraphElement;
    const $pre = document.createElement("pre") as HTMLPreElement;
    const $code = document.createElement("code") as HTMLElement;
    const targetValue = CODEBLOCKLANG.find((item) => item.code === data.language);

    $wrap.classList.add("de-block", "de-code-block");
    $wrap.dataset["theme"] = data.theme;
    $file.contentEditable = "true";
    $file.classList.add("de-filename");
    $file.textContent = data.filename;
    $lang.textContent = targetValue?.text ?? "Plan Text";
    $lang.classList.add("de-language");
    $pre.classList.add("de-pre");
    $code.contentEditable = "true";
    $code.classList.add("de-code-content");
    $code.innerHTML = data.textContent;

    $pre.appendChild($code);
    $wrap.appendChild($file);
    $wrap.appendChild($lang);
    $wrap.appendChild($pre);

    return $wrap;
}

// 커스텀 블럭 생성
export function _createCustomBlock(data: DECustomBlock): HTMLDivElement {
    const $block = document.createElement("div") as HTMLDivElement;

    $block.classList.add("de-block", "de-custom-block", ...data.classList);
    $block.innerHTML = data.textContent;

    return $block;
}

// 활성화 블럭 업데이트
export function _updateCurrentBlock(event: Event, store: Ref<DragonEditorStore>): void {
    let $target = event.target;

    if ($target !== null) {
        $target = $target.constructor.name === "Text" ? (($target as Node).parentElement as EventTarget) : $target;

        const $menuBar = ($target as HTMLElement).closest(".de-menu-bar");
        const $controlBar = ($target as HTMLElement).closest(".js-de-controlbar");

        if ($menuBar === null && $controlBar === null) {
            const { type, $element } = _getCurrentBlock($target);

            store.value.controlStatus.currentBlockType = type;
            store.value.controlStatus.$currentBlock = $element;
            _decideWhetherOpenControlBar(store);
            _updateControlBarStatus(store);
        }
    }
}

// 해딩 블럭 리스트 업데이트
export function _updateHeadingBlockList(store: Ref<DragonEditorStore>): void {
    if (store.value.$body !== null) {
        const $headingList = store.value.$body.querySelectorAll(".de-heading-block");

        store.value.controlStatus.anchorHeadingList = Array.from($headingList).map(($element) => {
            return {
                name: $element.textContent ?? "",
                id: $element.id ?? "",
            };
        });
    }
}

// 코드블럭 테마 변경
export function _setCodeBlockTheme(theme: DECodeblockTheme, store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        store.value.controlStatus.codeBlockTheme = theme;
        store.value.controlStatus.$currentBlock.dataset["theme"] = theme;
    }
}

// 코드블럭 언어 변경
export function _setCodeBlockLanguage(language: DECodeblockLang, store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const $target = store.value.controlStatus.$currentBlock.querySelector(".de-language");
        const $code = store.value.controlStatus.$currentBlock.querySelector(".de-code-content");

        if ($target !== null && $code !== null) {
            const targetValue = CODEBLOCKLANG.find((item) => item.code === language);

            if (targetValue !== undefined) {
                const convert = hljs.highlight($code.textContent ?? "", { language: language });

                $target.textContent = targetValue.text;
                $code.innerHTML = convert.value;
                store.value.controlStatus.codeBlockLang = targetValue.code;
            }
        }
    }
}

// 리스트 블럭 스타일 변경
export function _setListBlockStyle(style: DEListStyle, store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        store.value.controlStatus.listBlockStyle = style;
        store.value.controlStatus.$currentBlock.dataset["style"] = style;
    }
}
