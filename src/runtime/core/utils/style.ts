import type { allBlock, styleUtilArgument, cursorSelection } from "../../../types";
import { getCursor, setCursor } from "./cursor";
import { findEditableElement, findChildNumber } from "./element";

// 정렬 부여 함수
const alignClassList = ["d-align-left", "d-align-center", "d-align-right"];
function arrangementAlignClass(originList: string[], className: string): string[] {
    const hasClass = originList.indexOf(className) > -1;
    let array = originList;

    if (hasClass) {
        originList.splice(originList.indexOf(className), 1);
        array = originList;
    } else {
        array = originList.filter((item) => alignClassList.indexOf(item) === -1);
        array.push(className);
    }

    return array;
}

// 해딩 부여 함수
const headingClassList = ["d-h1", "d-h2", "d-h3", "d-h4", "d-h5", "d-h6"];
function arrangementHeadingClass(originList: string[], className: string): string[] {
    const hasClass = originList.indexOf(className) > -1;
    let array = originList;

    if (hasClass) {
        originList.splice(originList.indexOf(className), 1);
        array = originList;
    } else {
        array = originList.filter((item) => headingClassList.indexOf(item) === -1);
        array.push(className);
    }

    return array;
}

function getNextNode($target: Node, node: Node) {
    const childNode = $target.childNodes;
    let idx: number = -1;

    childNode.forEach((item, index) => {
        if (item === node) {
            idx = index;
        }
    });

    return childNode[idx + 1] as HTMLElement;
}

function warpStyleNode({ node, startOffset, endOffset, className, url, tagName }: { node: Node; startOffset: number; endOffset: number; className: string; url?: string; tagName: string }) {
    const text = node.textContent as string;
    const textLength = text.length;
    let startIdx = startOffset;
    let endIdx = endOffset;

    if (endOffset < startOffset) {
        startIdx = endOffset;
        endIdx = startOffset;
    }

    return `${text.substring(0, startIdx)}<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${className}">${text.substring(startIdx, endIdx)}</${tagName}>${text.substring(endIdx, textLength)}`;
}

