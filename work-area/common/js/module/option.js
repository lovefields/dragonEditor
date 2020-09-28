const { typeCheckThrow } = require("./default");
const { findParentByClass } = require("./selector");

export function getTextItemOption($node, _0 = typeCheckThrow($node, Node)) {
    let $item = findParentByClass($node, "djs-item");
    let itemType = $item.dataset["type"];
    let attr = {
        color: "",
        fontSize: "",
        align: "",
        bold: "",
        italic: "",
        underline: "",
        strikethrough: "",
        wordblock: "",
    };

    if ($node.constructor.name == "Text") {
        $node = $node.parentNode;
    }

    if ($node.dataset != undefined) {
        for (const [key] of Object.entries(attr)) {
            attr[key] = $node.dataset[key] == undefined ? "" : $node.dataset[key];
        }
    }

    switch ($node.tagName) {
        case "B":
            attr.bold = "true";
            break;
        case "I":
            attr.italic = "true";
            break;
        case "U":
            attr.underline = "true";
            break;
        case "DEL":
            attr.strikethrough = "true";
            break;
        case "CODE":
            if (itemType != "codeblock") {
                attr.wordblock = "true";
            }
            break;
    }

    return attr;
}

export function setTextItemOption($node, option, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(option, "object")) {
    for (const [key, value] of Object.entries(option)) {
        if (value != "") {
            $node.dataset[key] = value;
        }
    }
}
