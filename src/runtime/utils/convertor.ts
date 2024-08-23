import { _createTextBlock, _createHeadingBlock, _createListBlock } from "./block";

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
                // 대부분 DIV임
                break;
        }
    });

    return data;
}

// 데이터를 화면으로 변환
export function _setContentData(data: any[], store: any) {
    const childList: any[] = [];

    data.forEach((item) => {
        switch (item.type) {
            case "text":
                childList.push(_createTextBlock(item.textContent));
                break;
            case "heading":
                childList.push(_createHeadingBlock(`heading${item.level}`, item.textContent));
                break;
            case "ul":
                childList.push(_createListBlock("ul", item.child));
                break;
            case "ol":
                childList.push(_createListBlock("ol", item.child, item.pattern));
                break;
            case "":
                break;
        }
    });

    store.$content.replaceChildren(...childList);
}

// 일반 텍스트 변환
function converteParagraphToData($child: HTMLParagraphElement): DETextBlock {
    return {
        type: "text",
        textContent: $child.innerHTML,
    };
}

// 제목 텍스트 변환
function converteHeadingToData($child: HTMLHeadingElement, level: number): DEHeadingBlock {
    return {
        type: "heading",
        level: level,
        id: $child.id,
        textContent: $child.innerHTML,
    };
}

// 순서 없는 리스트 변환
function converteUListToData($child: HTMLUListElement): DEUListBlock {
    return {
        type: "ul",
        child: [...$child.children].map(($li: Element) => {
            return $li.innerHTML;
        }),
    };
}

// 순서 있는 리스트 변환
function converteOListToData($child: HTMLOListElement): DEOListBlock {
    return {
        type: "ol",
        pattern: $child.type as "a" | "i" | "1" | "A" | "I",
        child: [...$child.children].map(($li: Element) => {
            return $li.innerHTML;
        }),
    };
}
