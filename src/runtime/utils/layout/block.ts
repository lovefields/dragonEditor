import { h } from "vue";
import type { VNode } from "vue";

// 블럭 구조체 생성
export function _createBlockList({ blockList, isEditable, imageHostURL }: { blockList: DEContentData; isEditable: boolean; imageHostURL: string } = { blockList: [], isEditable: false, imageHostURL: "" }): VNode[] {
    const blockArray: VNode[] = [];

    if (blockList.length === 0 && isEditable === true) {
        blockArray.push(__createTextBlock(_getDefaultBlockData("text") as DETextBlock, isEditable));
    } else {
        blockList.forEach((block) => {
            switch (block.type) {
                case "text":
                    blockArray.push(__createTextBlock(block, isEditable));
                    break;

                case "heading":
                    blockArray.push(__createHeadingBlock(block, isEditable));
                    break;

                case "image":
                    blockArray.push(__createImageBlock(block, isEditable, imageHostURL));
                    break;

                case "list":
                    blockArray.push(__createListBlock(block, isEditable));
                    break;

                case "code":
                    blockArray.push(__createCodeBlock(block, isEditable));
                    break;

                default:
                    blockArray.push(__createCustomBlock(block as DECustomBlock));
            }
        });
    }

    return blockArray;
}

// 텍스트 블럭 생성
function __createTextBlock(data: DETextBlock, isEditable: boolean): VNode {
    const option: any = { class: ["de-block", "de-text-block", ...data.classList], innerHTML: data.textContent };

    if (isEditable === true) {
        option.contenteditable = true;
    }

    return h("p", option);
}

// 해딩 블럭 생성
function __createHeadingBlock(data: DEHeadingBlock, isEditable: boolean): VNode {
    const option: any = { class: ["de-block", "de-heading-block", ...data.classList], "data-level": data.level, innerHTML: data.textContent };

    if (isEditable === true) {
        option.contenteditable = true;
    }

    return h(`h${data.level}`, option);
}

// 이미지 블럭 생성
function __createImageBlock(data: DEImageBlock, isEditable: boolean, imageHostURL: string): VNode {
    const imageChild: VNode[] = [];
    const areaChild: VNode[] = [];

    areaChild.push(
        h("img", {
            class: ["de-img"],
            src: imageHostURL + data.src,
            alt: "",
            width: data.width,
            height: data.height,
            loading: "lazy",
        })
    );

    if (isEditable === true) {
        // areaChild
        // TODO : 이미지 크기 컨트롤러 추가
    }

    imageChild.push(h("div", { class: ["de-image-area"], "data-maxwidth": data.maxWidth }, areaChild));

    if (data.caption !== "") {
        const captionOption: any = { class: ["de-caption"], innerHTML: data.caption };

        if (isEditable === true) {
            captionOption.contenteditable = true;
        }

        imageChild.push(h("p", captionOption));
    }

    return h("div", { class: ["de-block", "de-image-block", ...data.classList] }, imageChild);
}

// 리스트 블럭 생성
function __createListBlock(data: DEListBlock, isEditable: boolean): VNode {
    const liList: VNode[] = [];

    data.child.forEach((child) => {
        const option: any = { class: ["de-item", ...child.classList], innerHTML: child.textContent };

        if (isEditable === true) {
            option.contenteditable = true;
        }

        liList.push(h("li", option));
    });

    return h(data.element, { class: ["de-block", "de-list-block"], "data-style": data.style }, liList);
}

// 코드 블럭 생성
function __createCodeBlock(data: DECodeBlock, isEditable: boolean): VNode {
    const childList: VNode[] = [];
    const fileNameOption: any = { class: ["de-filename"] };
    const codeOption: any = { class: ["de-code-content"], innerHTML: data.textContent };

    if (isEditable === true) {
        fileNameOption.contenteditable = true;
        codeOption.contenteditable = true;
    }

    childList.push(h("p", fileNameOption, data.filename));
    childList.push(h("p", { class: ["de-language"] }, data.language));
    childList.push(h("pre", { class: ["de-pre"] }, [h("code", codeOption)]));

    return h(
        "div",
        {
            class: ["de-block", "de-code-block"],
            "data-theme": data.theme,
        },
        childList
    );
}

// 커스텀 블럭 생성
function __createCustomBlock(data: DECustomBlock): VNode {
    return h("div", { class: ["de-block", "de-custom-block", ...data.classList], innerHTML: data.textContent });
}

// 기본 블럭 데이터 생성
export function _getDefaultBlockData(type: DEBlock): DEBlockData {
    let data: DEBlockData = { type: "text", classList: [], textContent: "" };

    switch (type) {
    }

    return data;
}
