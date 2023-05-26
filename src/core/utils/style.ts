import type {allBlock} from "../../types";
import {getCursor, setCursor} from "./cursor";
import {findEditableElement} from "./element"

function arrangementAlignClass(originList: string[], className: string): string[] {
    const alignClassList = ["d-align-left", "d-align-center", "d-align-right"];
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

function defaultDecorationMake(originData: allBlock, $target: HTMLElement, className: string): allBlock {
    const cursorData = getCursor();

    if (cursorData.startNode !== null) {
        const editableElement = findEditableElement(cursorData.startNode);

        if (cursorData.type === "Range") {
            // 선택됨
            console.log($target);
            console.log(originData);
            console.log(cursorData);
            console.log(editableElement);
        } else {
            if (cursorData.startNode.constructor.name === "Text") {
                const parentNodeClassList = [...cursorData.startNode.parentNode.classList];

                if (parentNodeClassList.indexOf(className) > -1) {
                    if (parentNodeClassList.length === 1) {
                        const textContent = cursorData.startNode.parentNode.textContent;

                        cursorData.startNode.parentNode.insertAdjacentText("afterend", textContent);
                        setCursor(getNextNode($target, cursorData.startNode.parentNode), textContent.length);
                        cursorData.startNode.parentNode.remove();
                    } else {
                        cursorData.startNode.parentNode.classList.remove(className);
                    }
                } else {
                    cursorData.startNode.parentNode.classList.add(className);
                }
            } else {
                cursorData.startNode.classList.toggle(className);
            }
        }
    }

    return originData;
}

function arrangementDecoration(originData: allBlock, $target: HTMLElement, className: string): allBlock {
    let rawData: allBlock = originData;
    // const cursorData = getCursor();

    switch (originData.type) {
        default:
            rawData = defaultDecorationMake(originData, $target, className);
    }

    // console.log($target);
    // console.log(cursorData);


    return rawData;
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
            rawData = arrangementDecoration(rawData, $target, "d-deco-bold");
            break;
        case "decorationItalic" :
            rawData = arrangementDecoration(rawData, $target, "d-deco-italic");
            break;
        case "decorationUnderline" :
            rawData = arrangementDecoration(rawData, $target, "d-deco-underline");
            break;
        case "decorationStrikethrough" :
            rawData = arrangementDecoration(rawData, $target, "d-deco-through");
            break;
        default:
            rawData = arrangementDecoration(rawData, $target, type);
    }

    return rawData;
}