function defaultDecorationMake({ originData, $target, className, tagName = "span", url, parentCursorData }: { originData: allBlock; $target: HTMLElement; className: string; tagName?: string; url?: string; parentCursorData: cursorSelection }): allBlock {
    let cursorData = getCursor();

    if (cursorData.startNode === null) {
        // 정보 없을시 부모 정보 사용
        cursorData = parentCursorData;
    }

    let startNode = cursorData.startNode as Node;
    let endNode = cursorData.endNode as Node;

    if (startNode !== null) {
        let editableElement = findEditableElement(startNode) as HTMLElement;

        if (editableElement === null) {
            // 에디터블 엘리먼트 존재하지 않을경우 부모 정보 기반으로 덮어 씌우기
            cursorData = parentCursorData;
            startNode = cursorData.startNode as Node;
            endNode = cursorData.endNode as Node;
            editableElement = findEditableElement(startNode) as HTMLElement;
        }

        if (cursorData.type === "Range") {
            // 선택된 상태
            if (startNode === endNode) {
                // 같은 노드간 선택
                const parentNode: HTMLElement = startNode.parentNode as HTMLElement;
                let startOffset: number = cursorData.startOffset as number;
                let endOffset: number = cursorData.endOffset as number;

                if (startOffset > endOffset) {
                    startOffset = cursorData.endOffset as number;
                    endOffset = cursorData.startOffset as number;
                }

                if (parentNode === editableElement) {
                    // 랩핑 없는 경우
                    const childNumber: number = findChildNumber(editableElement, startNode);
                    const wrpStructure: string = warpStyleNode({
                        node: parentNode.childNodes[childNumber],
                        startOffset: startOffset,
                        endOffset: endOffset,
                        className: className,
                        tagName: tagName,
                        url: url,
                    });
                    let htmlStructure: string = "";

                    parentNode.childNodes.forEach((child: ChildNode, count: number) => {
                        if (count === childNumber) {
                            htmlStructure += wrpStructure;
                        } else {
                            if (child.constructor.name === "Text") {
                                htmlStructure += child.textContent;
                            } else {
                                htmlStructure += (child as HTMLElement).outerHTML;
                            }
                        }
                    });

                    parentNode.innerHTML = htmlStructure;
                    setTimeout(() => {
                        let $cursorTarget: HTMLElement = editableElement.childNodes[childNumber + 1] as HTMLElement;
                        if (!$cursorTarget) {
                            $cursorTarget = editableElement.childNodes[childNumber] as HTMLElement;
                        }
                        const cursorLength: number = ($cursorTarget.textContent as string).length;

                        setCursor($cursorTarget, cursorLength);
                    }, 100);
                } else {
                    // 랩핑 있는경우
                    const originTag = getTagName(parentNode);
                    const childNumber: number = findChildNumber(editableElement, parentNode);
                    const classList: string[] = [...parentNode.classList];
                    const text: string = parentNode.textContent as string;
                    const hasClassIdx: number = classList.indexOf(className);

                    let startOffset: number = cursorData.startOffset as number;
                    let endOffset: number = cursorData.endOffset as number;
                    let htmlStructure: string = "";

                    if (startOffset > endOffset) {
                        startOffset = cursorData.endOffset as number;
                        endOffset = cursorData.startOffset as number;
                    }

                    if (hasClassIdx > -1) {
                        const middleClassList: string[] = [...parentNode.classList];
                        middleClassList.splice(hasClassIdx, 1);

                        htmlStructure = `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${classList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}><${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${middleClassList.join(" ")}">${text.substring(startOffset, endOffset)}</${tagName}><${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${classList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                    } else {
                        htmlStructure = `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${classList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}><${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${classList.join(" ")} ${className}">${text.substring(startOffset, endOffset)}</${tagName}><${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${classList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                    }

                    parentNode.insertAdjacentHTML("afterend", htmlStructure);
                    parentNode.remove();
                    setTimeout(() => {
                        setCursor(editableElement.childNodes[childNumber + 1], text.substring(startOffset, endOffset).length);
                    }, 100);
                }
            } else {
                // 다른 노드간 선택
                let startChild: Node = startNode;
                let endChild: Node = endNode;

                if (startNode.parentNode !== editableElement) {
                    startChild = startNode.parentNode as HTMLElement;
                }

                if (endNode.parentNode !== editableElement) {
                    endChild = endNode.parentNode as HTMLElement;
                }

                const startChildIdx: number = findChildNumber(editableElement, startChild);
                const endChildIdx: number = findChildNumber(editableElement, endChild);

                let startIdx: number = 0;
                let endIdx: number = 0;
                let startOffset: number = 0;
                let endOffset: number = 0;
                let hasClassName: boolean = true;
                let htmlStructure: string = "";

                if (startChildIdx > endChildIdx) {
                    startIdx = endChildIdx;
                    endIdx = startChildIdx;
                    startOffset = cursorData.endOffset as number;
                    endOffset = cursorData.startOffset as number;
                } else {
                    startIdx = startChildIdx;
                    endIdx = endChildIdx;
                    startOffset = cursorData.startOffset as number;
                    endOffset = cursorData.endOffset as number;
                }

                editableElement.childNodes.forEach((item, count) => {
                    if (count >= startIdx && count <= endIdx) {
                        if (item.constructor.name === "Text") {
                            hasClassName = false;
                        } else {
                            if ([...(item as HTMLElement).classList].indexOf(className) === -1) {
                                hasClassName = false;
                            }
                        }
                    }
                });

                editableElement.childNodes.forEach((child: ChildNode, count: number) => {
                    const type: string = child.constructor.name;
                    const text: string = child.textContent as string;

                    if (count > startIdx && count < endIdx) {
                        if (type === "Text") {
                            htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${className}">${child.textContent}</${tagName}>`;
                        } else {
                            if (hasClassName) {
                                if ((child as HTMLElement).classList.length === 1) {
                                    htmlStructure += child.textContent;
                                } else {
                                    (child as HTMLElement).classList.remove(className);
                                    htmlStructure += (child as HTMLElement).outerHTML;
                                }
                            } else {
                                (child as HTMLElement).classList.add(className);
                                htmlStructure += (child as HTMLElement).outerHTML;
                            }
                        }
                    } else if (count === startIdx) {
                        if (type === "Text") {
                            htmlStructure += `${text.substring(0, startOffset)}<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${className}">${text.substring(startOffset, text.length)}</${tagName}>`;
                        } else {
                            const childClassList: string[] = [...(child as HTMLElement).classList];
                            const originTag = getTagName(child as HTMLElement);

                            if (hasClassName) {
                                if (childClassList.length === 1) {
                                    htmlStructure += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${className}">${text.substring(0, startOffset)}</${originTag.name}>${text.substring(startOffset, text.length)}`;
                                } else {
                                    const classIdx: number = childClassList.indexOf(className);

                                    htmlStructure += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
                                    childClassList.splice(classIdx, 1);
                                    htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(startOffset, text.length)}</${tagName}>`;
                                }
                            } else {
                                htmlStructure += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
                                htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${childClassList.join(" ")} ${className}">${text.substring(startOffset, text.length)}</${tagName}>`;
                            }
                        }
                    } else if (count === endIdx) {
                        if (type === "Text") {
                            htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${className}">${text.substring(0, endOffset)}</${tagName}>${text.substring(endOffset, text.length)}`;
                        } else {
                            const childClassList: string[] = [...(child as HTMLElement).classList];
                            const originTag = getTagName(child as HTMLElement);

                            if (hasClassName) {
                                if (childClassList.length === 1) {
                                    htmlStructure += `${text.substring(0, endOffset)}<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${className}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                                } else {
                                    const classIdx: number = childClassList.indexOf(className);
                                    const newClassList: string[] = [...(child as HTMLElement).classList];

                                    newClassList.splice(classIdx, 1);
                                    htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${newClassList.join(" ")}">${text.substring(0, endOffset)}</${tagName}>`;
                                    htmlStructure += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                                }
                            } else {
                                htmlStructure += `<${tagName} ${url ? `href="${url}" rel="nofollow"` : ""} class="${childClassList.join(" ")} ${className}">${text.substring(0, endOffset)}</${tagName}>`;
                                htmlStructure += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                            }
                        }
                    } else {
                        if (type === "Text") {
                            htmlStructure += child.textContent;
                        } else {
                            htmlStructure += (child as HTMLElement).outerHTML;
                        }
                    }
                });

                editableElement.innerHTML = htmlStructure;

                setTimeout(() => {
                    const $target: HTMLElement = editableElement.childNodes[endIdx + 1] as HTMLElement;
                    const length: number = ($target.textContent as string).length;

                    setCursor($target, length);
                }, 100);
            }
        } else {
            // 선택 안된 상태
            if (startNode.constructor.name === "Text") {
                // 텍스트 노드인 경우
                const parentNode = startNode.parentNode as HTMLElement;
                const parentNodeClassList = [...parentNode.classList];

                if (parentNodeClassList.indexOf(className) > -1) {
                    if (parentNodeClassList.length === 1) {
                        const textContent = parentNode.textContent as string;

                        parentNode.insertAdjacentText("afterend", textContent);
                        setCursor(getNextNode($target, parentNode), textContent.length);
                        parentNode.remove();
                    } else {
                        parentNode.classList.remove(className);
                    }
                } else {
                    parentNode.classList.add(className);
                }
            } else {
                // 아닌경우 단순 클레스 조정
                (startNode as HTMLElement).classList.toggle(className);
            }
        }
    }

    return originData;
}

export function styleSettings({ kind, blockData, $target, url, cursorData }: styleUtilArgument) {
    let rawData: allBlock = blockData;

    switch (kind) {
        case "alignLeft":
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-left");
            break;
        case "alignCenter":
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-center");
            break;
        case "alignRight":
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-right");
            break;
        case "decorationBold":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-bold",
                parentCursorData: cursorData,
            });
            break;
        case "decorationItalic":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-italic",
                parentCursorData: cursorData,
            });
            break;
        case "decorationUnderline":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-underline",
                parentCursorData: cursorData,
            });
            break;
        case "decorationStrikethrough":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-through",
                parentCursorData: cursorData,
            });
            break;
        case "decorationCode":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-code",
                tagName: "code",
                parentCursorData: cursorData,
            });
            break;
        case "decorationLink":
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: "d-deco-link",
                tagName: "a",
                url: url,
                parentCursorData: cursorData,
            });
            break;
        case "heading-1":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h1");
            break;
        case "heading-2":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h2");
            break;
        case "heading-3":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h3");
            break;
        case "heading-4":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h4");
            break;
        case "heading-5":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h5");
            break;
        case "heading-6":
            rawData.classList = arrangementHeadingClass(rawData.classList, "d-h6");
            break;
        default:
            rawData = defaultDecorationMake({
                originData: rawData,
                $target: $target,
                className: kind,
                parentCursorData: cursorData,
            });
    }

    return rawData;
}

export function getTagName(node: HTMLElement) {
    const value: {
        name: string;
        href: string | null;
    } = {
        name: "span",
        href: null,
    };

    switch (node.tagName) {
        case "CODE":
            value.name = "code";
            break;
        case "A":
            value.name = "a";
            value.href = node.getAttribute("href");
            break;
    }

    return value;
}
