export function _getCurruntBlock($target: EventTarget): {
    type: DEBlock;
    $element: HTMLDivElement | null;
} {
    const $block = ($target as HTMLElement).closest(".de-block") as HTMLDivElement;
    let typeName: DEBlock = "text";

    if ($block !== null) {
        switch (true) {
            case $block.classList.contains("de-text-block") === true:
                break;
        }

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
