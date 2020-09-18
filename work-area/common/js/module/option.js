const { typeCheckThrow } = require("./default");

export function getTextItemOption($node, _0 = typeCheckThrow($node, Node)) {
    let styleList = ["color", "fontSize", "align", "bold", "italic", "underline", "strikethrough"];
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
        styleList.forEach((value) => {
            attr[value] = $node.dataset[value] == undefined ? "" : $node.dataset[value];
        });
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
            attr.wordblock = "true";
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
