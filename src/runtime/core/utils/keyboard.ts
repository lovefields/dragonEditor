import { getCursor, setCursor } from "./cursor";
import { findEditableElement, findChildNumber } from "./element";
import { getTagName } from "./style";

// 엔터 이벤트
let enterCount = 0;
function enterEvent(type: string, event: KeyboardEvent, action: Function) {
    if (event.code === "Enter") {
        event.preventDefault();
        const useShift = event.shiftKey;

        switch (type) {
            case "image":
                action("addBlock", {
                    name: "text"
                });
                break;
            case "comment":
                addBrEvent();
                break;
            default:
                if (useShift === false) {
                    if (enterCount == 0) {
                        textEnterEvent(event, action);

                    }
                } else {
                    addBrEvent();
                }
        }

        enterCount += 1;
        setTimeout(() => {
            enterCount = 0;
        }, 150)
    }
}

// 텍스트 엔터 이벤트
function textEnterEvent(event: KeyboardEvent, action: Function) {
    const cursorData = getCursor();

    if (cursorData.startNode) {
        const editableElement = findEditableElement(cursorData.startNode as Node) as HTMLElement;
        const editableElementClassList = [...editableElement.classList].slice(0, 1);
        const startNode: Node = cursorData.startNode as Node;
        const endNode: Node = cursorData.endNode as Node;
        let startChild = startNode;
        let endChild = endNode;

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
        let preHTMLStructor: string = "";
        let nextHTMLStructor: string = "";

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

        if (editableElement.childNodes.length === 0 || (endChildIdx === editableElement.childNodes.length - 1 && (editableElement.childNodes[endChildIdx].textContent as string).length === endOffset)) {
            action("addBlock", {
                name: "text"
            });
        } else {
            editableElement.childNodes.forEach((child: ChildNode, count: number) => {
                const text: string = child.textContent as string;

                if (count < startChildIdx) { // 첫부분 ~ 선택 시작 노드 직전
                    if (child.constructor.name === "Text") {
                        preHTMLStructor += child.textContent;
                    } else {
                        preHTMLStructor += (child as HTMLElement).outerHTML;
                    }
                } else if (count > endChildIdx) { // 선택 끝 노드 ~ 마지막 노드
                    if (child.constructor.name === "Text") {
                        nextHTMLStructor += child.textContent;
                    } else {
                        nextHTMLStructor += (child as HTMLElement).outerHTML;
                    }
                } else {
                    if (startChildIdx === endChildIdx) { // 같은 노드일경우
                        if (child.constructor.name === "Text") {
                            preHTMLStructor += text.substring(0, startOffset);
                            nextHTMLStructor += text.substring(endOffset, text.length);
                        } else {
                            const childClassList: string[] = [...(child as HTMLElement).classList];
                            const originTag = getTagName(child as HTMLElement);

                            preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
                            nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                        }
                    } else {
                        if (count === startChildIdx) { // 선택 시작 노드
                            if (child.constructor.name === "Text") {
                                preHTMLStructor += text.substring(0, startOffset);
                            } else {
                                const childClassList: string[] = [...(child as HTMLElement).classList];
                                const originTag = getTagName(child as HTMLElement);

                                preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
                            }
                        } else if (count === endChildIdx) { // 선택 끝 노드
                            if (child.constructor.name === "Text") {
                                nextHTMLStructor += text.substring(endOffset, text.length);
                            } else {
                                const childClassList: string[] = [...(child as HTMLElement).classList];
                                const originTag = getTagName(child as HTMLElement);

                                nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
                            }
                        }
                    }
                }
            });

            editableElement.innerHTML = preHTMLStructor;
            action("addBlock", {
                name: "text",
                value: { classList: editableElementClassList, content: nextHTMLStructor }
            });
        }
    }
}

// 백스페이스 이벤트
function backspaceEvent(type: string, event: KeyboardEvent, action: Function, update: Function) {
    if (event.code === "Backspace") {
        if (type === "text") {
            const cursorData = getCursor();

            if (cursorData.type === "Caret" && cursorData.startOffset === 0) {
                const editableElement = findEditableElement(cursorData.startNode as Node);
                let $target = cursorData.startNode as HTMLElement;

                if ($target.constructor.name === "Text") {
                    $target = $target.parentNode as HTMLElement;
                }

                if ($target === editableElement) {
                    update();
                    event.preventDefault();
                    action("deleteBlockLocal");
                }
            }
        }
    }
}


// 키보드 이벤트 총괄
export function keyboardEvent(type: string, event: KeyboardEvent, action: Function, update: Function) {
    enterEvent(type, event, action);
    backspaceEvent(type, event, action, update);
}

