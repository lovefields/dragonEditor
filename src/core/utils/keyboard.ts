function enterEvent(type: string, event: KeyboardEvent, addAction: Function) {
    if (event.code === "Enter") {
        const brtag = document.createElement("br");
        const useShift = event.shiftKey;

        switch (type) {
            case "comment":
                event.preventDefault();
                break;
            default:
                if (useShift === false) {
                    event.preventDefault();
                    addAction("addBlock", "text");
                }
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