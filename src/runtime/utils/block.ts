import "../type.d.ts";

// 블럭 타입 추출
export function _getBlockType(element: HTMLElement) {
    const $block = element.closest(".de-block") as Element;
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
        case $block.classList.contains("de-image-block"):
            typeName = "image";
            break;
        case $block.classList.contains("de-code-block"):
            typeName = "code";
            break;
        default:
            typeName = "other";
    }

    return {
        $element: $block,
        type: typeName,
    };
}

// 문단 블럭 생성
export function _createTextBlock(data: DETextBlock = { type: "text", classList: [], textContent: "" }): HTMLParagraphElement {
    const $paragraph = document.createElement("p");

    $paragraph.classList.add("de-block", "de-text-block", ...data.classList);
    $paragraph.setAttribute("contenteditable", "true");

    if (data.textContent !== "") {
        $paragraph.innerHTML = data.textContent;
    }

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

    if (data.textContent !== "") {
        $headingBlock.innerHTML = data.textContent;
    }

    return $headingBlock;
}

// 리스트 블럭 생성
export function _createListBlock(data: DEUListBlock | DEOListBlock): HTMLElement {
    const $block = document.createElement(data.type) as HTMLElement;

    $block.classList.add("de-block", "de-list-block");

    if (data.type === "ol") {
        ($block as HTMLOListElement).type = data.pattern ?? "1";
    }

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

    if (child.textContent !== "") {
        $li.innerHTML = child.textContent;
    }

    return $li;
}

// 이미지 블럭 생성
export function _createImageBlock(data: DEImageBlock): HTMLDivElement {
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

    $image.src = data.src;
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
export function _createCodeBlock(data: DECodeBlock): HTMLDivElement {
    const $wrap = document.createElement("div") as HTMLDivElement;
    const $file = document.createElement("p") as HTMLParagraphElement;
    const $lang = document.createElement("p") as HTMLParagraphElement;
    const $pre = document.createElement("pre") as HTMLPreElement;
    const $code = document.createElement("code") as HTMLElement;

    $wrap.classList.add("de-block", "de-code-block");
    $wrap.dataset["theme"] = data.theme;
    $file.contentEditable = "true";
    $file.classList.add("de-filename");
    $lang.textContent = data.language;
    $lang.classList.add("de-language");
    $pre.classList.add("de-pre");
    $code.contentEditable = "true";
    $code.classList.add("de-code-content");

    if (data.filename !== "") {
        $file.textContent = data.filename;
    }

    if (data.textContent !== "") {
        $code.innerHTML = data.textContent;
    }

    $pre.appendChild($code);
    $wrap.appendChild($file);
    $wrap.appendChild($lang);
    $wrap.appendChild($pre);

    return $wrap;
}

// 난수 아이디 생성
export function _generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// 커스텀 블럭 생성
export function _createCustomBlock(data: DECustomBlock): HTMLDivElement {
    const $block = document.createElement("div") as HTMLDivElement;

    $block.classList.add("de-block", "de-custom-block", ...data.classList);
    $block.innerHTML = data.textContent;

    return $block;
}
