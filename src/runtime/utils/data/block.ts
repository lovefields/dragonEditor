import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _generateId } from "../data";
import { _findEditableElement } from "../node";
import { DECodeLanguage } from "../../enums/codeLanguage";
import type { DEContentData, DETextBlock, DEHeadingBlock, DEHeadingElementLevel, DEBlockType, DEBlockMenutype, DECodeBlock, DEImageBlock, DEDividerBlock, DECustomBlock, DEBlockData } from "../../type.d.mts";

// 데이터 정리
export function _arrangementContentData(data: DEContentData): DEContentData {
    const editorStore = useEditorStore();

    data.forEach((block) => {
        switch (block.type) {
            case "text":
                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;

            case "heading":
                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;

            case "list":
                if ("classList" in block) {
                    delete block.classList;
                }

                block.child.forEach((child) => {
                    if (child.textContent === "<br>") {
                        child.textContent = "";
                    }
                });
                break;

            case "image":
                if (editorStore.option.mediaHostURL !== "") {
                    block.src = block.src.replace(editorStore.option.mediaHostURL, "");
                }

                if (block.caption === "<br>") {
                    block.caption = "";
                }
                break;

            case "code":
                if ("classList" in block) {
                    delete block.classList;
                }

                if ("theme" in block) {
                    delete block.theme;
                }

                if (block.filename === "<br>") {
                    block.filename = "";
                }

                if (block.textContent === "<br>") {
                    block.textContent = "";
                }
                break;
        }
    });

    return data;
}

// 텍스트 블럭 데이터 생성
export function _createTextBlockData(textContent: string = ""): DETextBlock {
    return {
        id: _generateId(),
        classList: [],
        type: "text",
        textContent: textContent,
    };
}

// 해딩 블럭 데이터 생성
export function _createHeadingBlockData(level: DEHeadingElementLevel, textContent: string = ""): DEHeadingBlock {
    return {
        id: _generateId(),
        type: "heading",
        classList: [],
        level: level,
        textContent: textContent,
    };
}

// 리스트 블럭 데이터 생성
export function _createListBlockData(element: DEListElementName, childList: DEListItem[] = [_createListBlockChildData()]): DEListBlock {
    return {
        id: _generateId(),
        type: "list",
        element: element,
        child: childList,
    };
}

// 리스트 블럭 자식 데이터 생성
export function _createListBlockChildData(textContent: string = "", depth: number = 0): DEListItem {
    return { id: _generateId(), classList: [], depth: depth === 0 ? undefined : depth, textContent: textContent };
}

// 이미지 블럭 데이터 생성
export function _createImageBlockData(src: string, width: number, height: number, caption: string = "", useHost: boolean = true): DEImageBlock {
    const editorStore = useEditorStore();

    return {
        id: _generateId(),
        type: "image",
        classList: [],
        maxWidth: 50,
        src: useHost === true ? editorStore.option.mediaHostURL + src : src,
        width: width,
        height: height,
        caption: caption,
    };
}

// 코드 블럭 데이터 생성
export function _createCodeBlockData(language: keyof typeof DECodeLanguage = "text", textContent: string = "", filename: string = ""): DECodeBlock {
    return {
        id: _generateId(),
        type: "code",
        language: language,
        filename: filename,
        textContent: textContent,
    };
}

// 디바이더 블럭 데이터 생성
export function _createDividerBlockData(): DEDividerBlock {
    return {
        id: _generateId(),
        type: "divider",
    };
}

// 커스텀 블럭 데이터 생성
export function _createCustomBlockData(textContent: string = ""): DECustomBlock {
    return {
        id: _generateId(),
        type: "custom",
        textContent: textContent,
    };
}

// 블럭 타입 반환
export function _getBlockType($block: HTMLElement): DEBlockType {
    let type: DEBlockType = "text";

    switch (true) {
        case $block.classList.contains("de-text-block"):
            type = "text";
            break;

        case $block.classList.contains("de-heading-block"):
            type = "heading";
            break;

        case $block.classList.contains("de-list-block"):
            type = "list";
            break;

        case $block.classList.contains("de-image-block"):
            type = "image";
            break;

        case $block.classList.contains("de-code-block"):
            type = "code";
            break;

        case $block.classList.contains("de-custom-block"):
            type = "custom";
            break;

        case $block.classList.contains("de-divider-block"):
            type = "divider";
            break;
    }

    return type;
}

