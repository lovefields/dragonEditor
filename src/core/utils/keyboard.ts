import { getCursor, setCursor } from "./cursor";
import { findEditableElement, findChildNumber } from "./element"

let enterCount = 0;
function enterEvent(type: string, event: KeyboardEvent, addAction: Function) {
    if (event.code === "Enter") {
        if (enterCount === 0) {
            enterCount += 1;

            const useShift = event.shiftKey;

            switch (type) {
                case "comment":
                    event.preventDefault();
                    addBrEvent();
                    break;
                default:
                    if (useShift === false) {
                        event.preventDefault();
                        addAction("addBlock", "text");
                    }
            }

            setTimeout(() => {
                enterCount = 0;
            }, 150)
        } else {
            event.preventDefault();
            setTimeout(() => {
                enterCount = 0;
            }, 150)
        }
    }
}

export function keyboardEvent(type: string, event: KeyboardEvent, addAction: Function) {
    enterEvent(type, event, addAction);

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
        textNode = document.createTextNode(value.replaceAll("\n", "").replaceAll(/  +/g, " "));
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
    const brTag = document.createElement("br");
    const selection = window.getSelection() as Selection;
    const range = document.createRange();

    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(brTag);
    range.setStart(brTag, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    const cursorData = getCursor();

    if ((cursorData.startNode as Node).constructor.name !== "Text") {
        const editableElement = findEditableElement(cursorData.startNode as HTMLElement) as HTMLElement;
        const childList = editableElement.childNodes;
        const childIdx = findChildNumber(editableElement, cursorData.startNode as HTMLElement);

        if (childList[childList.length - 1].textContent?.length === 0) {
            (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
            childList[childList.length - 1].remove();
        } else {
            setCursor(childList[childIdx + 1], 0);
        }
    }
}