export function getClipboardData(data: DataTransfer) {
    let type, clipboardData;

    if (!data) {
        type = null;
    }

    const items = data.items;

    if (items === undefined) {
        type = null;
    }

    const count = items.length;
    for (let i = 0; i < count; i += 1) {
        if (items[i].type.indexOf("image") === 0) {
            type = "image";
            clipboardData = items[i].getAsFile();
            break;
        }

        type = "text";
    }

    if (type === "text") {
        clipboardData = data.getData("text");
    }

    return {
        type: type,
        value: clipboardData,
    };
}

export function pasteText(type: string, value: string) {
    const selection = window.getSelection() as Selection;
    const range = document.createRange();
    let textNode: Text;

    if (type !== "codeBlock") {
        textNode = document.createTextNode(value.replace("\n", "").replace(/  +/g, " "));
    } else {
        textNode = document.createTextNode(value);
    }

    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(textNode);
    range.setStart(textNode, textNode.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function addBrEvent() {
    const cursorData = getCursor();

    if (cursorData.startNode) {
        let $target = cursorData.startNode;
        const preEditableElement = findEditableElement($target) as HTMLElement;

        if ($target.constructor.name === "Text") {
            $target = $target.parentNode as HTMLElement;
        }

        if (preEditableElement !== $target && $target.constructor.name !== "HTMLBRElement") { // 스타일 있는경우의 내려쓰기
            let startNode = cursorData.startNode as Node;
            let endNode = cursorData.endNode as Node;
            let startChild = startNode as HTMLElement;
            let endChild = endNode as HTMLElement;

            if (startNode.parentNode !== preEditableElement) {
                startChild = startNode.parentNode as HTMLElement;
            }

            if (endNode.parentNode !== preEditableElement) {
                endChild = endNode.parentNode as HTMLElement;
            }

            const startChildIdx: number = findChildNumber(preEditableElement, startChild);
            const endChildIdx: number = findChildNumber(preEditableElement, endChild);

            let startIdx: number = 0;
            let endIdx: number = 0;
            let startOffset: number = 0;
            let endOffset: number = 0;
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

            if (enterCount === 1) { // 문자 결합시 예외처리
                const text = startChild.textContent as string;
                startChild.textContent = text.substring(1, text.length);

                setCursor(startChild, 0);
            } else {
                if (startNode === endNode) { // 동일 노드상 처리
                    const text = startChild.textContent as string;
                    const childClassList = [...startChild.classList];
                    const tagData = getTagName(startChild);

                    htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}>`;
                    htmlStructure += `<br>`;
                    htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}>`;

                    startChild.insertAdjacentHTML("beforebegin", htmlStructure);
                    setCursor(preEditableElement.childNodes[startChildIdx + 2], 0);
                    startChild.remove();
                } else { // 다른 노드상 처리
                    preEditableElement.childNodes.forEach((child: ChildNode, count: number) => {
                        const type: string = child.constructor.name;
                        const text: string = child.textContent as string;

                        if (count > startIdx && count < endIdx) {
                            // 동장 방어용 분기점
                        } else if (count === startIdx) {
                            if (type === "Text") {
                                htmlStructure += text.substring(0, startOffset);
                            } else {
                                const childClassList: string[] = [...(child as HTMLElement).classList];
                                const tagData = getTagName(child as HTMLElement);

                                htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}><br>`;
                            }
                        } else if (count === endIdx) {
                            if (type === "Text") {
                                htmlStructure += text.substring(endOffset, text.length);
                            } else {
                                const childClassList: string[] = [...(child as HTMLElement).classList];
                                const tagData = getTagName(child as HTMLElement);

                                htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}><br>`;
                            }
                        } else {
                            if (type === "Text") {
                                htmlStructure += child.textContent;
                            } else {
                                htmlStructure += (child as HTMLElement).outerHTML;
                            }
                        }
                    });

                    preEditableElement.innerHTML = htmlStructure;
                }
            }
        } else { // 스타일 없는 경우의 내려쓰기
            const brTag = document.createElement("br");
            const selection = window.getSelection() as Selection;
            const range = document.createRange();


            if (enterCount === 1) { // 문자 결합시 예외처리
                const nextCursorData = getCursor();
                const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
                const childList = editableElement.childNodes;
                const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);

                setCursor(childList[childIdx + 2], 0);
            } else { // 영문 등 일반문자 엔터 처리
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(brTag);
                range.setStart(brTag, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                const nextCursorData = getCursor();
                const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
                const childList = editableElement.childNodes;
                const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);
                let hasText = false;

                childList.forEach((row) => {
                    if (row.constructor.name === "Text") {
                        hasText = true;
                    }
                });

                if (hasText) {
                    if (childList[childIdx + 1].textContent?.length === 0) {
                        if (childList[childIdx + 2]) {
                            if (childList[childIdx + 2].constructor.name == "HTMLBRElement") {
                                setCursor(childList[childIdx + 1], 0);
                            } else {
                                (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
                            }
                        } else {
                            (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
                        }
                    } else {
                        setCursor(childList[childIdx + 1], 0);
                    }
                } else {
                    (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
                }
            }
        }
    }
}