// 블럭 데이터 추가
export async function _addBlock(name: DEBlockMenutype, textContent: string = ""): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
    let newBlock: DEBlockData = _createTextBlockData(textContent);
    let targetIndex = editorStore.selectedBlockIndex;

    if (editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        switch (name) {
            case "text":
                newBlock = _createTextBlockData(textContent);
                break;

            case "heading1":
                newBlock = _createHeadingBlockData(1, textContent);
                break;

            case "heading2":
                newBlock = _createHeadingBlockData(2, textContent);
                break;

            case "heading3":
                newBlock = _createHeadingBlockData(3, textContent);
                break;

            case "unordered-list":
                newBlock = _createListBlockData("ul", [_createListBlockChildData(textContent)]);
                break;

            case "ordered-list":
                newBlock = _createListBlockData("ol", [_createListBlockChildData(textContent)]);
                break;

            case "code":
                newBlock = _createCodeBlockData("text", textContent);
                break;

            case "custom":
                newBlock = _createCustomBlockData(textContent);
                break;

            case "divider":
                newBlock = _createDividerBlockData();
                break;
        }

        if (targetIndex === -1) {
            newData.push(newBlock);
            targetIndex = newData.length - 1;
        } else {
            newData.splice(editorStore.selectedBlockIndex + 1, 0, newBlock);
            targetIndex = editorStore.selectedBlockIndex + 1;
        }

        editorStore.fn.updateEditorData(newData as DEContentData);
        await nextTick();

        const $targetBlock = editorStore.element.body.children[targetIndex] as HTMLElement;

        if ($targetBlock !== undefined) {
            const $targetNode = _findEditableElement($targetBlock, "down");

            if ($targetNode !== null) {
                $targetNode.focus();
                $targetNode.dispatchEvent(new Event("input"));
            }
        }
    }
}

