// 문단 블럭 생성
export function _createTextBlock(content: string = "", isEdit: boolean = true): HTMLParagraphElement {
    const $paragraph = document.createElement("p");

    $paragraph.classList.add("de-block", "de-text-block");

    if (isEdit === true) {
        $paragraph.setAttribute("contenteditable", "true");
    }

    if (content !== "") {
        $paragraph.innerHTML = content;
    }

    return $paragraph;
}

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
