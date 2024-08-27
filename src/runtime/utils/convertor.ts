import { _createTextBlock, _createHeadingBlock, _createListBlock, _createImageBlock, _createCustomBlock } from "./block";
import "../type.d.ts";

// 화면을 데이터로 변환
export function _getContentData($content: HTMLDivElement): DEContentData {
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
                data.push(converteUListToData($child as HTMLUListElement));
                break;
            case "OL":
                data.push(converteOListToData($child as HTMLOListElement));
                break;
            case "PRE":
                break;
            case "DIV":
                // NOTE : 대부분 DIV임
                data.push(converteDivToData($child as HTMLDivElement));
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
            case "ul":
            case "ol":
                childList.push(_createListBlock(item));
                break;
            case "image":
                childList.push(
                    _createImageBlock({
                        type: item.type,
                        src: item.src,
                        maxWidth: item.maxWidth,
                        width: item.width,
                        height: item.height,
                        caption: item.caption,
                        classList: item.classList,
                    })
                );
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

// 순서 없는 리스트 변환
function converteUListToData($child: HTMLUListElement): DEUListBlock {
    return {
        type: "ul",
        child: [...$child.children].map(($li: Element) => {
            return {
                classList: getClassListWithoutDefaultClass($li as HTMLElement),
                textContent: $li.innerHTML,
            };
        }),
    };
}

// 순서 있는 리스트 변환
function converteOListToData($child: HTMLOListElement): DEOListBlock {
    return {
        type: "ol",
        pattern: $child.type as "a" | "i" | "1" | "A" | "I",
        child: [...$child.children].map(($li: Element) => {
            return {
                classList: getClassListWithoutDefaultClass($li as HTMLElement),
                textContent: $li.innerHTML,
            };
        }),
    };
}

// Div 인 경우 변환
function converteDivToData($child: HTMLDivElement) {
    let data: DEImageBlock | DECustomBlock;

    switch (true) {
        case $child.classList.contains("de-image-block"):
            data = convertImageBlock($child);
            break;
        case $child.classList.contains("de-custom-block"):
            data = convertCustomBlock($child);
            break;
    }

    // @ts-ignore : IDE 인식 에러
    return data;
}

// 이미지 블럭 변환
function convertImageBlock($imageBlock: HTMLDivElement): DEImageBlock {
    const $imgArea = $imageBlock.querySelector(".de-image-area") as HTMLImageElement;
    const $img = $imageBlock.querySelector(".de-img") as HTMLImageElement;
    const $caption = $imageBlock.querySelector(".de-caption") as HTMLParagraphElement;

    return {
        type: "image",
        src: $img.src,
        maxWidth: parseInt($imgArea.dataset["maxwidth"] as string),
        width: $img.width,
        height: $img.height,
        caption: $caption.textContent ?? "",
        classList: getClassListWithoutDefaultClass($imageBlock),
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
