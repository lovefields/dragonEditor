import type {allBlock} from "../../types";
import {getCursor, setCursor} from "./cursor";
import {findEditableElement, findChildNumber} from "./element"

const alignClassList = ["d-align-left", "d-align-center", "d-align-right"];

function arrangementAlignClass(originList: string[], className: string): string[] {
    const hasClass = originList.indexOf(className) > -1;
    let array = originList;

    if (hasClass) {
        originList.splice(originList.indexOf(className), 1);
        array = originList;
    } else {
        array = originList.filter(item => alignClassList.indexOf(item) === -1);
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

function warpStyleNode(node: Node, startOffset: number, endOffset: number, className: string) {
    const text = node.textContent as string;
    const textLength = text.length;
    let startIdx = startOffset;
    let endIdx = endOffset;

    if (endOffset < startOffset) {
        startIdx = endOffset;
        endIdx = startOffset;
    }

    return `${text.substring(0, startIdx)}<span class="${className}">${text.substring(startIdx, endIdx)}</span>${text.substring(endIdx, textLength)}`;
}

function defaultDecorationMake(originData: allBlock, $target: HTMLElement, className: string): allBlock {
    const cursorData = getCursor();
    const startNode = cursorData.startNode as Node;
    const endNode = cursorData.endNode as Node;

    if (startNode !== null) {
        const editableElement = findEditableElement(startNode) as HTMLElement;

        if (cursorData.type === "Range") { // 선택된 상태
            if (startNode === endNode) { // 같은 노드간 선택
                const parentNode: HTMLElement = startNode.parentNode as HTMLElement;
                let startOffset: number = cursorData.startOffset as number;
                let endOffset: number = cursorData.endOffset as number;

                if (startOffset > endOffset) {
                    startOffset = cursorData.endOffset as number;
                    endOffset = cursorData.startOffset as number;
                }

                if (parentNode === editableElement) { // 랩핑 없는 경우
                    const childNumber: number = findChildNumber(editableElement, startNode);
                    const wrpStructure: string = warpStyleNode(parentNode.childNodes[childNumber], startOffset, endOffset, className);
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
                } else {// 랩핑 있는경우
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

                        htmlStructure = `<span class="${classList.join(" ")}">${text.substring(0, startOffset)}</span><span class="${middleClassList.join(" ")}">${text.substring(startOffset, endOffset)}</span><span class="${classList.join(" ")}">${text.substring(endOffset, text.length)}</span>`;
                    } else {
                        htmlStructure = `<span class="${classList.join(" ")}">${text.substring(0, startOffset)}</span><span class="${classList.join(" ")} ${className}">${text.substring(startOffset, endOffset)}</span><span class="${classList.join(" ")}">${text.substring(endOffset, text.length)}</span>`;
                    }

                    parentNode.insertAdjacentHTML("afterend", htmlStructure);
                    parentNode.remove();
                    setTimeout(() => {
                        setCursor(editableElement.childNodes[childNumber + 1], text.substring(startOffset, endOffset).length);
                    }, 100);
                }
            } else { // 다른 노드간 선택
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
                            htmlStructure += `<span class="${className}">${child.textContent}</span>`;
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
                            htmlStructure += `${text.substring(0, startOffset)}<span class="${className}">${text.substring(startOffset, text.length)}</span>`;
                        } else {
                            const childClassList: string[] = [...(child as HTMLElement).classList];

                            if (hasClassName) {
                                if (childClassList.length === 1) {
                                    htmlStructure += `<span class="${className}">${text.substring(0, startOffset)}</span>${text.substring(startOffset, text.length)}`;
                                } else {
                                    const classIdx: number = childClassList.indexOf(className);

                                    htmlStructure += `<span class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</span>`;
                                    childClassList.splice(classIdx, 1);
                                    htmlStructure += `<span class="${childClassList.join(" ")}">${text.substring(startOffset, text.length)}</span>`;
                                }
                            } else {
                                htmlStructure += `<span class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</span>`;
                                htmlStructure += `<span class="${childClassList.join(" ")} ${className}">${text.substring(startOffset, text.length)}</span>`;
                            }
                        }
                    } else if (count === endIdx) {
                        if (type === "Text") {
                            htmlStructure += `<span class="${className}">${text.substring(0, endOffset)}</span>${text.substring(endOffset, text.length)}`;
                        } else {
                            const childClassList: string[] = [...(child as HTMLElement).classList];

                            if (hasClassName) {
                                if (childClassList.length === 1) {
                                    htmlStructure += `${text.substring(0, endOffset)}<span class="${className}">${text.substring(endOffset, text.length)}</span>`;
                                } else {
                                    const classIdx: number = childClassList.indexOf(className);
                                    const newClassList: string[] = [...(child as HTMLElement).classList];

                                    newClassList.splice(classIdx, 1);
                                    htmlStructure += `<span class="${newClassList.join(" ")}">${text.substring(0, endOffset)}</span>`;
                                    htmlStructure += `<span class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</span>`;
                                }
                            } else {
                                htmlStructure += `<span class="${childClassList.join(" ")} ${className}">${text.substring(0, endOffset)}</span>`;
                                htmlStructure += `<span class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</span>`;
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
        } else { // 선택 안된 상태
            if (startNode.constructor.name === "Text") { // 텍스트 노드인 경우
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
            } else { // 아닌경우 단순 클레스 조정
                (startNode as HTMLElement).classList.toggle(className);
            }
        }
    }

    return originData;
}

export function styleSettings(type: string, blockData: allBlock, $target: HTMLElement) {
    let rawData: allBlock = blockData;

    switch (type) {
        case "alignLeft" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-left");
            break;
        case "alignCenter" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-center");
            break;
        case "alignRight" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-right");
            break;
        case "decorationBold" :
            rawData = defaultDecorationMake(rawData, $target, "d-deco-bold");
            break;
        case "decorationItalic" :
            rawData = defaultDecorationMake(rawData, $target, "d-deco-italic");
            break;
        case "decorationUnderline" :
            rawData = defaultDecorationMake(rawData, $target, "d-deco-underline");
            break;
        case "decorationStrikethrough" :
            rawData = defaultDecorationMake(rawData, $target, "d-deco-through");
            break;
        default:
            rawData = defaultDecorationMake(rawData, $target, type);
    }

    return rawData;
}