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
export function _createHeadingBlock(type: string, content: string = ""): HTMLElement {
    const level: number = parseInt(type.replace("heading", ""));
    const $headingBlock = document.createElement(`h${level}`);

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
    const $block = document.createElement(type);

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
    const $li = document.createElement("li");

    $li.classList.add("de-item");
    $li.setAttribute("contenteditable", "true");

    if (content !== "") {
        $li.innerHTML = content;
    }

    return $li;
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
