const { typeCheckThrow } = require("./default");
const { findParentByClass } = require("./selector");
const { setCursor } = require("./cursor");
const { fileUpload } = require("./file");
const { setSelection } = require("./selection");

export function contentPasteEvent(e, _0 = typeCheckThrow(e, "event")) {
    e.preventDefault();

    let selection = window.getSelection();
    let $item = findParentByClass(e.target, "djs-item");
    let type = $item.dataset["type"];
    let data = getDataAndKind(e.clipboardData || window.clipboardData);

    if (data.type == "text") {
        let textNode;

        if (type != "codeblock") {
            data = data.value.replaceAll("\n", "").replaceAll(/  +/g, " ");
        } else {
            data = data.value;
        }

        textNode = document.createTextNode(data);
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(textNode);
        setCursor(textNode, textNode.length);
    } else {
        if (condition.mediaURL !== "") {
            let $form = condition.uploadForm;
            let formData = new FormData($form);

            formData.append("type", $form.dataset["type"]);
            formData.append("file", data.value);
            formData.append("articleIdx", condition.articleIdx);
            formData.append("articleTempIdx", condition.articleTempIdx);

            fileUpload(formData);
        } else {
            console.warn(`DRAGON EDITOR - If you want upload image? set "uploadURL" first.`);
            return;
        }
    }
}

function getDataAndKind(data, _0 = typeCheckThrow(data, "datatransfer")) {
    if (data === false) {
        return undefined;
    }

    let items = data.items;

    if (items === undefined) {
        return undefined;
    }

    let count = items.length;
    let type, clipboardData;
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
