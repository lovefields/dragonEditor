import { _createTextBlock, _createHeadingBlock, _createListBlock, _createImageBlock, _createCodeBlock, _createCustomBlock } from "./block";
import "../type.d.ts";

// 화면을 데이터로 변환
export function _getContentData($content: HTMLDivElement, imageHostURL: string): DEContentData {
    const childList: HTMLCollection = $content.children;
    const data: DEContentData = [];

    [...childList].forEach(($child: Element) => {
        const tagName: string = $child.tagName;

        switch (tagName) {
            case "P":
                data.push(converteParagraphToData($child as HTMLParagraphElement));
                break;
            case "H1":
                data.push(converteHeadingToData($child as HTMLHeadingElement, 1));
                break;
            case "H2":
                data.push(converteHeadingToData($child as HTMLHeadingElement, 2));
                break;
            case "H3":
                data.push(converteHeadingToData($child as HTMLHeadingElement, 3));
                break;
            case "UL":
            case "OL":
                data.push(converteListToData($child as HTMLElement));
                break;
            case "DIV":
                // NOTE : 대부분 DIV임
                data.push(converteDivToData($child as HTMLDivElement, imageHostURL));
                break;
        }
    });

    return data;
}

// 데이터를 화면으로 변환
export function _setContentData(data: DEContentData, store: any) {
    const childList: HTMLElement[] = [];

    data.forEach((item) => {
        switch (item.type) {
            case "text":
                childList.push(_createTextBlock(item));
                break;
            case "heading":
                childList.push(_createHeadingBlock(item));
                break;
            case "list":
                childList.push(_createListBlock(item));
                break;
            case "image":
                childList.push(_createImageBlock(item));
                break;
            case "code":
                childList.push(_createCodeBlock(item));
                break;
            case "custom":
                childList.push(_createCustomBlock(item));
                break;
        }
    });

    store.$content.replaceChildren(...childList);
}

// 일반 텍스트 변환
function converteParagraphToData($child: HTMLParagraphElement): DETextBlock {
    return {
        type: "text",
        classList: getClassListWithoutDefaultClass($child),
        textContent: $child.innerHTML,
    };
}

// 제목 텍스트 변환
function converteHeadingToData($child: HTMLHeadingElement, level: number): DEHeadingBlock {
    return {
        type: "heading",
        level: level,
        id: $child.id,
        classList: getClassListWithoutDefaultClass($child),
        textContent: $child.innerHTML,
    };
}

// 리스트 변환
function converteListToData($child: HTMLElement): DEListBlock {
    return {
        type: "list",
        element: $child.tagName.toLowerCase() as "ol" | "ul",
        style: $child.dataset["style"] as DEListStyle,
        child: [...$child.children].map(($li: Element) => {
            return {
                classList: getClassListWithoutDefaultClass($li as HTMLElement),
                textContent: $li.innerHTML,
            };
        }),
    };
}

// Div 인 경우 변환
function converteDivToData($child: HTMLDivElement, imageHostURL: string) {
    let data: DEImageBlock | DECodeBlock | DECustomBlock;

    switch (true) {
        case $child.classList.contains("de-image-block"):
            data = convertImageBlock($child, imageHostURL);
            break;
        case $child.classList.contains("de-code-block"):
            data = convertCodeBlock($child);
            break;
        case $child.classList.contains("de-custom-block"):
            data = convertCustomBlock($child);
            break;
    }

    // @ts-ignore : IDE 인식 에러
    return data;
}

// 이미지 블럭 변환
function convertImageBlock($imageBlock: HTMLDivElement, imageHostURL: string): DEImageBlock {
    const $imgArea = $imageBlock.querySelector(".de-image-area") as HTMLImageElement;
    const $img = $imageBlock.querySelector(".de-img") as HTMLImageElement;
    const $caption = $imageBlock.querySelector(".de-caption") as HTMLParagraphElement;

    return {
        type: "image",
        src: imageHostURL === "" ? $img.src : $img.src.replace(imageHostURL, ""),
        maxWidth: parseInt($imgArea.dataset["maxwidth"] as string),
        width: $img.width,
        height: $img.height,
        caption: $caption.textContent ?? "",
        classList: getClassListWithoutDefaultClass($imageBlock),
    };
}

// 코드블럭 변환
function convertCodeBlock($codeBlock: HTMLDivElement): DECodeBlock {
    const $code = $codeBlock.querySelector(".de-code-content");
    const $file = $codeBlock.querySelector(".de-filename");
    const $lang = $codeBlock.querySelector(".de-language");

    return {
        type: "code",
        theme: $codeBlock.dataset["theme"] as string,
        filename: $file?.textContent ?? "",
        language: $lang?.textContent ?? "text",
        textContent: $code?.innerHTML ?? "",
    };
}

// 커스텀 블럭 변환
function convertCustomBlock($block: HTMLDivElement): DECustomBlock {
    return {
        type: "custom",
        classList: getClassListWithoutDefaultClass($block),
        textContent: $block.innerHTML,
    };
}

function getClassListWithoutDefaultClass($element: HTMLElement): string[] {
    const defaultClassList: string[] = ["de-block", "de-text-block", "de-heading-block", "de-list-block", "de-image-block"];

    return [...$element.classList].filter((className) => defaultClassList.includes(className) === false);
}
