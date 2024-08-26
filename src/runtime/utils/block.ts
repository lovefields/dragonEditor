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
        default:
            typeName = "other";
    }

    return {
        $element: $block,
        type: typeName,
    };
}

// 문단 블럭 생성
export function _createTextBlock(content: string = ""): HTMLParagraphElement {
    const $paragraph = document.createElement("p");

    $paragraph.classList.add("de-block", "de-text-block");
    $paragraph.setAttribute("contenteditable", "true");

    if (content !== "") {
        $paragraph.innerHTML = content;
    }

    return $paragraph;
}

// 해딩 블럭 생성
export function _createHeadingBlock(type: string, content: string = ""): HTMLHeadingElement {
    const level: number = parseInt(type.replace("heading", ""));
    const $headingBlock = document.createElement(`h${level}`) as HTMLHeadingElement;

    $headingBlock.classList.add("de-block", "de-heading-block");
    $headingBlock.id = generateId();
    $headingBlock.dataset["level"] = String(level);
    $headingBlock.setAttribute("contenteditable", "true");

    if (content !== "") {
        $headingBlock.innerHTML = content;
    }

    return $headingBlock;
}

// 리스트 블럭 생성
export function _createListBlock(type: string, content: string[] = [""], pattern?: string): HTMLElement {
    const $block = document.createElement(type) as HTMLElement;

    $block.classList.add("de-block", "de-list-block");

    if (type === "ol") {
        ($block as HTMLOListElement).type = pattern ?? "1";
    }

    content.forEach((text: string) => {
        $block.appendChild(_createListItemBlock(text));
    });

    return $block;
}

// 리스트 아이템 블럭 생성
export function _createListItemBlock(content: string = ""): HTMLLIElement {
    const $li = document.createElement("li") as HTMLLIElement;

    $li.classList.add("de-item");
    $li.setAttribute("contenteditable", "true");

    if (content !== "") {
        $li.innerHTML = content;
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

    $wrap.classList.add("de-block", "de-image-block");
    $div.classList.add("de-image-area");
    $div.dataset["maxwidth"] = String(data.maxWidth);
    $leftBtn.classList.add("de-btn", "de-btn-left");
    $rightBtn.classList.add("de-btn", "de-btn-right");
    $image.classList.add("de-img");
    $p.contentEditable = "true";
    $p.classList.add("de-caption");

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

// 난수 아이디 생성
export function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}
