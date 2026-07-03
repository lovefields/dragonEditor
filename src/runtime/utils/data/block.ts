import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _setCursorPosition } from "../event";
import { _generateId, _getEditorbleCursorPosition } from "../data";
import { _findEditableElement, _findEditableParent, _findParentBlock } from "../node";
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

                if ("style" in block) {
                    delete block.style;
                }

                block.child.forEach((child) => {
                    if (child.textContent === "<br>") {
                        child.textContent = "";
                    }
                });
                break;

            case "image":
                if ("width" in block) {
                    delete block.width;
                }

                if ("height" in block) {
                    delete block.height;
                }

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

            case "custom":
                if ("classList" in block) {
                    delete block.classList;
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
export function _createImageBlockData(src: string, caption: string = "", useHost: boolean = true): DEImageBlock {
    const editorStore = useEditorStore();

    return {
        id: _generateId(),
        type: "image",
        classList: [],
        maxWidth: 50,
        src: useHost === true ? editorStore.option.mediaHostURL + src : src,
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

// 이미지 데이터 추가
export async function _addImageBlock(src: string, caption: string = ""): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
    const imageBlock = _createImageBlockData(src, caption);
    let targetIndex = editorStore.selectedBlockIndex;

    if (editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        if (targetIndex === -1) {
            newData.push(imageBlock);
            targetIndex = newData.length - 1;
        } else {
            newData.splice(editorStore.selectedBlockIndex + 1, 0, imageBlock);
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
                    blockList.push(_createImageBlockData(src.replace(")", ""), caption, false));
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

// 블럭 순서 이동
export async function _moveBlockIndex(duration: "first" | "up" | "down" | "last"): Promise<void> {
    const editorStore = useEditorStore();

    if (editorStore.selectedBlockIndex !== -1 && editorStore.fn.updateEditorData !== null && editorStore.element.body !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
        const curruntData = newData[editorStore.selectedBlockIndex];

        if (curruntData !== undefined) {
            switch (duration) {
                case "first":
                    newData.splice(editorStore.selectedBlockIndex, 1);
                    newData.splice(0, 0, curruntData);
                    editorStore.selectedBlockIndex = 0;
                    break;

                case "up":
                    newData.splice(editorStore.selectedBlockIndex, 1);
                    newData.splice(editorStore.selectedBlockIndex - 1, 0, curruntData);
                    editorStore.selectedBlockIndex = editorStore.selectedBlockIndex - 1;
                    break;
                case "down":
                    newData.splice(editorStore.selectedBlockIndex, 1);
                    newData.splice(editorStore.selectedBlockIndex + 1, 0, curruntData);
                    editorStore.selectedBlockIndex = editorStore.selectedBlockIndex + 1;
                    break;
                case "last":
                    newData.splice(editorStore.selectedBlockIndex, 1);
                    newData.push(curruntData);
                    editorStore.selectedBlockIndex = newData.length - 1;
                    break;
            }

            editorStore.fn.updateEditorData(newData);
            await nextTick();

            const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

            if ($block !== undefined) {
                const $editableElement = _findEditableElement($block, "down");

                if ($editableElement !== null && curruntData.type !== "custom" && curruntData.type !== "divider") {
                    $editableElement.focus();
                    $editableElement.dispatchEvent(new Event("input"));
                }
            }
        }
    }
}

// 들여쓰기 사용 가능 블럭 체크
export function _checkCanUseIndent(): boolean {
    const editorStore = useEditorStore();
    let suitable: boolean = false;

    if (editorStore.selectedBlockIndex > -1) {
        const blockData = editorStore.data[editorStore.selectedBlockIndex];

        if (blockData !== undefined) {
            if (["text", "heading", "list"].includes(blockData.type) === true) {
                suitable = true;
            }
        }
    }

    return suitable;
}

// 들여쓰기 적용
export async function _setIndentData(type: "decrease" | "increase"): Promise<void> {
    const editorStore = useEditorStore();
    const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEBlockData[];
    const blockData = newData[editorStore.selectedBlockIndex] as DETextBlock | DEHeadingBlock | DEListBlock;

    if (blockData !== undefined && editorStore.fn.updateEditorData !== null && editorStore.cursorSelection !== null && editorStore.element.body !== null) {
        const $editableElement = _findEditableParent(editorStore.cursorSelection.anchorNode as HTMLElement);

        if ($editableElement !== null) {
            const offset = _getEditorbleCursorPosition($editableElement);

            if (blockData.type === "list") {
                if (blockData.child.length > 1) {
                    const $block = _findParentBlock($editableElement);
                    let indentType: "plus" | "minus" = "plus";

                    if ($block !== null) {
                        const $childList = $block.querySelectorAll(".de-item-text");
                        let childIndex: number = -1;

                        for (let i = 0; i < $childList.length; i += 1) {
                            const $child = $childList[i];

                            if ($child === $editableElement) {
                                childIndex = i;
                                break;
                            }
                        }

                        const curruntChildData = blockData.child[childIndex];

                        if (curruntChildData !== undefined) {
                            if (type === "increase") {
                                const preChildData = blockData.child[childIndex - 1];

                                if (curruntChildData.depth === undefined) {
                                    curruntChildData.depth = 1;
                                } else {
                                    curruntChildData.depth += 1;
                                }

                                if (curruntChildData.depth > 5) {
                                    curruntChildData.depth = 5;
                                }

                                if (preChildData !== undefined && curruntChildData.depth > (preChildData.depth || 0)) {
                                    curruntChildData.depth = (preChildData.depth || 0) + 1;
                                }
                            } else {
                                indentType = "minus";

                                if (curruntChildData.depth !== undefined) {
                                    curruntChildData.depth -= 1;

                                    if (curruntChildData.depth <= 0) {
                                        delete curruntChildData.depth;
                                    }
                                }
                            }

                            blockData.child[childIndex] = curruntChildData;

                            for (let i = 0; i < blockData.child.length; i += 1) {
                                const child = blockData.child[i];

                                if (i > childIndex && child !== undefined) {
                                    if ((child.depth || 0) <= (curruntChildData.depth || 0) - 1 || (curruntChildData.depth || 0) === 0) {
                                        break;
                                    } else {
                                        if (indentType === "plus") {
                                            if (child.depth === undefined) {
                                                child.depth = 1;
                                            } else {
                                                child.depth += 1;
                                            }
                                            if (child.depth > 5) {
                                                child.depth = 5;
                                            }
                                        } else {
                                            if (child.depth !== undefined) {
                                                child.depth -= 1;
                                                if (child.depth <= 0) {
                                                    delete child.depth;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            editorStore.selectedBlockId = "";
                            newData[editorStore.selectedBlockIndex] = blockData;
                            editorStore.fn.updateEditorData(newData);
                            await nextTick();

                            const $parentBlock = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

                            if ($parentBlock !== undefined) {
                                const $textArea = $parentBlock.querySelectorAll(".de-item-text");
                                const $targetTextArea = $textArea[childIndex];

                                if ($targetTextArea !== undefined) {
                                    const $node = $targetTextArea.childNodes[offset.nodeIndex];

                                    $targetTextArea.dispatchEvent(new Event("blur"));

                                    if ($node !== undefined) {
                                        _setCursorPosition($node, offset.offset);
                                    } else {
                                        _setCursorPosition($targetTextArea, 0);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                // 탭 이벤트
                if (type === "increase") {
                    if (blockData.depth === undefined) {
                        blockData.depth = 1;
                    } else {
                        blockData.depth += 1;
                    }

                    if (blockData.depth > 5) {
                        blockData.depth = 5;
                    }
                } else {
                    if (blockData.depth !== undefined) {
                        blockData.depth -= 1;

                        if (blockData.depth <= 0) {
                            delete blockData.depth;
                        }
                    }
                }

                editorStore.selectedBlockId = "";
                newData.splice(editorStore.selectedBlockIndex, 1, blockData);
                editorStore.fn.updateEditorData(newData);
                await nextTick();

                const $block = editorStore.element.body.children[editorStore.selectedBlockIndex] as HTMLElement;

                if ($block !== undefined) {
                    const $node = $block.childNodes[offset.nodeIndex];

                    if ($node !== undefined) {
                        $block.dispatchEvent(new Event("input"));
                        _setCursorPosition($node, offset.offset);
                    }
                }
            }
        }
    }
}

// 정렬 사용 가능 확인
export function _checkCanUseAlign(): boolean {
    const editorStore = useEditorStore();
    let suitable: boolean = false;

    if (editorStore.selectedBlockIndex > -1) {
        const blockData = editorStore.data[editorStore.selectedBlockIndex];

        if (blockData !== undefined) {
            if (["text", "heading", "list", "image"].includes(blockData.type) === true) {
                suitable = true;
            }
        }
    }

    return suitable;
}
