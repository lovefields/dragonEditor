export function keyboardEvent(type: string, event: KeyboardEvent, addAction: Function, comment: boolean = false) {
    const keycode = event.code;

    if (keycode === "Enter") {
        event.preventDefault();
        addAction("addBlock", "text");
    }
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