// 마크다운 -> 에디터 데이터
export async function _convertMarkdownToEditor(textDataList: string[]): Promise<DEBlockData[]> {
    const blockList: DEBlockData[] = [];
    const unorderListReg = new RegExp("^( +)?(\\+|\\*|-)(?= )( )");
    const orderListReg = new RegExp("^( +)?(\\d+.)(?= )( )");
    const codeBlockReg = new RegExp("^```");
    let tempData: DEBlockData | null = null;
    let isCodeBlock: boolean = false;

    textDataList.forEach(async (blockData, lineIndex) => {
        switch (true) {
            case new RegExp("^(---|___|\\*\\*\\*)").test(blockData):
                blockList.push(_createDividerBlockData());
                break;

            case codeBlockReg.test(blockData) || isCodeBlock === true:
                if (isCodeBlock === false) {
                    // 코드 블럭 시작
                    const startLineText = blockData.split("```");
                    let codeBlockLang: DECodeLanguageList = "text";

                    isCodeBlock = true;

                    if (startLineText[1]! in DECodeLanguage === true) {
                        codeBlockLang = startLineText[1] as DECodeLanguageList;
                    }

                    tempData = {
                        id: _generateId(),
                        type: "code",
                        filename: "",
                        language: codeBlockLang,
                        textContent: "",
                    } as DECodeBlock;
                } else {
                    if (tempData !== null) {
                        if (codeBlockReg.test(blockData) !== true) {
                            // 중간
                            if (tempData.type === "code") {
                                tempData.textContent += `${blockData}\n`;
                            }
                        } else {
                            // 마지막
                            if (tempData.type === "code") {
                                tempData.textContent = tempData.textContent.trim();
                                blockList.push(tempData);
                                isCodeBlock = false;
                                tempData = null;
                            }
                        }
                    }
                }
                break;

            case orderListReg.test(blockData):
                // 순서 있는 리스트
                const olSplitText: string[] = blockData.split(new RegExp("\\d+.(?= )"));
                const olDepth: number = Math.floor(olSplitText[0]!.length / 4);

                if (tempData === null) {
                    // 리스트 시작
                    tempData = _createListBlockData("ol", [_createListBlockChildData(convertMarkdownTextToEditorText(olSplitText[1]!.trim()), olDepth)]);
                } else {
                    // 리스트 중간
                    if (tempData.type === "list") {
                        const nextLine = textDataList[lineIndex + 1];

                        tempData.child.push(_createListBlockChildData(convertMarkdownTextToEditorText(olSplitText[1]!.trim()), olDepth));

                        // 리스트 종료
                        if (nextLine !== undefined) {
                            if (orderListReg.test(nextLine) === false) {
                                blockList.push(tempData);
                                tempData = null;
                            }
                        } else {
                            blockList.push(tempData);
                            tempData = null;
                        }
                    }
                }
                break;

            case unorderListReg.test(blockData):
                // 순서 없는 리스트
                const ulSplitText: string[] = blockData.split(new RegExp("\\+|\\*|-"));
                const ulDepth: number = Math.floor(ulSplitText[0]!.length / 4);

                if (tempData === null) {
                    // 리스트 시작
                    tempData = _createListBlockData("ul", [_createListBlockChildData(convertMarkdownTextToEditorText(ulSplitText[1]!.trim()), ulDepth)]);
                } else {
                    // 리스트 중간
                    if (tempData.type === "list") {
                        const nextLine = textDataList[lineIndex + 1];

                        tempData.child.push(_createListBlockChildData(convertMarkdownTextToEditorText(ulSplitText[1]!.trim()), ulDepth));

                        // 리스트 종료
                        if (nextLine !== undefined) {
                            if (unorderListReg.test(nextLine) === false) {
                                blockList.push(tempData);
                                tempData = null;
                            }
                        } else {
                            blockList.push(tempData);
                            tempData = null;
                        }
                    }
                }
                break;

            case new RegExp("^###(?= )").test(blockData):
                // h3 블럭
                blockList.push(_createHeadingBlockData(3, convertMarkdownTextToEditorText(blockData.substring(4).trim())));
                break;

            case new RegExp("^##(?= )").test(blockData):
                // h2 블럭
                blockList.push(_createHeadingBlockData(2, convertMarkdownTextToEditorText(blockData.substring(3).trim())));
                break;

            case new RegExp("^#(?= )").test(blockData):
                // h1 블럭
                blockList.push(_createHeadingBlockData(1, convertMarkdownTextToEditorText(blockData.substring(2).trim())));
                break;

            case new RegExp("^\\!\\[.*(?=\\))").test(blockData):
                // 이미지 블럭
                const caption = blockData.match(new RegExp("^\\!\\[(.*)(?=\\])\\]\\(([^ ]*)(\\)?)"))![1];
                const src = blockData.match(new RegExp("^\\!\\[(.*)(?=\\])\\]\\(([^ ]*)(\\)?)"))![2];

                if (caption !== undefined && src !== undefined) {
                    blockList.push(_createImageBlockData(src.replace(")", ""), 0, 0, caption, false));
                }
                break;

            default:
                // 기본 텍스트 블럭
                blockList.push(_createTextBlockData(convertMarkdownTextToEditorText(blockData)));
                break;
        }
    });

    return blockList;
}
// 마크다운 텍스트 -> 에디터 스타일 텍스트
function convertMarkdownTextToEditorText(text: string): string {
    const convertText = text
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll(new RegExp("(`)([^`]+)(`)", "g"), `<span class="de-code">$2</span>`)
        .replaceAll(new RegExp("(\\*\\*)([^\\*]+)(?=\\*\\*)(\\*\\*)", "g"), `<span class="de-bold">$2</span>`)
        .replaceAll(new RegExp("(\\_\\_)([^\\_]+)(?=\\_\\_)(\\_\\_)", "g"), `<span class="de-bold">$2</span>`)
        .replaceAll(new RegExp("(\\~\\~)([^\\~]+)(?=\\~\\~)(\\~\\~)", "g"), `<span class="de-strikethrough">$2</span>`)
        .replaceAll(new RegExp("(\\*)([^\\*]+)(?=\\*)(\\*)", "g"), `<span class="de-italic">$2</span>`)
        .replaceAll(new RegExp("(\\_)([^\\_]+)(?=\\_)(\\_)", "g"), `<span class="de-italic">$2</span>`)
        .replaceAll(new RegExp("(\\[)([^\\[\\]]+)(\\])(?=\\()(\\()([^\\(\\)]+)(?=\\))(\\))", "g"), `<a class="de-link" href="$5" target="_blank">$2</a>`);
    const $block = document.createElement("p");

    $block.innerHTML = convertText;

    const newNodes: Node[] = [];

    Array.from($block.childNodes).forEach((child) => __collectLeafNodes(child));

    $block.innerHTML = "";
    newNodes.forEach((node) => {
        $block.appendChild(node);
    });

    return $block.innerHTML;

    function __collectLeafNodes(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent === "") {
                return;
            }

            let current = node.parentNode;
            const classes: string[] = [];
            let href = "";
            let target = "";

            while (current !== null && current !== $block) {
                if (current.nodeType === Node.ELEMENT_NODE) {
                    const el = current as HTMLElement;
                    el.classList.forEach((cls) => {
                        if (classes.includes(cls) === false) {
                            classes.push(cls);
                        }
                    });
                    if (el.tagName === "A") {
                        href = el.getAttribute("href") || "";
                        target = el.getAttribute("target") || "";
                    }
                }
                current = current.parentNode;
            }

            if (href !== "") {
                const $a = document.createElement("a");
                $a.setAttribute("href", href);
                if (target !== "") {
                    $a.setAttribute("target", target);
                }
                classes.forEach((cls) => $a.classList.add(cls));
                $a.textContent = node.textContent;
                newNodes.push($a);
            } else if (classes.length > 0) {
                const $span = document.createElement("span");
                classes.forEach((cls) => $span.classList.add(cls));
                $span.textContent = node.textContent;
                newNodes.push($span);
            } else {
                newNodes.push(document.createTextNode(node.textContent || ""));
            }
        } else {
            const children = Array.from(node.childNodes);
            children.forEach((child) => __collectLeafNodes(child));
        }
    }
}
